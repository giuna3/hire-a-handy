import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Calendar, User, Menu, Grid3X3, List, Filter, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CATEGORIES } from "@/types/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Provider {
  id: string;
  name: string;
  profession: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  hourlyRate: number;
  bio: string;
}

const ClientHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providersWithServices, setProvidersWithServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineProviders, setOnlineProviders] = useState<Set<string>>(new Set());
  
  // New state for Jobs Near You section
  const [jobsSearchQuery, setJobsSearchQuery] = useState("");
  const [jobsSelectedCategory, setJobsSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  // Real-time presence tracking for provider availability
  useEffect(() => {
    const channel = supabase.channel('provider_presence');

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const onlineProviderIds = new Set<string>();
        
        Object.values(presenceState).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.user_type === 'provider') {
              onlineProviderIds.add(presence.user_id);
            }
          });
        });
        
        setOnlineProviders(onlineProviderIds);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const newOnlineProviders = new Set(onlineProviders);
        newPresences.forEach((presence: any) => {
          if (presence.user_type === 'provider') {
            newOnlineProviders.add(presence.user_id);
          }
        });
        setOnlineProviders(newOnlineProviders);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const newOnlineProviders = new Set(onlineProviders);
        leftPresences.forEach((presence: any) => {
          if (presence.user_type === 'provider') {
            newOnlineProviders.delete(presence.user_id);
          }
        });
        setOnlineProviders(newOnlineProviders);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onlineProviders]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      
      const { data: profiles, error } = await (supabase as any)
        .from('profiles')
        .select(`
          user_id,
          full_name,
          email,
          phone,
          avatar_url,
          skills,
          bio,
          services:services(
            id,
            title,
            description,
            category,
            rate,
            rate_type,
            duration_minutes,
            is_active
          )
        `)
        .eq('user_type', 'provider');

      if (error) {
        console.error('Error fetching providers:', error);
        setProviders([]);
        return;
      }

      if (!profiles || profiles.length === 0) {
        setProviders([]);
        return;
      }

      const transformedProviders: Provider[] = profiles.map((profile: any, index: number) => {
        const activeServices = profile.services?.filter((s: any) => s.is_active) || [];
        const lowestRate = activeServices.length > 0 
          ? Math.min(...activeServices.map((s: any) => s.rate))
          : 25;
        
        const primaryCategory = activeServices.length > 0 
          ? activeServices[0].category 
          : (profile.skills?.[0] || 'General');
        
        return {
          id: profile.user_id,
          name: profile.full_name || `Provider ${index + 1}`,
          profession: activeServices.length > 0 ? activeServices[0].title : (profile.skills?.[0] || 'Service Provider'),
          category: primaryCategory,
          rating: 0, // Remove mock rating
          reviews: 0, // Remove mock review count
          distance: "", // Remove mock distance
          image: profile.avatar_url && profile.avatar_url.trim() !== '' ? profile.avatar_url : null,
          hourlyRate: lowestRate,
          bio: profile.bio || `Professional service provider${activeServices.length > 0 ? ` offering ${activeServices.map((s: any) => s.title).join(', ')}` : ''}`
        };
      });

      setProviders(transformedProviders);
      setProvidersWithServices(profiles);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load providers');
      setProviders([]);
      setProvidersWithServices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.profession.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || (() => {
      const providerData = providersWithServices.find(p => p.user_id === provider.id);
      if (!providerData || !providerData.services) return false;
      
      const activeServices = providerData.services.filter((s: any) => s.is_active);
      return activeServices.some((service: any) => service.category === selectedCategory);
    })();
    
    return matchesSearch && matchesCategory;
  });

  const jobsFilteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(jobsSearchQuery.toLowerCase()) ||
                         provider.profession.toLowerCase().includes(jobsSearchQuery.toLowerCase()) ||
                         provider.bio.toLowerCase().includes(jobsSearchQuery.toLowerCase());
    
    const matchesCategory = !jobsSelectedCategory || jobsSelectedCategory === "all" || (() => {
      const providerData = providersWithServices.find(p => p.user_id === provider.id);
      if (!providerData || !providerData.services) return false;
      
      const activeServices = providerData.services.filter((s: any) => s.is_active);
      return activeServices.some((service: any) => {
        if (service.category.toLowerCase() === jobsSelectedCategory.toLowerCase()) {
          return true;
        }
        
        for (const category of CATEGORIES) {
          if (category.subcategories) {
            const subcategory = category.subcategories.find(sub => sub.key === jobsSelectedCategory);
            if (subcategory && service.category.toLowerCase() === category.key.toLowerCase()) {
              return true;
            }
          }
        }
        return false;
      });
    })();
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        // Sort by hourly rate if ratings are not available
        return a.hourlyRate - b.hourlyRate;
      case "price":
        return a.hourlyRate - b.hourlyRate;
      case "distance":
        // Sort by name if distance is not available
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen subtle-gradient">
      {/* Language Switcher */}
      <div className="fixed top-4 right-16 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 sm:p-12 text-white shadow-[var(--shadow-hero)] animate-fade-in-up">
          <div className="absolute inset-0 glow-effect opacity-30"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {t('clientHome.welcomeBack')}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('clientHome.findPerfect')}
            </p>
            
            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/client-map')}
                className="group px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-glow)] animate-scale-in"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  {t('clientHome.browseMap')}
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/new-job')}
                className="group px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-[var(--shadow-button)] animate-scale-in"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  {t('clientHome.postJob')}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
          <Card className="group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02] overflow-hidden border-0 bg-gradient-to-br from-white to-muted/30">
            <div 
              className="h-full p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
              onClick={() => navigate('/client-map')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                  {t('clientHome.browseMap')}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('clientHome.browseMapDesc')}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02] overflow-hidden border-0 bg-gradient-to-br from-white to-muted/30">
            <div 
              className="h-full p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
              onClick={() => navigate('/new-job')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4 p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <Calendar className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-accent transition-colors duration-300">
                  {t('clientHome.postJob')}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('clientHome.postJobDesc')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Providers Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-white via-white to-muted/20 shadow-[var(--shadow-card)]">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t('clientHome.providersNearYou')}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"} transition-all duration-200`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"} transition-all duration-200`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Enhanced Filter Section */}
              <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between mb-6 h-12 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 border-muted/60 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-primary" />
                      <span className="font-medium">Advanced Filters</span>
                    </div>
                    {isFiltersOpen ? 
                      <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    }
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border border-muted/30">
                    {/* Search Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Search providers</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name, skills..."
                          className="pl-10 border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm"
                          value={jobsSearchQuery}
                          onChange={(e) => setJobsSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <Select value={jobsSelectedCategory} onValueChange={setJobsSelectedCategory}>
                        <SelectTrigger className="border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm">
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border-muted/40">
                           <SelectItem value="all" className="hover:bg-primary/10">All categories</SelectItem>
                           {CATEGORIES.map((category) => (
                             <div key={`cat-${category.key}`}>
                               <SelectItem value={category.key} className="font-medium hover:bg-primary/10">
                                 {t(category.translationKey)}
                               </SelectItem>
                               {(category.subcategories || []).map((subcategory) => (
                                 <SelectItem key={`sub-${subcategory.key}`} value={subcategory.key} className="pl-6 hover:bg-accent/10">
                                   • {t(subcategory.translationKey)}
                                 </SelectItem>
                               ))}
                             </div>
                           ))}
                         </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Sort by</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border-muted/40">
                          <SelectItem value="rating" className="hover:bg-primary/10">Highest Rating</SelectItem>
                          <SelectItem value="price" className="hover:bg-primary/10">Lowest Price</SelectItem>
                          <SelectItem value="distance" className="hover:bg-primary/10">Nearest Distance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex justify-end pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setJobsSearchQuery("");
                        setJobsSelectedCategory("");
                        setSortBy("rating");
                      }}
                      className="bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 border-muted/60 transition-all duration-300"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Active filters display */}
              {(jobsSearchQuery || jobsSelectedCategory) && (
                <div className="flex flex-wrap gap-2 mb-6 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
                  <span className="text-sm font-medium text-foreground">Active filters:</span>
                  {jobsSearchQuery && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                      Search: {jobsSearchQuery}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-primary hover:text-primary/70"
                        onClick={() => setJobsSearchQuery("")}
                      >
                        ×
                      </Button>
                    </Badge>
                  )}
                  {jobsSelectedCategory && jobsSelectedCategory !== "all" && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/30">
                      Category: {jobsSelectedCategory}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-accent hover:text-accent/70"
                        onClick={() => setJobsSelectedCategory("")}
                      >
                        ×
                      </Button>
                    </Badge>
                  )}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Loading amazing providers...</p>
                  </div>
                </div>
              ) : jobsFilteredProviders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-4 p-4 rounded-full bg-muted/50 w-20 h-20 flex items-center justify-center mx-auto">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">No providers found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria to find more providers.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setJobsSearchQuery("");
                      setJobsSelectedCategory("");
                    }}
                    className="bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/30 text-primary hover:text-primary"
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {jobsFilteredProviders.map((provider, index) => (
                    <Card 
                      key={provider.id} 
                      className="group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02] border-0 bg-gradient-to-br from-white via-white to-muted/30 overflow-hidden animate-fade-in-up"
                      style={{ animationDelay: `${0.1 * index}s` }}
                      onClick={() => navigate(`/provider-profile/${provider.id}`)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          {/* Provider Image */}
                          <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {provider.image ? (
                              <img 
                                src={provider.image} 
                                alt={provider.name}
                                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  console.log('Image failed to load:', provider.image);
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 ${provider.image ? 'hidden' : ''}`}>
                              <User className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          
                          {/* Provider Info */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                                {provider.name}
                              </h3>
                              {/* Only show rating if it exists and is greater than 0 */}
                              {provider.rating > 0 && (
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium text-yellow-700">{provider.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {provider.profession}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                              {/* Only show distance if it exists */}
                              {provider.distance && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {provider.distance}
                                </span>
                              )}
                              <span className="font-semibold text-primary">
                                ₾{provider.hourlyRate}/hr
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {/* Only show reviews if count is greater than 0 */}
                              {provider.reviews > 0 ? (
                                <span className="text-xs text-muted-foreground">
                                  {provider.reviews} reviews
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  New provider
                                </span>
                              )}
                              <div className="flex gap-1">
                                <div className={`w-2 h-2 rounded-full ${onlineProviders.has(provider.id) ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                <span className={`text-xs font-medium ${onlineProviders.has(provider.id) ? 'text-green-600' : 'text-gray-500'}`}>
                                  {onlineProviders.has(provider.id) ? 'Online' : 'Offline'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;