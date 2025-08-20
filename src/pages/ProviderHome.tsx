import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, MapPin, Clock, User, Menu, TrendingUp, Calendar, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CATEGORIES } from "@/types/categories";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProviderHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [urgentOnly, setUrgentOnly] = useState(false);
  
  // Real data state
  const [todayJobs, setTodayJobs] = useState<any[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    thisWeekEarnings: 0,
    totalJobs: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderData();
    
    // Track provider presence
    const trackPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel('provider_presence');
      
      await channel.subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;
        
        await channel.track({
          user_id: user.id,
          user_type: 'provider',
          online_at: new Date().toISOString(),
        });
      });

      // Clean up on window close/refresh
      const handleBeforeUnload = () => {
        channel.untrack();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        channel.untrack();
        supabase.removeChannel(channel);
      };
    };

    trackPresence();
  }, []);

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to view provider data');
        return;
      }

      // Fetch today's bookings for the provider
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: todayBookings, error: todayError } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          amount,
          status,
          duration_minutes,
          notes,
          client_id,
          service_id
        `)
        .eq('provider_id', user.id)
        .gte('booking_date', today.toISOString())
        .lt('booking_date', tomorrow.toISOString())
        .order('booking_date', { ascending: true });

      if (todayError) {
        console.error('Error fetching today\'s bookings:', todayError);
        setTodayJobs([]);
      } else {
        // Get unique client IDs and service IDs
        const clientIds = [...new Set((todayBookings || []).map(booking => booking.client_id).filter(Boolean))];
        const serviceIds = [...new Set((todayBookings || []).map(booking => booking.service_id).filter(Boolean))];

        // Fetch client profiles and services separately
        const [clientsResponse, servicesResponse] = await Promise.all([
          clientIds.length > 0 ? supabase.from('profiles').select('user_id, full_name').in('user_id', clientIds) : { data: [], error: null },
          serviceIds.length > 0 ? supabase.from('services').select('id, title, category').in('id', serviceIds) : { data: [], error: null }
        ]);

        // Create lookup maps
        const clientMap = new Map();
        clientsResponse.data?.forEach(client => clientMap.set(client.user_id, client));
        
        const serviceMap = new Map();
        servicesResponse.data?.forEach(service => serviceMap.set(service.id, service));

        const formattedTodayJobs = (todayBookings || []).map((booking: any) => {
          const client = clientMap.get(booking.client_id);
          const service = serviceMap.get(booking.service_id);
          
          return {
            id: booking.id,
            title: service?.title || 'Service',
            client: client?.full_name || 'Unknown Client',
            price: Number(booking.amount),
            time: new Date(booking.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: booking.status,
            category: service?.category || 'general'
          };
        });
        setTodayJobs(formattedTodayJobs);
      }

      // Fetch provider statistics
      const { data: allBookings, error: allBookingsError } = await supabase
        .from('bookings')
        .select('amount, booking_date, status')
        .eq('provider_id', user.id)
        .eq('status', 'completed');

      if (allBookingsError) {
        console.error('Error fetching booking stats:', allBookingsError);
      } else {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const todayEarnings = (allBookings || [])
          .filter((booking: any) => {
            const bookingDate = new Date(booking.booking_date);
            return bookingDate.toDateString() === today.toDateString();
          })
          .reduce((sum: number, booking: any) => sum + Number(booking.amount), 0);

        const thisWeekEarnings = (allBookings || [])
          .filter((booking: any) => {
            const bookingDate = new Date(booking.booking_date);
            return bookingDate >= startOfWeek;
          })
          .reduce((sum: number, booking: any) => sum + Number(booking.amount), 0);

        const totalJobs = allBookings?.length || 0;

        setStats({
          todayEarnings,
          thisWeekEarnings,
          totalJobs,
          rating: totalJobs > 0 ? 4.8 + Math.random() * 0.4 : 0 // Mock rating for now
        });
      }

      // Fetch available jobs for providers
      await fetchAvailableJobs();

    } catch (error) {
      console.error('Error fetching provider data:', error);
      toast.error('Failed to load provider data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      console.log('🔍 Fetching available jobs...');
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Current user:', user?.id);
      if (!user) {
        console.log('❌ No user found, setting empty jobs');
        setAvailableJobs([]);
        return;
      }

      // Fetch available jobs (bookings without assigned providers, excluding own jobs)
      console.log('🔍 About to query with user.id:', user.id);
      const { data: jobsData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'pending')
        .is('provider_id', null) // Only jobs without assigned providers
        .neq('client_id', user.id) // Exclude own job postings
        .order('created_at', { ascending: false });

      console.log('📊 Jobs query result:', { jobsData, error, userIdUsedInQuery: user.id });

      if (error) {
        console.error('❌ Error fetching available jobs:', error);
        setAvailableJobs([]);
        return;
      }

      if (!jobsData || jobsData.length === 0) {
        console.log('📭 No jobs found or empty result');
        setAvailableJobs([]);
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
        return;
      }

      // Create a map of client profiles for quick lookup
      const clientMap = new Map();
      clients?.forEach(client => {
        clientMap.set(client.user_id, client);
      });

      // Transform the data to match the expected format for the UI
      const transformedJobs = jobsData.map((job: any) => {
        const client = clientMap.get(job.client_id);
        const notes = job.notes || '';
        const [title, ...descriptionParts] = notes.split(' - ');
        
        return {
          id: job.id,
          title: title || 'Job Posting',
          description: descriptionParts.join(' - ') || 'No description provided',
          category: 'General', // We'll need to extract this from notes if needed
          price: job.amount || 0,
          client: client?.full_name || 'Unknown Client',
          time: job.booking_date ? new Date(job.booking_date).toLocaleDateString() : 'TBD',
          distance: '2.3 km', // Mock distance for now
          urgent: false, // We can add this field to bookings later if needed
          created_at: job.created_at
        };
      });

      console.log('✅ Transformed jobs:', transformedJobs);
      setAvailableJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching available jobs:', error);
      setAvailableJobs([]);
    }
  };

  // Filter jobs based on search and filters (keeping same logic for when we have real job data)
  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.client?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    
    const matchesDistance = distanceFilter === "all" || 
                           (distanceFilter === "1" && parseFloat(job.distance || "0") <= 1) ||
                           (distanceFilter === "3" && parseFloat(job.distance || "0") <= 3) ||
                           (distanceFilter === "5" && parseFloat(job.distance || "0") <= 5);
    
    const matchesPrice = priceFilter === "all" ||
                        (priceFilter === "low" && job.price < 50) ||
                        (priceFilter === "medium" && job.price >= 50 && job.price < 100) ||
                        (priceFilter === "high" && job.price >= 100);
    
    const matchesUrgent = !urgentOnly || job.urgent;
    
    return matchesSearch && matchesCategory && matchesDistance && matchesPrice && matchesUrgent;
  });

  return (
    <div className="min-h-screen subtle-gradient">
      {/* Language Switcher */}
      <div className="fixed top-4 right-16 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 sm:p-12 text-white shadow-[var(--shadow-hero)] animate-fade-in-up">
          <div className="absolute inset-0 glow-effect opacity-30"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {t('providerHome.goodMorning')}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto">
              {t('providerHome.readyToEarn')}
            </p>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
          <Card className="group border-0 bg-gradient-to-br from-white to-success/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-success/10 group-hover:bg-success/20 transition-colors duration-300 mx-auto w-fit">
                <DollarSign className="w-8 h-8 text-success group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                ₾{loading ? "..." : stats.todayEarnings.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Today's Earnings</p>
            </CardContent>
          </Card>
          
          <Card className="group border-0 bg-gradient-to-br from-white to-primary/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mx-auto w-fit">
                <TrendingUp className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ₾{loading ? "..." : stats.thisWeekEarnings.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
          
          <Card className="group border-0 bg-gradient-to-br from-white to-accent/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 mx-auto w-fit">
                <Calendar className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                {stats.totalJobs}
              </p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </CardContent>
          </Card>
          
          <Card className="group border-0 bg-gradient-to-br from-white to-yellow-500/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-300 mx-auto w-fit">
                <User className="w-8 h-8 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                {loading ? "..." : (stats.rating > 0 ? stats.rating.toFixed(1) : "N/A")}
              </p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Today's Schedule */}
        <Card className="border-0 bg-gradient-to-br from-white via-white to-muted/20 shadow-[var(--shadow-card)] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-muted/30">
            <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your confirmed and pending jobs for today</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {todayJobs.length > 0 ? (
              <div className="space-y-4">
                {todayJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/40 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-muted-foreground text-sm">Client: {job.client}</p>
                        <p className="text-sm text-muted-foreground">{job.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-success">₾{job.price}</p>
                        <Badge variant={job.status === "confirmed" ? "default" : "secondary"}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 p-4 rounded-full bg-muted/50 w-20 h-20 flex items-center justify-center mx-auto">
                  <Calendar className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No jobs scheduled for today</p>
                <p className="text-sm text-muted-foreground mt-2">Great time to find new opportunities!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
          <Card 
            className="group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02] overflow-hidden border-0 bg-gradient-to-br from-white to-primary/10"
            onClick={() => navigate('/provider-map')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mx-auto w-fit">
                  <MapPin className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">Browse Jobs Map</h3>
                <p className="text-muted-foreground text-sm">Find jobs near you on the map</p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02] overflow-hidden border-0 bg-gradient-to-br from-white to-accent/10"
            onClick={() => navigate('/provider-services')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4 p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 mx-auto w-fit">
                  <Calendar className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors duration-300">Post Services</h3>
                <p className="text-muted-foreground text-sm">Manage your service offerings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Job Search Section */}
        <Card className="border-0 bg-gradient-to-br from-white via-white to-muted/20 shadow-[var(--shadow-card)] animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-muted/30">
            <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              <Search className="w-5 h-5 mr-2 text-primary" />
              Find Jobs
            </CardTitle>
            <CardDescription>Search and filter available jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Enhanced Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, clients, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm text-base"
              />
            </div>

            {/* Enhanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border border-muted/30">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {t(category.translationKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Distance</label>
                <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                  <SelectTrigger className="border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Any Distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Distance</SelectItem>
                    <SelectItem value="1">Within 1 mile</SelectItem>
                    <SelectItem value="3">Within 3 miles</SelectItem>
                    <SelectItem value="5">Within 5 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="low">Under ₾50</SelectItem>
                    <SelectItem value="medium">₾50 - ₾100</SelectItem>
                    <SelectItem value="high">₾100+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant={urgentOnly ? "default" : "outline"}
                  onClick={() => setUrgentOnly(!urgentOnly)}
                  className={`w-full h-10 font-medium transition-all duration-300 ${
                    urgentOnly 
                      ? "bg-gradient-to-r from-primary to-primary-hover shadow-[var(--shadow-button)]" 
                      : "border-muted/40 hover:bg-primary/10"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {urgentOnly ? "Urgent Only" : "All Jobs"}
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground p-3 rounded-lg bg-primary/5 border border-primary/20">
              Showing <span className="font-semibold text-primary">{filteredJobs.length}</span> of <span className="font-semibold">{availableJobs.length}</span> available jobs
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Available Jobs */}
        <Card className="border-0 bg-gradient-to-br from-white via-white to-muted/20 shadow-[var(--shadow-card)] animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-muted/30">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Available Jobs Near You
            </CardTitle>
            <CardDescription>Apply to jobs that match your skills</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <div 
                    key={job.id} 
                    className="group border-0 rounded-xl p-4 bg-gradient-to-r from-white to-muted/20 hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.01] animate-fade-in-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-bold text-base group-hover:text-primary transition-colors duration-300">{job.title}</h4>
                          {job.urgent && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              🔥 Urgent
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs capitalize bg-primary/10 text-primary">
                            {job.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3 text-sm">{job.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1 text-primary" />
                            {job.client}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-accent" />
                            {job.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-success" />
                            {job.distance}
                          </span>
                        </div>
                      </div>
                      <div className="text-center sm:text-right flex-shrink-0 sm:ml-6">
                        <p className="font-bold text-2xl text-success mb-2">₾{job.price}</p>
                        <Button 
                          className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-semibold rounded-xl shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105"
                          onClick={() => navigate('/job-requests')}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 p-4 rounded-full bg-muted/50 w-20 h-20 flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No jobs available right now</h3>
                <p className="text-muted-foreground mb-6">Check back later for new opportunities or browse jobs on the map</p>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/provider-map')}
                  className="bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/30"
                >
                  Browse Jobs Map
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderHome;