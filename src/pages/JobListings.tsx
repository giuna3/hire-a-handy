import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, User, Plus, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface JobListing {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  booking_date: string;
  status: string;
  notes: string;
  created_at: string;
}

const JobListings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setJobs([]);
        return;
      }

      // Fetch job postings (bookings without assigned providers)
      const { data: jobsData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', user.id)
        .is('provider_id', null) // Only jobs without assigned providers
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load job listings');
        setJobs([]);
        return;
      }

      // Transform the data
      const transformedJobs: JobListing[] = jobsData?.map((job: any) => {
        const notes = job.notes || '';
        const [title, ...descriptionParts] = notes.split(' - ');
        
        return {
          id: job.id,
          title: title || 'Job Posting',
          description: descriptionParts.join(' - ') || 'No description provided',
          category: 'General', // We'll need to extract this from notes if needed
          amount: job.amount || 0,
          booking_date: job.booking_date,
          status: job.status,
          notes: job.notes,
          created_at: job.created_at
        };
      }) || [];

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job listings');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = jobs.filter(job => job.status === "pending");
  const inProgressJobs = jobs.filter(job => job.status === "active");
  const completedJobs = jobs.filter(job => job.status === "completed");

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        No {type} jobs
      </h3>
      <p className="text-muted-foreground mb-6">
        {type === "active" 
          ? "You don't have any active job postings"
          : type === "in progress"
          ? "No jobs are currently in progress"
          : "You haven't completed any job postings yet"}
      </p>
      <Button onClick={() => navigate('/new-job')}>
        <Plus className="w-4 h-4 mr-2" />
        Post a Job
      </Button>
    </div>
  );

  const JobCard = ({ job }: { job: JobListing }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-muted-foreground text-sm">{job.description}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">₾{job.amount}</p>
              <Badge 
                variant={
                  job.status === "completed" ? "default" : 
                  job.status === "active" ? "secondary" : 
                  "outline"
                }
              >
                {job.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            {job.booking_date && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(job.booking_date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            {job.status === "pending" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/new-job?edit=${job.id}`)}
                >
                  Edit Job
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // TODO: Implement delete job functionality
                    toast.info('Delete functionality coming soon');
                  }}
                >
                  Delete
                </Button>
              </>
            )}
            {job.status === "active" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/client-chat-list`)}
              >
                View Messages
              </Button>
            )}
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
            <Button variant="ghost" onClick={() => navigate("/client-home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold ml-4">My Job Listings</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Job Postings</h1>
            <p className="text-muted-foreground">Manage your posted jobs and track their progress</p>
          </div>
          
          <Button onClick={() => navigate('/new-job')}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Job Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedJobs.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <LoadingState />
            ) : activeJobs.length === 0 ? (
              <EmptyState type="active" />
            ) : (
              activeJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="in-progress" className="space-y-4">
            {loading ? (
              <LoadingState />
            ) : inProgressJobs.length === 0 ? (
              <EmptyState type="in progress" />
            ) : (
              inProgressJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <LoadingState />
            ) : completedJobs.length === 0 ? (
              <EmptyState type="completed" />
            ) : (
              completedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JobListings;