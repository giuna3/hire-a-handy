import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Clock, MapPin, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleMap from "@/components/GoogleMap";

const ProviderMap = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const jobPins: any[] = []; // Empty array - no mock data

  const mapMarkers = jobPins.map(job => ({
    id: job.id,
    position: job.position,
    title: job.title,
    info: `$${job.price} - ${job.client} - ${job.time}`,
    type: 'job' as const,
    onClick: () => setSelectedJob(job)
  }));

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
        {/* Map Container */}
        <div className="relative h-[calc(100vh-160px)] rounded-lg overflow-hidden">
          <GoogleMap
                center={{ lat: 40.7128, lng: -74.0060 }}
                zoom={13}
                markers={mapMarkers}
            className="w-full h-full"
          />

          {/* Selected Job Card */}
              {selectedJob && (
                <Card className="absolute bottom-6 left-6 w-80 shadow-xl z-10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{selectedJob.title}</CardTitle>
                      {selectedJob.urgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">Client: {selectedJob.client}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm">{selectedJob.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {selectedJob.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedJob.distance} away
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-xl text-success">${selectedJob.price}</span>
                        <Button 
                          size="sm"
                          onClick={() => {
                            // Navigate to job requests page to apply
                            navigate('/job-requests');
                          }}
                        >
                          Apply Now
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

export default ProviderMap;