import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, Clock, MapPin, DollarSign, List, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleMap from "@/components/GoogleMap";

const ProviderMap = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const jobPins: any[] = []; // Empty array - no mock data

  const mapMarkers = jobPins.map(job => ({
    id: job.id,
    position: job.position,
    title: job.title,
    info: `₾${job.price} - ${job.client} - ${job.time}`,
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
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-0">
            <div className="relative h-[calc(100vh-220px)] rounded-lg overflow-hidden">
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
                        <span className="font-semibold text-xl text-success">₾{selectedJob.price}</span>
                        <Button 
                          size="sm"
                          onClick={() => {
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
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="h-[calc(100vh-220px)] overflow-y-auto">
              {jobPins.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Jobs Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    There are currently no job listings in your area. Check back later or expand your search radius.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {jobPins.map((job) => (
                    <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedJob(job)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          {job.urgent && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">Client: {job.client}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm">{job.description}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {job.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {job.distance} away
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="font-semibold text-xl text-success">₾{job.price}</span>
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/job-requests');
                              }}
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderMap;