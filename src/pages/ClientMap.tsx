import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, MapPin, Star, Calendar, User, Plus, Filter, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleMap from "@/components/GoogleMap";
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
  position: { lat: number; lng: number };
}

const ClientMap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      console.log('🔍 Starting to fetch providers from profiles table...');
      
      // Fetch all provider profiles with their services
      const { data: profiles, error } = await (supabase as any)
        .from('profiles')
        .select(`
          user_id,
          full_name,
          user_type,
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

      console.log('✅ Fetched profiles:', profiles); // Debug log
      console.log('❌ Fetch error:', error); // Debug log

      if (error) {
        console.error('Error fetching providers:', error);
        toast.error('Failed to load providers');
        setProviders([]);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('⚠️ No providers found in database');
        setProviders([]);
        return;
      }

      // Transform the data to match the expected format
      const transformedProviders: Provider[] = profiles.map((profile: any, index: number) => {
        console.log(`🔄 Transforming profile ${index + 1}:`, profile);
        
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
          position: {
            lat: 41.7151, // Default position, will be updated with real coordinates later
            lng: 44.8271
          }
        };
      });

      console.log('🎯 Transformed providers:', transformedProviders); // Debug log
      setProviders(transformedProviders);
    } catch (error) {
      console.error('💥 Error fetching providers:', error);
      toast.error('Failed to load providers');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // Category hierarchy mapping
  const categoryHierarchy: { [key: string]: string[] } = {
    "Cleaning": ["Cleaning", "Deep Cleaning", "House Cleaning", "Office Cleaning"],
    "Home Repair": ["Home Repair", "Handyman", "Maintenance"],
    "Gardening": ["Gardening", "Landscaping", "Garden Maintenance"],
    "Plumbing": ["Plumbing", "Pipe Repair", "Bathroom Repair"],
    "Electrical": ["Electrical", "Wiring", "Electrical Repair"],
    "Painting": ["Painting", "Interior Painting", "Exterior Painting"],
    "Moving": ["Moving", "Packing", "Furniture Moving"],
    "Tutoring": ["Tutoring", "Math Tutoring", "Language Tutoring"],
    "Pet Care": ["Pet Care", "Dog Walking", "Pet Sitting"],
    "Personal Training": ["Personal Training", "Fitness", "Yoga"],
    "Photography": ["Photography", "Wedding Photography", "Portrait Photography"],
    "Beauty & Wellness": ["Beauty & Wellness", "Massage", "Skincare"],
    "IT Support": ["IT Support", "Computer Repair", "Tech Support"],
    "Event Planning": ["Event Planning", "Wedding Planning", "Party Planning"]
  };

  const filteredProviders = providers.filter(provider => {
    // Text search filter
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter with subcategory support
    const matchesCategory = selectedCategory === "all" || 
      provider.category === selectedCategory ||
      (categoryHierarchy[selectedCategory] && categoryHierarchy[selectedCategory].includes(provider.category));
    
    // Price range filter
    const matchesPrice = provider.hourlyRate >= priceRange[0] && provider.hourlyRate <= priceRange[1];
    
    // Rating filter
    const matchesRating = provider.rating >= minRating;
    
    // Distance filter (parse distance string to number)
    const distanceValue = parseFloat(provider.distance.replace(/[^\d.]/g, ''));
    const matchesDistance = distanceValue <= maxDistance;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesDistance;
  });

  // Get unique categories for filter dropdown
  const availableCategories = Array.from(new Set(providers.map(p => p.category)));
  
  // Predefined categories to ensure filter is always populated
  const predefinedCategories = [
    "Cleaning",
    "Home Repair", 
    "Gardening",
    "Handyman",
    "Plumbing",
    "Electrical",
    "Painting",
    "Moving",
    "Tutoring",
    "Pet Care",
    "Personal Training",
    "Photography",
    "Beauty & Wellness",
    "IT Support",
    "Event Planning"
  ];
  
  // Combine available and predefined categories, remove duplicates
  const categories = Array.from(new Set([...availableCategories, ...predefinedCategories])).sort();

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 200]);
    setMinRating(0);
    setMaxDistance(10);
    setSearchQuery("");
  };

  const mapMarkers = filteredProviders.map(provider => ({
    id: provider.id,
    position: provider.position,
    title: provider.name,
    info: `${provider.profession} - ₾${provider.hourlyRate}/hr`
  }));

  const handleLocationFound = (location: { lat: number; lng: number }) => {
    console.log("User location found:", location);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Find Providers</h1>
            <p className="text-muted-foreground">Discover service providers near you</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Section */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            {(selectedCategory !== "all" || priceRange[0] !== 0 || priceRange[1] !== 200 || minRating !== 0 || maxDistance !== 10 || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
          
          <CollapsibleContent className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Price Range: ₾{priceRange[0]} - ₾{priceRange[1]}/hr
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Minimum Rating: {minRating === 0 ? 'Any' : `${minRating}+ stars`}
                    </label>
                    <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any rating</SelectItem>
                        <SelectItem value="3">3+ stars</SelectItem>
                        <SelectItem value="4">4+ stars</SelectItem>
                        <SelectItem value="4.5">4.5+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Distance Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Max Distance: {maxDistance} miles
                    </label>
                    <Slider
                      value={[maxDistance]}
                      onValueChange={(value) => setMaxDistance(value[0])}
                      max={20}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${filteredProviders.length} providers found`}
          </p>
          
          {/* Quick filter badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ₾{priceRange[0]}-₾{priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, 200])}
                  className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {minRating > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {minRating}+ ⭐
                <button
                  onClick={() => setMinRating(0)}
                  className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {maxDistance !== 10 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {maxDistance} miles
                <button
                  onClick={() => setMaxDistance(10)}
                  className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Map and List View Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="space-y-6">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
              <GoogleMap
                center={{ lat: 41.7151, lng: 44.8271 }}
                zoom={12}
                markers={mapMarkers}
                onLocationFound={handleLocationFound}
                className="w-full h-full"
              />

              {/* Floating Post Job Button */}
              <Button 
                className="absolute bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-10"
                onClick={() => navigate("/new-job")}
              >
                <Plus className="w-6 h-6" />
              </Button>

              {/* Selected Provider Card */}
              {selectedProvider && (
                <Card className="absolute bottom-6 left-6 w-80 shadow-xl z-10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                          {selectedProvider.image}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{selectedProvider.name}</CardTitle>
                          <CardDescription>{selectedProvider.profession}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{selectedProvider.rating.toFixed(1)} ({selectedProvider.reviews})</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{selectedProvider.distance}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">₾{selectedProvider.hourlyRate}/hr</Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/provider-profile/${selectedProvider.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/provider-profile/${selectedProvider.id}`)}
                      >
                        Hire Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-6">
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
                    {searchQuery 
                      ? `No providers match your search for "${searchQuery}"` 
                      : "No service providers are currently available in your area"}
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                filteredProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                          {provider.image}
                        </div>
                        
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
                        </div>
                        
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
                              onClick={() => navigate(`/provider-profile/${provider.id}`)}
                            >
                              Hire Now
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setViewMode("map");
                              }}
                            >
                              <MapPin className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              
              {/* Fixed Post Job Button for List View */}
              <div className="sticky bottom-6 flex justify-end">
                <Button 
                  className="rounded-full w-14 h-14 shadow-lg"
                  onClick={() => navigate("/new-job")}
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientMap;