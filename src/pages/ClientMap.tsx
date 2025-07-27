import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientMap = () => {
  const navigate = useNavigate();

  const providers = [
    { id: 1, name: "Sarah J.", lat: 40.7128, lng: -74.0060, rating: 4.8, service: "Cleaning" },
    { id: 2, name: "Mike C.", lat: 40.7589, lng: -73.9851, rating: 4.9, service: "Handyman" },
    { id: 3, name: "Emma R.", lat: 40.7614, lng: -73.9776, rating: 5.0, service: "Tutoring" }
  ];

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
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-80px)]">
        {/* Mock Map Background */}
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
            <p className="text-muted-foreground">Providers shown as pins on map</p>
          </div>
        </div>

        {/* Provider Pins (Mock positions) */}
        {providers.map((provider, index) => (
          <div 
            key={provider.id}
            className="absolute bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
            style={{
              top: `${20 + index * 15}%`,
              left: `${30 + index * 20}%`
            }}
          >
            <Star className="w-4 h-4" />
          </div>
        ))}

        {/* Floating Post Job Button */}
        <Button 
          className="absolute bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
          onClick={() => navigate("/new-job")}
        >
          <Plus className="w-6 h-6" />
        </Button>

        {/* Selected Provider Card */}
        <Card className="absolute bottom-6 left-6 w-72 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sarah Johnson</CardTitle>
              <Badge variant="secondary">Cleaning</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">4.8</span>
                <span className="text-muted-foreground text-sm">(47 reviews)</span>
              </div>
              <Button size="sm">Hire Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientMap;