import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { supabase } from "@/integrations/supabase/client";

interface CategoryConfig {
  key: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  link: string;
}

const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    key: "wedding_mandap",
    defaultTitle: "Wedding Mandap",
    defaultDescription: "Beautiful mandap setups for traditional and modern weddings",
    defaultImage: "https://i.pinimg.com/originals/59/0c/da/590cda3575908c87e1f14804ae46e155.jpg",
    link: "/mandap",
  },
  {
    key: "lighting",
    defaultTitle: "Lighting",
    defaultDescription: "Professional decorative lighting for all occasions",
    defaultImage: "https://tse2.mm.bing.net/th/id/OIP.yTLhRdw3xUgVkU82r98kwAHaEn?pid=Api&P=0&h=180",
    link: "/lighting",
  },
  {
    key: "wedding_shop",
    defaultTitle: "Wedding Shop",
    defaultDescription: "Garlands, decorations & wedding accessories",
    defaultImage: "https://tse2.mm.bing.net/th?id=OIF.9bdzH5sI%2fOHHuOQR9qMWOQ&pid=Api&P=0&h=180",
    link: "/wedding-shop",
  },
  {
    key: "drums",
    defaultTitle: "Drums",
    defaultDescription: "Traditional & wedding drums for ceremonies",
    defaultImage: "https://tastysnack.in/wp-content/uploads/2022/12/Kerala-Bride-Played-Drum-During-Wedding-Gone-Viral-4-1120x728.jpg",
    link: "/drums",
  },
  {
    key: "driving_services",
    defaultTitle: "Driving Services",
    defaultDescription: "Professional drivers for your events",
    defaultImage: "https://tse2.mm.bing.net/th/id/OIP.BekLeG_3xl_3aZb-GfAXOAHaE7?pid=Api&P=0&h=180",
    link: "/driving-services",
  }
];

interface OtherService {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
}

interface CategorySettings {
  [key: string]: { title: string; description: string; image: string };
}

const Services = () => {
  const [otherServices, setOtherServices] = useState<OtherService[]>([]);
  const [categorySettings, setCategorySettings] = useState<CategorySettings>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch category settings from site_settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*")
        .like("setting_key", "category_%");

      if (settingsData) {
        const settings: CategorySettings = {};
        settingsData.forEach((s) => {
          // Parse setting_key like "category_wedding_mandap_title"
          const match = s.setting_key.match(/^category_(.+)_(title|description|image)$/);
          if (match) {
            const [, catKey, field] = match;
            if (!settings[catKey]) {
              settings[catKey] = { title: "", description: "", image: "" };
            }
            settings[catKey][field as "title" | "description" | "image"] = s.setting_value || "";
          }
        });
        setCategorySettings(settings);
      }

      // Fetch services with "Other" category
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

    fetchData();
  }, []);

  const getServiceDisplay = (cat: CategoryConfig) => {
    const custom = categorySettings[cat.key];
    return {
      title: custom?.title || cat.defaultTitle,
      description: custom?.description || cat.defaultDescription,
      image: custom?.image || cat.defaultImage,
      link: cat.link,
    };
  };

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
          {DEFAULT_CATEGORIES.map((cat, index) => {
            const display = getServiceDisplay(cat);
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard
                  title={display.title}
                  description={display.description}
                  image={display.image}
                  link={display.link}
                  buttonText="View Varieties"
                />
              </motion.div>
            );
          })}
          
          {/* Other services from database */}
          {otherServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (DEFAULT_CATEGORIES.length + index) * 0.1 }}
            >
              <ServiceCard
                title={service.name}
                description={service.description || ""}
                image={service.image_url || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400"}
                link={`/service/${encodeURIComponent(service.name)}`}
                buttonText="View Varieties"
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
