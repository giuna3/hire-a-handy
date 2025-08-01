import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Plus, MapPin, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleMap from "@/components/GoogleMap";
import { toast } from "sonner";

const ClientMap = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

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

  const mapMarkers = providers.map(provider => ({
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
        {/* Search Bar with Location Status */}
        <Card className="shadow-[var(--shadow-card)] mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for providers..."
                  className="pl-10"
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

        {/* Map Container */}
        <div className="relative h-[calc(100vh-200px)] rounded-lg overflow-hidden">
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
                      onClick={() => navigate('/new-job')}
                    >
                      Hire Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientMap;