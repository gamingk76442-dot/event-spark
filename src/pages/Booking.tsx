import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Calendar, Clock, User, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get("service") || "";
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    date: "",
    time: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.customerName || !formData.mobile || !formData.date || !formData.time) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to complete your booking.",
        variant: "destructive"
      });
      return;
    }

    // Simulate booking
    setIsSubmitted(true);
    toast({
      title: "Booking Confirmed! ✅",
      description: "Our team will check availability and confirm shortly.",
    });
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
          className="max-w-md mx-auto"
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
                  Your Name
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
                  Mobile Number
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

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Event Date
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
                  Event Time
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

              <button
                type="submit"
                className="w-full py-4 bg-gradient-accent text-accent-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg mt-4"
              >
                Confirm Booking
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
