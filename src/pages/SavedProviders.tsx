import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Heart, X, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface SavedProvider {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  hourlyRate: number;
  category: string;
}

const SavedProviders = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProviders, setSavedProviders] = useState<SavedProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedProviders();
  }, []);

  const fetchSavedProviders = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch saved providers from the database
      // For now, we'll show empty state since there are no saved providers yet
      setSavedProviders([]);
    } catch (error) {
      console.error('Error fetching saved providers:', error);
      toast.error('Failed to load saved providers');
      setSavedProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = savedProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFromSaved = (providerId: string) => {
    setSavedProviders(prev => prev.filter(provider => provider.id !== providerId));
    toast.success("Provider removed from saved list");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('savedProviders.title')}</h1>
            <p className="text-muted-foreground">Your favorite service providers</p>
          </div>
          
          <Button onClick={() => navigate('/client-map')}>
            <Search className="w-4 h-4 mr-2" />
            Find More Providers
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved providers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${filteredProviders.length} saved providers`}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          )}
        </div>

        {/* Saved Providers List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
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
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No saved providers found" : t('savedProviders.noSavedProviders')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No saved providers match your search for "${searchQuery}"` 
                  : t('savedProviders.saveProvidersDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/client-map')}>
                  <Search className="w-4 h-4 mr-2" />
                  {t('savedProviders.browseProviders')}
                </Button>
                <Button variant="outline" onClick={() => navigate('/new-job')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Post a Job
                </Button>
              </div>
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Provider Avatar */}
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg flex-shrink-0">
                      {provider.image}
                    </div>
                    
                    {/* Provider Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{provider.name}</h3>
                          <p className="text-muted-foreground">{provider.profession}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeFromSaved(provider.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{provider.rating.toFixed(1)} ({provider.reviews} {t('savedProviders.reviews')})</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{provider.distance}</span>
                        </div>
                        <Badge variant="secondary">{provider.category}</Badge>
                      </div>
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
                          onClick={() => navigate(`/provider-profile/${provider.id}`)}
                        >
                          View Profile
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            const providerId = provider.id || "550e8400-e29b-41d4-a716-446655440001";
                            const serviceId = "660e8400-e29b-41d4-a716-446655440001";
                            navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                          }}
                        >
                          {t('savedProviders.hireAgain')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedProviders;