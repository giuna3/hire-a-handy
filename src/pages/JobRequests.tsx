import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, MapPin, User, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const JobRequests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderJobs();
  }, []);

  const fetchProviderJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      // Fetch jobs assigned to this provider
      const { data: jobsData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching provider jobs:', error);
        toast.error('Failed to load your jobs');
        return;
      }

      // Fetch client profiles for the jobs
      const clientIds = [...new Set(jobsData?.map(job => job.client_id) || [])];
      const { data: clientProfiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', clientIds);

      // Transform the data
      const transformedJobs = (jobsData || []).map(job => {
        const clientProfile = clientProfiles?.find(profile => profile.user_id === job.client_id);
        return {
          ...job,
          title: job.notes || 'Service Request',
          description: job.notes || 'No description provided',
          client_name: clientProfile?.full_name || 'Unknown Client',
          category: 'General', // Default since bookings table doesn't have category
          amount: job.amount,
          date: job.booking_date ? new Date(job.booking_date).toLocaleDateString() : 'TBD',
          time: job.booking_date ? new Date(job.booking_date).toLocaleTimeString() : 'TBD'
        };
      });

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching provider jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const availableJobs = jobs; // Use real data instead of empty array

  const categories = ["All", "Cleaning", "Handyman", "Tutoring", "Gardening", "Pet Care"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/provider-home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('navigation.back')}
            </Button>
            <h1 className="text-xl font-semibold ml-4">{t('jobRequests.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('jobRequests.searchJobs')}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select defaultValue="All">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-high">Highest Pay</SelectItem>
                <SelectItem value="price-low">Lowest Pay</SelectItem>
                <SelectItem value="distance">Closest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your jobs...</p>
            </div>
          ) : availableJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't been assigned to any jobs yet.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/available-jobs')}
                className="mt-4"
              >
                Browse Available Jobs
              </Button>
            </div>
          ) : (
            availableJobs.map((job) => (
              <Card key={job.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {job.status}
                        </Badge>
                        {job.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            {t('jobRequests.urgent')}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        Client: {job.client_name}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-success">₾{job.amount}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">{job.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {job.client_name}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.date} at {job.time}
                      </span>
                      {job.duration_minutes && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.duration_minutes} min
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/chat/${job.client_id}`)}
                      >
                        Contact Client
                      </Button>
                      <Button 
                        size="sm" 
                        className="px-6"
                        onClick={() => {
                          toast.success(`Job confirmed: ${job.title}`);
                        }}
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button 
            variant="outline"
            onClick={() => {
              // Load more jobs functionality
              console.log("Loading more jobs...");
              // Could fetch more jobs from API or show more from a larger dataset
            }}
          >
            {t('jobRequests.loadMoreJobs')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobRequests;