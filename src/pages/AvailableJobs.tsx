import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, DollarSign, User, Search, Filter, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
}

const AvailableJobs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<AvailableJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setJobs([]);
        return;
      }

      // Fetch available jobs (bookings without assigned providers, excluding own jobs)
      const { data: jobsData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'pending')
        .is('provider_id', null) // Only jobs without assigned providers
        .neq('client_id', user.id) // Exclude own job postings
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching available jobs:', error);
        toast.error('Failed to load available jobs');
        setJobs([]);
        return;
      }

      if (!jobsData || jobsData.length === 0) {
        setJobs([]);
        return;
      }

      // Get unique client IDs from jobs
      const clientIds = [...new Set(jobsData.map(job => job.client_id))];

      // Fetch client profiles
      const { data: clients, error: clientsError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', clientIds);

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        toast.error('Failed to load client details');
        return;
      }

      // Create a map of client profiles for quick lookup
      const clientMap = new Map();
      clients?.forEach(client => {
        clientMap.set(client.user_id, client);
      });

      // Transform the data
      const transformedJobs: AvailableJob[] = jobsData.map((job: any) => {
        const client = clientMap.get(job.client_id);
        const notes = job.notes || '';
        const [title, ...descriptionParts] = notes.split(' - ');
        
        return {
          id: job.id,
          title: title || 'Job Posting',
          description: descriptionParts.join(' - ') || 'No description provided',
          category: 'General', // We'll need to extract this from notes if needed
          amount: job.amount || 0,
          booking_date: job.booking_date,
          client_name: client?.full_name || 'Unknown Client',
          client_id: job.client_id,
          notes: job.notes,
          created_at: job.created_at
        };
      });

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching available jobs:', error);
      toast.error('Failed to load available jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "all" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyToJob = async (jobId: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to apply to jobs');
        return;
      }

      // Create an application instead of directly assigning the provider
      const { error } = await supabase
        .from('applications')
        .insert({
          booking_id: jobId,
          provider_id: user.id,
          message: 'I would like to work on this job.'
        });

      if (error) {
        console.error('Error applying to job:', error);
        toast.error('Failed to apply to job');
        return;
      }

      toast.success('Application submitted! The client will review and contact you.');
      
      // Refresh the jobs list to show updated state
      fetchAvailableJobs();
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('Failed to apply to job');
    }
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No available jobs</h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery || selectedCategory
          ? "No jobs match your current filters"
          : "There are no available jobs at the moment"}
      </p>
      {(searchQuery || selectedCategory) && (
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchQuery("");
            setSelectedCategory("");
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  const JobCard = ({ job }: { job: AvailableJob }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-muted-foreground text-sm">{job.description}</p>
              <div className="flex items-center mt-2">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Posted by {job.client_name}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">₾{job.amount}</p>
              <Badge variant="outline">Available</Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            {job.booking_date && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Needed: {new Date(job.booking_date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm"
              onClick={() => handleApplyToJob(job.id)}
            >
              Apply to Job
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/chat/${job.client_id}`)}
            >
              Contact Client
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/provider-home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold ml-4">Available Jobs</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Available Jobs</h1>
            <p className="text-muted-foreground">Browse and apply to job postings from clients</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="House Cleaning">House Cleaning</SelectItem>
                  <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                  <SelectItem value="Lawn Care">Lawn Care</SelectItem>
                  <SelectItem value="Gardening">Gardening</SelectItem>
                  <SelectItem value="Handyman Services">Handyman Services</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical Work">Electrical Work</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                  <SelectItem value="Pet Care">Pet Care</SelectItem>
                  <SelectItem value="Babysitting">Babysitting</SelectItem>
                  <SelectItem value="Tutoring">Tutoring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Search Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${filteredJobs.length} jobs available`}
          </p>
          {(searchQuery || selectedCategory) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {loading ? (
            <LoadingState />
          ) : filteredJobs.length === 0 ? (
            <EmptyState />
          ) : (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableJobs;