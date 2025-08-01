import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, Plus, MapPin, Navigation, List, Map, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleMap from "@/components/GoogleMap";
import { toast } from "sonner";

const ClientMap = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const providers = [
    {
      id: 1,
      name: "Sarah Johnson",
      profession: "House Cleaner",
      position: { lat: 40.7128, lng: -74.0060 },
      rating: 4.8,
      reviews: 47,
      hourlyRate: 25,
      bio: "Professional cleaning with 5+ years experience"
    },
    {
      id: 2,
      name: "Mike Chen",
      profession: "Handyman",
      position: { lat: 40.7589, lng: -73.9851 },
      rating: 4.9,
      reviews: 63,
      hourlyRate: 45,
      bio: "Home repairs and maintenance specialist"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      profession: "Tutor",
      position: { lat: 40.7614, lng: -73.9776 },
      rating: 5.0,
      reviews: 28,
      hourlyRate: 35,
      bio: "Math and science tutoring for all ages"
    }
  ];

  // Filter providers based on search query
  const filteredProviders = providers.filter(provider => 
    searchQuery === "" || 
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mapMarkers = filteredProviders.map(provider => ({
    id: provider.id,
    position: provider.position,
    title: provider.name,
    info: `${provider.profession} - $${provider.hourlyRate}/hr - ${provider.rating}★`,
    type: 'provider' as const,
    onClick: () => setSelectedProvider(provider)
  }));

  // Auto-request location on component mount
  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        toast.info("Getting your precise location...", { duration: 2000 });
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            const accuracy = position.coords.accuracy;
            setUserLocation(location);
            setMapCenter(location);
            
            if (accuracy > 1000) {
              toast.warning(`Location found but accuracy is low (±${Math.round(accuracy)}m). Try enabling GPS for better accuracy.`);
            } else if (accuracy > 100) {
              toast.success(`Location found with ±${Math.round(accuracy)}m accuracy.`);
            } else {
              toast.success("Precise location found! Showing providers near you.");
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            let errorMessage = "Unable to get your precise location. ";
            
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += "Please allow location access and ensure GPS is enabled.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += "GPS signal unavailable. Try moving to an open area.";
                break;
              case error.TIMEOUT:
                errorMessage += "Location request timed out. Please try again.";
                break;
              default:
                errorMessage += "An unknown error occurred.";
                break;
            }
            
            toast.error(errorMessage);
          },
          {
            enableHighAccuracy: true,  // Force GPS usage
            timeout: 30000,           // Longer timeout for GPS
            maximumAge: 0             // Don't use cached location
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    };

    requestLocation();
  }, []);

  const handleLocationFound = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
    setMapCenter(location);
    toast.success("Location updated!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/client-home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Map View</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              // Search functionality could be added here
              console.log('Search clicked');
            }}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">        
        {/* Search Bar */}
        <Card className="shadow-[var(--shadow-card)] mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for providers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {userLocation && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1 text-green-500" />
                  Location enabled
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Toggle Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list")} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              List View
            </TabsTrigger>
          </TabsList>

          {/* Map View */}
          <TabsContent value="map" className="mt-4">
            <div className="relative h-[calc(100vh-280px)] rounded-lg overflow-hidden">
              <GoogleMap
                center={mapCenter}
                zoom={userLocation ? 15 : 13}
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
                      <CardTitle className="text-lg">{selectedProvider.name}</CardTitle>
                      <Badge variant="secondary">{selectedProvider.profession}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{selectedProvider.bio}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="font-medium">{selectedProvider.rating}★</span>
                          <span className="text-muted-foreground">({selectedProvider.reviews} reviews)</span>
                        </div>
                        <p className="font-semibold">${selectedProvider.hourlyRate}/hr</p>
                      </div>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/provider-profile/${selectedProvider.id}`)}
                        >
                          View Profile
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            // For demo purposes, using mock service and provider IDs based on provider data
                            const providerId = selectedProvider.id || "550e8400-e29b-41d4-a716-446655440001";
                            const serviceId = "660e8400-e29b-41d4-a716-446655440001"; // Mock service ID
                            navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                          }}
                        >
                          Hire Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="mt-4">
            <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredProviders.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Found {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                  </div>
                  
                  {filteredProviders.map((provider) => (
                    <Card key={provider.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                            {provider.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-lg">{provider.name}</h4>
                                <Badge variant="secondary" className="mb-2">{provider.profession}</Badge>
                                <p className="text-sm text-muted-foreground mb-3">{provider.bio}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-lg">${provider.hourlyRate}/hr</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="font-medium">{provider.rating}</span>
                                  <span className="text-muted-foreground text-sm">({provider.reviews})</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-4">
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
                                  // For demo purposes, using mock service and provider IDs based on provider data
                                  const providerId = provider.id || "550e8400-e29b-41d4-a716-446655440001";
                                  const serviceId = "660e8400-e29b-41d4-a716-446655440001"; // Mock service ID
                                  navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                                }}
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
                                <MapPin className="w-4 h-4 mr-1" />
                                Show on Map
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <Card className="shadow-[var(--shadow-card)]">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      {searchQuery 
                        ? `No providers found for "${searchQuery}"`
                        : "No providers found in your area"
                      }
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="outline"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
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