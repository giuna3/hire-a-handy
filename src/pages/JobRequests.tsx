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

      // Fetch applications made by this provider
      const { data: applicationsData, error } = await supabase
        .from('applications')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching provider applications:', error);
        toast.error('Failed to load your applications');
        return;
      }

      if (!applicationsData || applicationsData.length === 0) {
        setJobs([]);
        return;
      }

      // Get booking IDs from applications
      const bookingIds = applicationsData.map(app => app.booking_id);

      // Fetch booking details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .in('id', bookingIds);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        toast.error('Failed to load booking details');
        return;
      }

      // Get unique client IDs from bookings
      const clientIds = [...new Set(bookingsData?.map(booking => booking.client_id) || [])];
      
      let clientProfiles = [];
      if (clientIds.length > 0) {
        const { data: clientProfilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', clientIds);
        clientProfiles = clientProfilesData || [];
      }

      // Create booking lookup map
      const bookingsMap = new Map();
      bookingsData?.forEach(booking => {
        bookingsMap.set(booking.id, booking);
      });

      // Transform the data
      const transformedJobs = applicationsData.map(application => {
        const booking = bookingsMap.get(application.booking_id);
        if (!booking) return null;
        
        const clientProfile = clientProfiles.find(profile => profile.user_id === booking.client_id);
        return {
          ...booking,
          application_id: application.id,
          application_status: application.status,
          application_message: application.message,
          title: booking.notes || 'Service Request',
          description: booking.notes || 'No description provided',
          client_name: clientProfile?.full_name || 'Unknown Client',
          category: 'General',
          amount: booking.amount,
          date: booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'TBD',
          time: booking.booking_date ? new Date(booking.booking_date).toLocaleTimeString() : 'TBD'
        };
      }).filter(Boolean);

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching provider applications:', error);
      toast.error('Failed to load applications');
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
            <h1 className="text-xl font-semibold ml-4">My Job Applications</h1>
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
              <p className="text-muted-foreground">Loading your applications...</p>
            </div>
           ) : availableJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
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
                         <Badge 
                           variant={
                             job.application_status === 'accepted' ? 'default' :
                             job.application_status === 'rejected' ? 'destructive' :
                             'secondary'
                           }
                           className="text-xs"
                         >
                           {job.application_status === 'pending' ? 'Application Pending' :
                            job.application_status === 'accepted' ? 'Accepted' :
                            job.application_status === 'rejected' ? 'Rejected' :
                            job.application_status}
                         </Badge>
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
                       {job.application_status === 'accepted' && (
                         <Button 
                           size="sm" 
                           className="px-6"
                           onClick={() => {
                             toast.success(`Job marked as complete: ${job.title}`);
                           }}
                         >
                           Mark Complete
                         </Button>
                       )}
                       {job.application_status === 'pending' && (
                         <Badge variant="secondary" className="px-3">
                           Waiting for response
                         </Badge>
                       )}
                       {job.application_status === 'rejected' && (
                         <Badge variant="outline" className="px-3">
                           Application declined
                         </Badge>
                       )}
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