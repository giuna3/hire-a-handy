import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleMap from "@/components/GoogleMap";

const ClientMap = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

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
            <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for providers..."
                    className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
            <div className="relative h-[calc(100vh-200px)] rounded-lg overflow-hidden">
              <GoogleMap
                center={{ lat: 40.7128, lng: -74.0060 }}
                zoom={13}
                markers={mapMarkers}
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