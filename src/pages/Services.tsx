import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { supabase } from "@/integrations/supabase/client";

const defaultServices = [
  {
    title: "Wedding Mandap",
    description: "Beautiful mandap setups for traditional and modern weddings",
    image: "https://i.pinimg.com/originals/59/0c/da/590cda3575908c87e1f14804ae46e155.jpg",
    link: "/mandap",
    buttonText: "View Varieties"
  },
  {
    title: "Lighting",
    description: "Professional decorative lighting for all occasions",
    image: "https://tse2.mm.bing.net/th/id/OIP.yTLhRdw3xUgVkU82r98kwAHaEn?pid=Api&P=0&h=180",
    link: "/lighting",
    buttonText: "View Varieties"
  },
  {
    title: "Wedding Shop",
    description: "Garlands, decorations & wedding accessories",
    image: "https://tse2.mm.bing.net/th?id=OIF.9bdzH5sI%2fOHHuOQR9qMWOQ&pid=Api&P=0&h=180",
    link: "/wedding-shop",
    buttonText: "View Varieties"
  },
  {
    title: "Drums",
    description: "Traditional & wedding drums for ceremonies",
    image: "https://tastysnack.in/wp-content/uploads/2022/12/Kerala-Bride-Played-Drum-During-Wedding-Gone-Viral-4-1120x728.jpg",
    link: "/drums",
    buttonText: "View Varieties"
  },
  {
    title: "Driving Services",
    description: "Professional drivers for your events",
    image: "https://tse2.mm.bing.net/th/id/OIP.BekLeG_3xl_3aZb-GfAXOAHaE7?pid=Api&P=0&h=180",
    link: "/driving-services",
    buttonText: "View Varieties"
  }
];

interface OtherService {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
}

const Services = () => {
  const [otherServices, setOtherServices] = useState<OtherService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOtherServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("category", "Other")
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setOtherServices(data);
      }
      setIsLoading(false);
    };

    fetchOtherServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-navbar pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
              Our Services
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Comprehensive wedding and event solutions to make your special day unforgettable
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {defaultServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
          
          {/* Other services from database */}
          {otherServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (defaultServices.length + index) * 0.1 }}
            >
              <ServiceCard
                title={service.name}
                description={service.description || ""}
                image={service.image_url || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400"}
                price={service.price || undefined}
                link={`/booking?service=${encodeURIComponent(service.name)}`}
                buttonText="Book Now"
              />
            </motion.div>
          ))}
        </div>
        
        {isLoading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services;
