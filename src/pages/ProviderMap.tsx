import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, Clock, MapPin, DollarSign, List, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleMap from "@/components/GoogleMap";
import { supabase } from "@/integrations/supabase/client";

interface AvailableJob {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  booking_date: string;
  client_name: string;
  client_id: string;
  notes: string;
  created_at: string;
  // For map display
  position?: { lat: number; lng: number };
  time?: string;
  client?: string;
  price?: number;
  distance?: string;
  urgent?: boolean;
}

const ProviderMap = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<AvailableJob | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<AvailableJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching available jobs for provider map...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ No authenticated user found');
        setLoading(false);
        return;
      }

      // Fetch available jobs (bookings without assigned providers, excluding own jobs)
      const { data: jobsData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'pending')
        .is('provider_id', null)
        .neq('client_id', user.id)
        .order('created_at', { ascending: false });

      console.log('📊 Jobs query result:', { jobsData, error });

      if (error) {
        console.error('❌ Error fetching available jobs:', error);
        setLoading(false);
        return;
      }

      // Fetch client profiles for the jobs
      const clientIds = [...new Set(jobsData?.map(job => job.client_id) || [])];
      const { data: clientProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', clientIds);

      if (profilesError) {
        console.error('❌ Error fetching client profiles:', profilesError);
      }

      // Transform the data
      const transformedJobs: AvailableJob[] = (jobsData || []).map(job => {
        const clientProfile = clientProfiles?.find(profile => profile.user_id === job.client_id);
        return {
          ...job,
          title: job.notes || 'Service Request',
          description: job.notes || 'No description provided',
          category: 'general', // Default category since bookings table doesn't have category
          client_name: clientProfile?.full_name || 'Unknown Client',
          // Map display properties
          client: clientProfile?.full_name || 'Unknown Client',
          price: job.amount,
          time: job.booking_date ? new Date(job.booking_date).toLocaleDateString() : 'TBD',
          distance: '2.5km', // Mock distance for now
          position: { lat: 40.7128 + (Math.random() - 0.5) * 0.01, lng: -74.0060 + (Math.random() - 0.5) * 0.01 }, // Mock positions around NYC
          urgent: false
        };
      });

      console.log('✅ Transformed jobs:', transformedJobs);
      setJobs(transformedJobs);
    } catch (error) {
      console.error('❌ Error in fetchAvailableJobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.client?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mapMarkers = filteredJobs.map(job => ({
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
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search jobs by title, description, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

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
            <div className="h-[calc(100vh-280px)] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Loading Jobs...</h3>
                  <p className="text-muted-foreground max-w-md">
                    Searching for available job listings in your area.
                  </p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery ? "No matching jobs found" : "No Jobs Available"}
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    {searchQuery 
                      ? "Try adjusting your search terms or clearing the search to see all jobs."
                      : "There are currently no job listings in your area. Check back later or expand your search radius."
                    }
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
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