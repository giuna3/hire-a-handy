import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      toast.error("Invalid session");
      navigate("/");
      return;
    }

    confirmBooking();
  }, [sessionId]);

  const confirmBooking = async () => {
    try {
      // Call verify payment function
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { sessionId },
      });

      if (error) throw error;

      if (data?.success) {
        setBookingConfirmed(true);
        toast.success("Booking confirmed successfully!");
      } else {
        toast.error("Failed to confirm booking");
      }
    } catch (error) {
      console.error("Booking confirmation error:", error);
      toast.error("Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            {bookingConfirmed ? "Booking Confirmed!" : "Payment Successful!"}
          </CardTitle>
          <CardDescription>
            {bookingConfirmed 
              ? "Your service has been booked successfully. Both you and the provider will receive email confirmations."
              : "Your payment was processed successfully. We're confirming your booking..."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">What's Next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your email for booking confirmation</li>
              <li>• The provider will contact you to coordinate details</li>
              <li>• You can view your booking in your dashboard</li>
              <li>• Rate and review after service completion</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            <Button 
              onClick={() => navigate("/client/bookings")} 
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}