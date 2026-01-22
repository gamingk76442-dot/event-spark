import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Calendar, Clock, User, Phone, MapPin, Navigation, Users, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

// Helper to determine service category from service name
const getServiceCategory = (serviceName: string): string => {
  const lowerName = serviceName.toLowerCase();
  if (lowerName.includes("driving") || lowerName.includes("driver")) return "driving";
  if (lowerName.includes("mandap")) return "mandap";
  if (lowerName.includes("lighting") || lowerName.includes("light")) return "lighting";
  if (lowerName.includes("drum")) return "drums";
  if (lowerName.includes("wedding shop") || lowerName.includes("garland") || lowerName.includes("decoration")) return "wedding_shop";
  return "other";
};

const Booking = () => {
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get("service") || "";
  const { toast } = useToast();
  
  const serviceCategory = useMemo(() => getServiceCategory(serviceName), [serviceName]);
  
  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    date: "",
    time: "",
    // Driving specific
    pickupLocation: "",
    dropLocation: "",
    // Event specific
    eventVenue: "",
    guestCount: "",
    // General
    additionalNotes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Build notes string from additional fields
  const buildNotesString = (): string => {
    const parts: string[] = [];
    
    if (serviceCategory === "driving" && formData.pickupLocation && formData.dropLocation) {
      parts.push(`Pickup: ${formData.pickupLocation}`);
      parts.push(`Drop: ${formData.dropLocation}`);
    }
    
    if (formData.eventVenue) {
      parts.push(`Venue: ${formData.eventVenue}`);
    }
    
    if (formData.guestCount) {
      parts.push(`Guests: ${formData.guestCount}`);
    }
    
    if (formData.additionalNotes) {
      parts.push(`Notes: ${formData.additionalNotes}`);
    }
    
    return parts.join(" | ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customerName || !formData.mobile || !formData.date || !formData.time) {
      toast({
        title: "Please fill all required fields",
        description: "Name, mobile, date, and time are required.",
        variant: "destructive"
      });
      return;
    }

    // Validate driving-specific fields
    if (serviceCategory === "driving" && (!formData.pickupLocation || !formData.dropLocation)) {
      toast({
        title: "Location Required",
        description: "Please enter pickup and drop locations for driving service.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const notes = buildNotesString();
      
      const { error } = await supabase.from("bookings").insert({
        service_name: serviceName,
        customer_name: formData.customerName,
        mobile: formData.mobile,
        event_date: formData.date,
        event_time: formData.time,
        notes: notes || null,
      });

      if (error) throw error;

      // Fetch notification settings and send notifications
      try {
        const { data: settings } = await supabase
          .from("site_settings")
          .select("setting_key, setting_value")
          .in("setting_key", ["notification_email", "notification_whatsapp"]);

        const notificationEmail = settings?.find(s => s.setting_key === "notification_email")?.setting_value;
        const notificationWhatsApp = settings?.find(s => s.setting_key === "notification_whatsapp")?.setting_value;

        if (notificationEmail) {
          // Send email notification via edge function
          const response = await supabase.functions.invoke("send-booking-notification", {
            body: {
              customerName: formData.customerName,
              mobile: formData.mobile,
              serviceName,
              eventDate: formData.date,
              eventTime: formData.time,
              notes: notes || "",
              adminEmail: notificationEmail,
              adminWhatsApp: notificationWhatsApp || undefined,
            },
          });

          // If WhatsApp is configured and we got a link, open it in new tab
          if (response.data?.whatsappLink && notificationWhatsApp) {
            // Optional: open WhatsApp for admin (only works if admin is on the same device)
            console.log("WhatsApp notification link:", response.data.whatsappLink);
          }
        }
      } catch (notificationError) {
        // Don't fail the booking if notification fails
        console.error("Notification error:", notificationError);
      }

      setIsSubmitted(true);
      toast({
        title: "Booking Confirmed! ✅",
        description: "Our team will check availability and confirm shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-card p-10 rounded-3xl shadow-xl max-w-md border border-border"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
              Booking Successful!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your booking for <span className="font-semibold text-foreground">{serviceName}</span> has been received. 
              Our team will contact you shortly to confirm availability.
            </p>
            <Link
              to="/services"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Browse More Services
            </Link>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-rose/30">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-navbar pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link 
            to="/services"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-saffron transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span>Back to Services</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground">
              Book Your Service
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-xl p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service Name (readonly) */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Service
                </label>
                <input
                  type="text"
                  value={serviceName}
                  readOnly
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground font-medium"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mobile Number <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    className="w-full pl-12 pr-4 py-3 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Event Date <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-background rounded-xl border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Event Time <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-background rounded-xl border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Driving Service: Pickup & Drop Locations */}
              {serviceCategory === "driving" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 p-4 bg-secondary/50 rounded-xl border border-border"
                >
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Navigation size={16} className="text-primary" />
                    Trip Details
                  </p>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Pickup Location <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        placeholder="Enter pickup address"
                        className="w-full pl-12 pr-4 py-3 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Drop Location <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-destructive" size={18} />
                      <input
                        type="text"
                        name="dropLocation"
                        value={formData.dropLocation}
                        onChange={handleChange}
                        placeholder="Enter drop address"
                        className="w-full pl-12 pr-4 py-3 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Event Services: Venue & Guest Count */}
              {(serviceCategory === "mandap" || serviceCategory === "lighting" || serviceCategory === "drums") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 p-4 bg-secondary/50 rounded-xl border border-border"
                >
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    Event Details
                  </p>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Event Venue
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="text"
                        name="eventVenue"
                        value={formData.eventVenue}
                        onChange={handleChange}
                        placeholder="Enter venue address"
                        className="w-full pl-12 pr-4 py-3 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Expected Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="number"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleChange}
                        placeholder="Approximate number of guests"
                        className="w-full pl-12 pr-4 py-3 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Additional Notes */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <MessageSquare size={16} />
                  Additional Notes
                </label>
                <Textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any special requirements or additional information..."
                  className="w-full px-4 py-3 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-accent text-accent-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg mt-4 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </button>
            </form>
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Our team will contact you within 24 hours to confirm your booking
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
