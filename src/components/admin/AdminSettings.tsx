import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
}

const settingLabels: Record<string, { label: string; type: "text" | "textarea" | "tel" | "email"; description?: string }> = {
  site_title: { label: "Website Title", type: "text" },
  contact_phone: { label: "Contact Phone", type: "tel" },
  contact_email: { label: "Contact Email", type: "email" },
  contact_address: { label: "Business Address", type: "textarea" },
  whatsapp_number: { label: "WhatsApp Number", type: "tel" },
  about_text: { label: "About Section Text", type: "textarea" },
  notification_email: { label: "Notification Email", type: "email", description: "Email address to receive booking notifications" },
  notification_whatsapp: { label: "Notification WhatsApp", type: "tel", description: "WhatsApp number to receive booking alerts (with country code, e.g., 919876543210)" },
};

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("setting_key");

      if (error) throw error;
      setSettings(data || []);
      
      const initialData: Record<string, string> = {};
      data?.forEach((setting) => {
        initialData[setting.setting_key] = setting.setting_value || "";
      });
      setFormData(initialData);
    } catch (error: any) {
      toast({
        title: "Error fetching settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(formData).map(([key, value]) =>
        supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", key)
      );

      await Promise.all(updates);

      toast({
        title: "Settings Saved",
        description: "All settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Website Settings</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSettings} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <Save size={16} />
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="grid gap-6">
          {settings.map((setting) => {
            const config = settingLabels[setting.setting_key] || {
              label: setting.setting_key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
              type: "text" as const,
            };

            return (
              <div key={setting.id}>
                <label className="text-sm font-medium mb-2 block">
                  {config.label}
                </label>
                {setting.description && (
                  <p className="text-xs text-muted-foreground mb-2">{setting.description}</p>
                )}
                {config.type === "textarea" ? (
                  <Textarea
                    value={formData[setting.setting_key] || ""}
                    onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                    placeholder={`Enter ${config.label.toLowerCase()}`}
                    rows={3}
                  />
                ) : (
                  <Input
                    type={config.type}
                    value={formData[setting.setting_key] || ""}
                    onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                    placeholder={`Enter ${config.label.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {settings.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No settings found. Settings will appear here once configured.
          </p>
        )}
      </div>
    </>
  );
};

export default AdminSettings;
