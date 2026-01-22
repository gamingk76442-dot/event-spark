import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  customerName: string;
  mobile: string;
  serviceName: string;
  eventDate: string;
  eventTime: string;
  notes: string;
  adminEmail: string;
  adminWhatsApp?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerName,
      mobile,
      serviceName,
      eventDate,
      eventTime,
      notes,
      adminEmail,
      adminWhatsApp,
    }: BookingNotificationRequest = await req.json();

    const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Parse notes to display nicely
    const notesHtml = notes
      ? notes
          .split(" | ")
          .map((note) => `<li>${note}</li>`)
          .join("")
      : "<li>No additional notes</li>";

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "Bookings <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🎉 New Booking: ${serviceName} by ${customerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B1538 0%, #D4AF37 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { background: #333; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; }
            .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; width: 150px; color: #8B1538; }
            .value { flex: 1; }
            ul { margin: 0; padding-left: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎊 New Booking Received!</h1>
            </div>
            <div class="content">
              <div class="detail-row">
                <span class="label">📋 Service:</span>
                <span class="value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="label">👤 Customer:</span>
                <span class="value">${customerName}</span>
              </div>
              <div class="detail-row">
                <span class="label">📱 Mobile:</span>
                <span class="value"><a href="tel:${mobile}">${mobile}</a></span>
              </div>
              <div class="detail-row">
                <span class="label">📅 Date:</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">🕐 Time:</span>
                <span class="value">${eventTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">📝 Details:</span>
                <span class="value"><ul>${notesHtml}</ul></span>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">Please respond to this booking promptly!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Generate WhatsApp link if number provided
    let whatsappLink = null;
    if (adminWhatsApp) {
      const whatsappMessage = encodeURIComponent(
        `🎉 *New Booking Alert!*\n\n` +
          `📋 *Service:* ${serviceName}\n` +
          `👤 *Customer:* ${customerName}\n` +
          `📱 *Mobile:* ${mobile}\n` +
          `📅 *Date:* ${formattedDate}\n` +
          `🕐 *Time:* ${eventTime}\n` +
          `📝 *Details:* ${notes || "None"}`
      );
      whatsappLink = `https://wa.me/${adminWhatsApp.replace(/\D/g, "")}?text=${whatsappMessage}`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailSent: true,
        whatsappLink,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
