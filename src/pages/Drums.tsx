import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";

interface ServiceVariety {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
}

const Drums = () => {
  const [varieties, setVarieties] = useState<ServiceVariety[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVarieties = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("category", "Drums")
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setVarieties(data);
      }
      setIsLoading(false);
    };

    fetchVarieties();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <PageHeader 
        title="Traditional & Wedding Drums" 
        subtitle="Professional drum performances for ceremonies and celebrations"
      />

      <div className="container mx-auto px-4 py-16 flex-1">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : varieties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {varieties.map((variety, index) => (
              <motion.div
                key={variety.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard
                  title={variety.name}
                  description={variety.description || ""}
                  image={variety.image_url || "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400"}
                  price={variety.price || undefined}
                  link={`/booking?service=${encodeURIComponent(variety.name)}`}
                  buttonText="Book Now"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No varieties available at the moment. Please check back later.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Drums;
