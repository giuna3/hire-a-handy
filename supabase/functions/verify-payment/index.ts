import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (session.payment_status === "paid") {
      // Update booking status to confirmed
      const { data: booking, error: updateError } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("stripe_session_id", sessionId)
        .select("*")
        .single();

      if (updateError) {
        console.error("Booking update error:", updateError);
        throw new Error("Failed to update booking status");
      }

      // Get client and provider details for email
      const { data: clientProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", booking.client_id)
        .single();

      const { data: providerProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", booking.provider_id)
        .single();

      const { data: service } = await supabase
        .from("services")
        .select("title")
        .eq("id", booking.service_id)
        .single();

      // Send booking confirmation emails
      if (clientProfile && providerProfile && service) {
        const emailResponse = await supabase.functions.invoke("send-booking-emails", {
          body: {
            bookingId: booking.id,
            clientEmail: clientProfile.email,
            providerEmail: providerProfile.email,
            clientName: clientProfile.full_name || "Client",
            providerName: providerProfile.full_name || "Provider",
            serviceTitle: service.title,
            amount: booking.amount,
            currency: booking.currency,
            bookingDate: booking.booking_date,
          },
        });

        console.log("Email notification result:", emailResponse);
      }

      console.log("Booking confirmed successfully:", booking.id);

      return new Response(JSON.stringify({ 
        success: true, 
        booking: booking,
        paymentStatus: session.payment_status 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Payment not completed
      return new Response(JSON.stringify({ 
        success: false, 
        paymentStatus: session.payment_status 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});