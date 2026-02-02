import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, MessageCircle, Instagram, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

interface ContactSettings {
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  whatsapp_number: string;
}

interface ContactSheetProps {
  children: React.ReactNode;
}

const ContactSheet = ({ children }: ContactSheetProps) => {
  const [settings, setSettings] = useState<ContactSettings>({
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    whatsapp_number: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("setting_key, setting_value")
          .in("setting_key", ["contact_phone", "contact_email", "contact_address", "whatsapp_number"]);

        if (error) throw error;

        const settingsMap: Partial<ContactSettings> = {};
        data?.forEach((item) => {
          settingsMap[item.setting_key as keyof ContactSettings] = item.setting_value || "";
        });

        setSettings({
          contact_phone: settingsMap.contact_phone || "",
          contact_email: settingsMap.contact_email || "",
          contact_address: settingsMap.contact_address || "",
          whatsapp_number: settingsMap.whatsapp_number || "",
        });
      } catch (error) {
        console.error("Error fetching contact settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    if (settings.whatsapp_number) {
      const cleanNumber = settings.whatsapp_number.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-gradient-to-b from-maroon to-maroon/95 border-saffron/20">
        <SheetHeader>
          <SheetTitle className="text-primary-foreground font-serif text-2xl flex items-center gap-3">
            <img 
              src="https://tse1.mm.bing.net/th/id/OIP.2g2wAghD2LpXjoJC0461FwHaHa?pid=Api&P=0&h=180" 
              alt="Anjineya Service Logo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-saffron"
            />
            Contact Us
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {settings.contact_phone && (
              <a 
                href={`tel:${settings.contact_phone}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-saffron/20 flex items-center justify-center group-hover:bg-saffron/30 transition-colors">
                  <Phone className="w-6 h-6 text-saffron" />
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-sm">Phone</p>
                  <p className="text-primary-foreground font-medium text-lg">{settings.contact_phone}</p>
                </div>
              </a>
            )}

            {settings.whatsapp_number && (
              <button 
                onClick={handleWhatsAppClick}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-green-600/20 hover:bg-green-600/30 transition-colors group text-left"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-sm">WhatsApp</p>
                  <p className="text-primary-foreground font-medium text-lg">{settings.whatsapp_number}</p>
                </div>
              </button>
            )}

            {settings.contact_email && (
              <a 
                href={`mailto:${settings.contact_email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-saffron/20 flex items-center justify-center group-hover:bg-saffron/30 transition-colors">
                  <Mail className="w-6 h-6 text-saffron" />
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-sm">Email</p>
                  <p className="text-primary-foreground font-medium text-lg break-all">{settings.contact_email}</p>
                </div>
              </a>
            )}

            {settings.contact_address && (
              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary-foreground/10">
                <div className="w-12 h-12 rounded-full bg-saffron/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-saffron" />
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-sm">Address</p>
                  <p className="text-primary-foreground font-medium whitespace-pre-line">{settings.contact_address}</p>
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="pt-4 border-t border-primary-foreground/10">
              <p className="text-primary-foreground/60 text-sm mb-3">Follow Us</p>
              <a 
                href="https://instagram.com/anjineya_service" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
                <span className="text-primary-foreground">@anjineya_service</span>
              </a>
            </div>

            {!settings.contact_phone && !settings.contact_email && !settings.contact_address && !settings.whatsapp_number && (
              <div className="text-center py-8 text-primary-foreground/60">
                <p>Contact details not configured yet.</p>
                <p className="text-sm mt-2">Please check back later.</p>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ContactSheet;
