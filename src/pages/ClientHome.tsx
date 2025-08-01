import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Calendar, User, Menu, Grid3X3, List, Filter, SlidersHorizontal } from "lucide-react";
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
  
  // New state for Jobs Near You section
  const [jobsSearchQuery, setJobsSearchQuery] = useState("");
  const [jobsSelectedCategory, setJobsSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // rating, price, distance
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      console.log('🏠 ClientHome: Starting to fetch providers from profiles table...');
      
      // Fetch all provider profiles with their services
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

      console.log('🏠 ClientHome: Fetched profiles:', profiles);
      console.log('🏠 ClientHome: Fetch error:', error);

      if (error) {
        console.error('Error fetching providers:', error);
        setProviders([]);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('🏠 ClientHome: No providers found in database');
        setProviders([]);
        return;
      }

      // Transform the data to match the expected format
      const transformedProviders: Provider[] = profiles.map((profile: any, index: number) => {
        console.log(`🏠 ClientHome: Transforming profile ${index + 1}:`, profile);
        
        // Get the lowest rate from their services
        const activeServices = profile.services?.filter((s: any) => s.is_active) || [];
        const lowestRate = activeServices.length > 0 
          ? Math.min(...activeServices.map((s: any) => s.rate))
          : 0;
        
        // Get primary category from services or skills
        const primaryCategory = activeServices.length > 0 
          ? activeServices[0].category 
          : (profile.skills?.[0] || 'General');
        
        return {
          id: profile.user_id,
          name: profile.full_name || `Provider ${index + 1}`,
          profession: activeServices.length > 0 ? activeServices[0].title : (profile.skills?.[0] || 'Service Provider'),
          category: primaryCategory,
          rating: 0, // Will be calculated from actual reviews later
          reviews: 0, // Will be fetched from actual bookings later  
          distance: '0.0 miles', // Will be calculated based on location later
          image: profile.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'PR',
          hourlyRate: lowestRate,
          bio: profile.bio || `Professional service provider${activeServices.length > 0 ? ` offering ${activeServices.map((s: any) => s.title).join(', ')}` : ''}`
        };
      });

      console.log('🏠 ClientHome: Transformed providers:', transformedProviders);
      setProviders(transformedProviders);
      setProvidersWithServices(profiles); // Store the original data with services
    } catch (error) {
      console.error('🏠 ClientHome: Error fetching providers:', error);
      toast.error('Failed to load providers');
      setProviders([]);
      setProvidersWithServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter providers based on search and category
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.profession.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if provider has services matching the selected category using the stored services data
    const matchesCategory = !selectedCategory || (() => {
      const providerData = providersWithServices.find(p => p.user_id === provider.id);
      if (!providerData || !providerData.services) return false;
      
      const activeServices = providerData.services.filter((s: any) => s.is_active);
      return activeServices.some((service: any) => service.category === selectedCategory);
    })();
    
    return matchesSearch && matchesCategory;
  });

  // Filter providers for Jobs Near You section with enhanced filtering  
  const jobsFilteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(jobsSearchQuery.toLowerCase()) ||
                         provider.profession.toLowerCase().includes(jobsSearchQuery.toLowerCase()) ||
                         provider.bio.toLowerCase().includes(jobsSearchQuery.toLowerCase());
    
    // Check if provider has services matching the selected category using the stored services data
    const matchesCategory = !jobsSelectedCategory || jobsSelectedCategory === "all" || (() => {
      console.log('🔍 Checking category match for provider:', provider.id, 'Category:', jobsSelectedCategory);
      const providerData = providersWithServices.find(p => p.user_id === provider.id);
      console.log('🔍 Found provider data:', providerData);
      
      if (!providerData || !providerData.services) {
        console.log('🔍 No provider data or services found');
        return false;
      }
      
      const activeServices = providerData.services.filter((s: any) => s.is_active);
      console.log('🔍 Active services:', activeServices);
      
      // Check both category and subcategory matches
      const hasMatch = activeServices.some((service: any) => {
        console.log('🔍 Checking service category:', service.category, 'against:', jobsSelectedCategory);
        // Direct category match
        if (service.category === jobsSelectedCategory) {
          console.log('🔍 Direct match found!');
          return true;
        }
        
        // Check if the selected category is a subcategory and matches
        for (const category of CATEGORIES) {
          if (category.subcategories) {
            const subcategory = category.subcategories.find(sub => sub.key === jobsSelectedCategory);
            if (subcategory && service.category === category.key) {
              console.log('🔍 Subcategory match found!');
              return true;
            }
          }
        }
        return false;
      });
      
      console.log('🔍 Final match result:', hasMatch);
      return hasMatch;
    })();
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price":
        return a.hourlyRate - b.hourlyRate;
      case "distance":
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return 0;
    }
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Language Switcher */}
      <div className="fixed top-4 right-16 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t('clientHome.welcomeBack')}</h2>
          <p className="text-muted-foreground text-base sm:text-lg">{t('clientHome.findPerfect')}</p>
        </div>



        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
            onClick={() => navigate('/client-map')}
          >
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t('clientHome.browseMap')}</h3>
              <p className="text-muted-foreground text-sm">{t('clientHome.browseMapDesc')}</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
            onClick={() => navigate('/new-job')}
          >
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t('clientHome.postJob')}</h3>
              <p className="text-muted-foreground text-sm">{t('clientHome.postJobDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Providers Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t('clientHome.providersNearYou')}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {loading ? "Loading..." : `${jobsFilteredProviders.length} providers found`}
              </span>
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-7 w-7 p-0"
                >
                  <Grid3X3 className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-7 w-7 p-0"
                >
                  <List className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section for Jobs */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search providers, services, skills..."
                    className="pl-9"
                    value={jobsSearchQuery}
                    onChange={(e) => setJobsSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Filters Toggle */}
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Expanded Filters */}
              <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                <CollapsibleContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={jobsSelectedCategory} onValueChange={setJobsSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                          <SelectContent>
                           <SelectItem value="all">All categories</SelectItem>
                           {CATEGORIES.map((category) => (
                             <React.Fragment key={`cat-${category.key}`}>
                               <SelectItem value={category.key}>
                                 {t(category.translationKey)}
                               </SelectItem>
                               {(category.subcategories || []).map((subcategory) => (
                                 <SelectItem key={`sub-${subcategory.key}`} value={subcategory.key} className="pl-6">
                                   • {t(subcategory.translationKey)}
                                 </SelectItem>
                               ))}
                             </React.Fragment>
                           ))}
                         </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort by</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Highest Rating</SelectItem>
                          <SelectItem value="price">Lowest Price</SelectItem>
                          <SelectItem value="distance">Nearest Distance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium invisible">Clear</label>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setJobsSearchQuery("");
                          setJobsSelectedCategory("");
                          setSortBy("rating");
                        }}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Active filters display */}
              {(jobsSearchQuery || jobsSelectedCategory) && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {jobsSearchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {jobsSearchQuery}
                      <button onClick={() => setJobsSearchQuery("")} className="ml-1 hover:text-destructive">×</button>
                    </Badge>
                  )}
                  {jobsSelectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {jobsSelectedCategory}
                      <button onClick={() => setJobsSelectedCategory("")} className="ml-1 hover:text-destructive">×</button>
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {loading ? (
            <div className="grid gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobsFilteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No providers found</h3>
              <p className="text-muted-foreground mb-4">
                {jobsSearchQuery || jobsSelectedCategory 
                  ? "Try adjusting your search or filters" 
                  : "No service providers are currently available in your area"}
              </p>
              {(jobsSearchQuery || jobsSelectedCategory) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setJobsSearchQuery("");
                    setJobsSelectedCategory("");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-4 sm:gap-6" : "space-y-4"}>
              {jobsFilteredProviders.map((provider) => (
                <Card key={provider.id} className={`hover:shadow-lg transition-shadow ${viewMode === "list" ? "p-0" : ""}`}>
                  <CardContent className={viewMode === "grid" ? "p-4 sm:p-6" : "p-4"}>
                    <div className={`flex ${viewMode === "grid" ? "flex-col sm:flex-row sm:items-center" : "items-center"} gap-4`}>
                      {/* Provider Avatar */}
                      <div className={`${viewMode === "grid" ? "w-12 h-12" : "w-10 h-10"} bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold ${viewMode === "grid" ? "text-lg" : "text-sm"}`}>
                        {provider.image}
                      </div>
                      
                      {/* Provider Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold ${viewMode === "grid" ? "text-lg" : "text-base"} truncate`}>{provider.name}</h3>
                        <p className="text-muted-foreground text-sm">{provider.profession}</p>
                        <div className={`flex items-center gap-4 mt-2 text-sm ${viewMode === "list" ? "flex-wrap" : ""}`}>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{provider.rating.toFixed(1)} ({provider.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{provider.distance}</span>
                          </div>
                          {viewMode === "list" && (
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">₾{provider.hourlyRate}/hr</p>
                            </div>
                          )}
                        </div>
                        {viewMode === "grid" && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{provider.bio}</p>
                        )}
                      </div>
                      
                      {/* Action Buttons and Price */}
                      <div className={`flex ${viewMode === "grid" ? "flex-col sm:items-end" : "items-center"} gap-3`}>
                        {viewMode === "grid" && (
                          <div className="text-right">
                            <p className="text-lg font-bold">₾{provider.hourlyRate}/hr</p>
                          </div>
                        )}
                        <div className={`flex gap-2 ${viewMode === "list" ? "flex-col" : ""}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`${viewMode === "grid" ? "flex-1 sm:flex-none" : "px-3"}`}
                            onClick={() => navigate(`/provider-profile/${provider.id}`)}
                          >
                            {viewMode === "list" ? "View" : t('clientHome.viewProfile')}
                          </Button>
                          <Button 
                            size="sm"
                            className={`${viewMode === "grid" ? "flex-1 sm:flex-none" : "px-3"}`}
                            onClick={() => navigate(`/provider-profile/${provider.id}`)}
                          >
                            {viewMode === "list" ? "Hire" : t('clientHome.hireNow')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientHome;