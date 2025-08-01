import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Calendar, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CategorySelector from "@/components/CategorySelector";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      console.log('🏠 ClientHome: Starting to fetch providers from profiles table...');
      
      // Fetch all provider profiles
      const { data: profiles, error } = await (supabase as any)
        .from('profiles')
        .select(`
          user_id,
          full_name,
          email,
          phone,
          avatar_url,
          skills
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
        return {
          id: profile.user_id,
          name: profile.full_name || `Provider ${index + 1}`,
          profession: profile.skills?.[0] || 'Service Provider',
          category: 'General',
          rating: 4.5 + Math.random() * 0.5, // Mock rating for now
          reviews: Math.floor(Math.random() * 50) + 10, // Mock reviews for now
          distance: `${(Math.random() * 2 + 0.1).toFixed(1)} miles`, // Mock distance
          image: profile.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'PR',
          hourlyRate: 50 + Math.floor(Math.random() * 100), // Mock hourly rate
          bio: `Professional service provider${profile.skills ? ` specializing in ${profile.skills.join(', ')}` : ''}`
        };
      });

      console.log('🏠 ClientHome: Transformed providers:', transformedProviders);
      setProviders(transformedProviders);
    } catch (error) {
      console.error('🏠 ClientHome: Error fetching providers:', error);
      toast.error('Failed to load providers');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter providers based on search and category
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.profession.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

        {/* Search Bar */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t('clientHome.searchPlaceholder')}
                className="pl-10 text-lg py-6"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {searchQuery && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {filteredProviders.length} providers for "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Filters */}
        <CategorySelector 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryClick}
          onClearFilter={() => setSelectedCategory("")}
        />

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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('clientHome.providersNearYou')}</h2>
            <span className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filteredProviders.length} providers found`}
            </span>
          </div>

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
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No providers found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory 
                  ? "Try adjusting your search or filters" 
                  : "No service providers are currently available in your area"}
              </p>
              {(searchQuery || selectedCategory) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Provider Avatar */}
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                        {provider.image}
                      </div>
                      
                      {/* Provider Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{provider.name}</h3>
                        <p className="text-muted-foreground">{provider.profession}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{provider.rating.toFixed(1)} ({provider.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{provider.distance}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{provider.bio}</p>
                      </div>
                      
                      {/* Action Buttons and Price */}
                      <div className="flex flex-col sm:items-end gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold">₾{provider.hourlyRate}/hr</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => navigate(`/provider-profile/${provider.id}`)}
                          >
                            {t('clientHome.viewProfile')}
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => {
                              // For demo purposes, using mock service and provider IDs
                              const providerId = provider.id || "550e8400-e29b-41d4-a716-446655440001";
                              const serviceId = "660e8400-e29b-41d4-a716-446655440001"; // Mock service ID
                              navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                            }}
                          >
                            {t('clientHome.hireNow')}
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