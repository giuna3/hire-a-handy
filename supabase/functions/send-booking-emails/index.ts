import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailData {
  bookingId: string;
  clientEmail: string;
  providerEmail: string;
  clientName: string;
  providerName: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  bookingDate?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      bookingId, 
      clientEmail, 
      providerEmail, 
      clientName, 
      providerName, 
      serviceTitle, 
      amount, 
      currency,
      bookingDate 
    }: BookingEmailData = await req.json();

    // Send email to client
    const clientEmailResponse = await resend.emails.send({
      from: "SkillConnect <bookings@resend.dev>",
      to: [clientEmail],
      subject: `Booking Confirmed - ${serviceTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Booking Confirmed!</h1>
          <p>Dear ${clientName},</p>
          <p>Your booking has been confirmed. Here are the details:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Service:</strong> ${serviceTitle}</p>
            <p><strong>Provider:</strong> ${providerName}</p>
            <p><strong>Amount Paid:</strong> ₾${amount}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            ${bookingDate ? `<p><strong>Date:</strong> ${bookingDate}</p>` : ''}
          </div>
          
          <p>The provider will contact you shortly to coordinate the service details.</p>
          <p>Thank you for using SkillConnect!</p>
        </div>
      `,
    });

    // Send email to provider
    const providerEmailResponse = await resend.emails.send({
      from: "SkillConnect <bookings@resend.dev>",
      to: [providerEmail],
      subject: `New Booking Received - ${serviceTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">New Booking Received!</h1>
          <p>Dear ${providerName},</p>
          <p>You have received a new booking. Here are the details:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Service:</strong> ${serviceTitle}</p>
            <p><strong>Client:</strong> ${clientName}</p>
            <p><strong>Amount:</strong> ₾${amount}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            ${bookingDate ? `<p><strong>Date:</strong> ${bookingDate}</p>` : ''}
          </div>
          
          <p>Please contact the client to coordinate the service details.</p>
          <p>Client Email: ${clientEmail}</p>
          <p>Thank you for using SkillConnect!</p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { clientEmailResponse, providerEmailResponse });

    return new Response(JSON.stringify({ 
      success: true,
      clientEmailId: clientEmailResponse.data?.id,
      providerEmailId: providerEmailResponse.data?.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});