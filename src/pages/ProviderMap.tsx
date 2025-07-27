import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, ArrowLeft, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProviderMap = () => {
  const navigate = useNavigate();

  const jobPins = [
    { id: 1, title: "House Cleaning", client: "Jennifer S.", price: 75, lat: 40.7128, lng: -74.0060, urgent: false },
    { id: 2, title: "Furniture Assembly", client: "Robert D.", price: 60, lat: 40.7589, lng: -73.9851, urgent: true },
    { id: 3, title: "Garden Work", client: "Maria G.", price: 80, lat: 40.7614, lng: -73.9776, urgent: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/provider-home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Jobs Near You</h1>
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
            <h3 className="text-xl font-semibold mb-2">Job Map</h3>
            <p className="text-muted-foreground">Available jobs shown as pins</p>
          </div>
        </div>

        {/* Job Pins */}
        {jobPins.map((job, index) => (
          <div 
            key={job.id}
            className={`absolute rounded-full w-12 h-12 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform ${
              job.urgent ? 'bg-destructive text-destructive-foreground' : 'bg-success text-success-foreground'
            }`}
            style={{
              top: `${25 + index * 20}%`,
              left: `${20 + index * 25}%`
            }}
          >
            <DollarSign className="w-5 h-5" />
          </div>
        ))}

        {/* Selected Job Card */}
        <Card className="absolute bottom-6 left-6 w-80 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Furniture Assembly</CardTitle>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            <p className="text-muted-foreground">Client: Robert Davis</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">IKEA wardrobe assembly required</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                Today, 6:00 PM
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                0.8 miles away
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-xl text-success">$60</span>
                <Button size="sm">Apply Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderMap;