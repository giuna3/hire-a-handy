import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star, User, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Booking {
  id: string;
  title: string;
  provider: string;
  date: string;
  location: string;
  price: number;
  status: string;
  avatar: string;
}

const ClientBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch actual bookings from the database
      // For now, we'll show empty state since there are no real bookings yet
      setBookings([]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(booking => booking.status === "upcoming");
  const activeBookings = bookings.filter(booking => booking.status === "active");
  const completedBookings = bookings.filter(booking => booking.status === "completed");

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No {type} bookings</h3>
      <p className="text-muted-foreground mb-6">
        {type === "upcoming" 
          ? "You don't have any upcoming bookings scheduled"
          : type === "active"
          ? "No services are currently in progress"
          : "You haven't completed any services yet"}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => navigate('/client-map')}>
          <MapPin className="w-4 h-4 mr-2" />
          Find Providers
        </Button>
        <Button variant="outline" onClick={() => navigate('/new-job')}>
          <Calendar className="w-4 h-4 mr-2" />
          Post a Job
        </Button>
      </div>
    </div>
  );

  const BookingCard = ({ booking, showActions = false }: { booking: Booking; showActions?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg flex-shrink-0">
            {booking.avatar}
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{booking.title}</h3>
                <p className="text-muted-foreground">with {booking.provider}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₾{booking.price}</p>
                <Badge 
                  variant={
                    booking.status === "completed" ? "default" : 
                    booking.status === "active" ? "secondary" : 
                    "outline"
                  }
                >
                  {booking.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{booking.location}</span>
              </div>
            </div>
            
            {showActions && (
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/rating-review')}
                >
                  Rate & Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const providerId = "550e8400-e29b-41d4-a716-446655440001";
                    const serviceId = "660e8400-e29b-41d4-a716-446655440001";
                    navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                  }}
                >
                  Hire Again
                </Button>
              </div>
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
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">Manage your service appointments and history</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button onClick={() => navigate('/client-map')}>
              <Calendar className="w-4 h-4 mr-2" />
              Book Service
            </Button>
          </div>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <LoadingState />
            ) : upcomingBookings.length === 0 ? (
              <EmptyState type="upcoming" />
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <LoadingState />
            ) : activeBookings.length === 0 ? (
              <EmptyState type="active" />
            ) : (
              activeBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <LoadingState />
            ) : completedBookings.length === 0 ? (
              <EmptyState type="completed" />
            ) : (
              completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showActions={true} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientBookings;