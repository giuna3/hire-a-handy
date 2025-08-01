import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  rate: number;
  rate_type: string;
  duration_minutes: number;
  provider_id: string;
}

interface ProviderDetails {
  full_name: string;
  email: string;
  phone: string;
}

export default function BookingPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const serviceId = searchParams.get("serviceId");
  const providerId = searchParams.get("providerId");

  useEffect(() => {
    if (!serviceId || !providerId) {
      toast.error("Invalid booking parameters");
      navigate("/");
      return;
    }

    fetchServiceAndProvider();
  }, [serviceId, providerId]);

  const fetchServiceAndProvider = async () => {
    try {
      // Fetch service details
      const { data: serviceData, error: serviceError } = await (supabase as any)
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .eq("provider_id", providerId)
        .eq("is_active", true)
        .single();

      if (serviceError) throw serviceError;

      // Fetch provider details
      const { data: providerData, error: providerError } = await (supabase as any)
        .from("profiles")
        .select("full_name, email, phone")
        .eq("user_id", providerId)
        .single();

      if (providerError) throw providerError;

      setService(serviceData);
      setProvider(providerData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load service details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to book this service");
        navigate("/auth");
        return;
      }

      // Call Stripe payment edge function
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          serviceId: service?.id,
          providerId: providerId,
          amount: service?.rate,
          currency: "gel",
          serviceTitle: service?.title,
          providerName: provider?.full_name,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service || !provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Service not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Complete Booking</h1>
        </div>

        {/* Service Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {service.title}
              <Badge variant="secondary">{service.category}</Badge>
            </CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider Info */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{provider.full_name}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{service.duration_minutes} minutes</span>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service Rate:</span>
                <span className="font-medium">
                  ₾{service.rate} {service.rate_type === 'hourly' ? '/hour' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration:</span>
                <span>{service.duration_minutes} minutes</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-primary">₾{service.rate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              You will be redirected to Stripe to complete your payment securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">What happens next:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll be redirected to secure Stripe checkout</li>
                  <li>• After payment, a booking will be created automatically</li>
                  <li>• Both you and the provider will receive email confirmations</li>
                  <li>• You can manage your booking from your dashboard</li>
                </ul>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full"
                size="lg"
              >
                {processing ? "Processing..." : `Pay ₾${service.rate} & Book Now`}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By clicking "Pay & Book Now", you agree to our terms of service
                and confirm your booking details are correct.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}