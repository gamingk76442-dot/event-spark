import { useState, useEffect, useRef } from "react";
import { Edit, Save, X, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryConfig {
  key: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
}

const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    key: "wedding_mandap",
    defaultTitle: "Wedding Mandap",
    defaultDescription: "Beautiful mandap setups for traditional and modern weddings",
    defaultImage: "https://i.pinimg.com/originals/59/0c/da/590cda3575908c87e1f14804ae46e155.jpg",
  },
  {
    key: "lighting",
    defaultTitle: "Lighting",
    defaultDescription: "Professional decorative lighting for all occasions",
    defaultImage: "https://tse2.mm.bing.net/th/id/OIP.yTLhRdw3xUgVkU82r98kwAHaEn?pid=Api&P=0&h=180",
  },
  {
    key: "wedding_shop",
    defaultTitle: "Wedding Shop",
    defaultDescription: "Garlands, decorations & wedding accessories",
    defaultImage: "https://tse2.mm.bing.net/th?id=OIF.9bdzH5sI%2fOHHuOQR9qMWOQ&pid=Api&P=0&h=180",
  },
  {
    key: "drums",
    defaultTitle: "Drums",
    defaultDescription: "Traditional & wedding drums for ceremonies",
    defaultImage: "https://tastysnack.in/wp-content/uploads/2022/12/Kerala-Bride-Played-Drum-During-Wedding-Gone-Viral-4-1120x728.jpg",
  },
  {
    key: "driving_services",
    defaultTitle: "Driving Services",
    defaultDescription: "Professional drivers for your events",
    defaultImage: "https://tse2.mm.bing.net/th/id/OIP.BekLeG_3xl_3aZb-GfAXOAHaE7?pid=Api&P=0&h=180",
  },
];

interface CategoryData {
  title: string;
  description: string;
  image: string;
}

const AdminCategories = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [categories, setCategories] = useState<{ [key: string]: CategoryData }>({});
  const [editForm, setEditForm] = useState<CategoryData>({ title: "", description: "", image: "" });

  useEffect(() => {
    fetchCategorySettings();
  }, []);

  const fetchCategorySettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .like("setting_key", "category_%");

      if (error) throw error;

      const catData: { [key: string]: CategoryData } = {};
      DEFAULT_CATEGORIES.forEach((cat) => {
        catData[cat.key] = {
          title: cat.defaultTitle,
          description: cat.defaultDescription,
          image: cat.defaultImage,
        };
      });

      if (data) {
        data.forEach((s) => {
          const match = s.setting_key.match(/^category_(.+)_(title|description|image)$/);
          if (match) {
            const [, catKey, field] = match;
            if (catData[catKey]) {
              catData[catKey][field as keyof CategoryData] = s.setting_value || catData[catKey][field as keyof CategoryData];
            }
          }
        });
      }

      setCategories(catData);
    } catch (error: any) {
      toast({
        title: "Error loading categories",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (key: string) => {
    setEditingCategory(key);
    setEditForm({ ...categories[key] });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditForm({ title: "", description: "", image: "" });
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(key);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      setEditForm({ ...editForm, image: publicUrl });
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(null);
      if (fileInputRefs.current[key]) fileInputRefs.current[key]!.value = '';
    }
  };

  const saveCategory = async (key: string) => {
    setSaving(key);
    try {
      const settingsToUpsert = [
        { setting_key: `category_${key}_title`, setting_value: editForm.title, description: `Title for ${key} category` },
        { setting_key: `category_${key}_description`, setting_value: editForm.description, description: `Description for ${key} category` },
        { setting_key: `category_${key}_image`, setting_value: editForm.image, description: `Image for ${key} category` },
      ];

      for (const setting of settingsToUpsert) {
        const { data: existing } = await supabase
          .from("site_settings")
          .select("id")
          .eq("setting_key", setting.setting_key)
          .single();

        if (existing) {
          const { error } = await supabase
            .from("site_settings")
            .update({ setting_value: setting.setting_value })
            .eq("setting_key", setting.setting_key);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("site_settings")
            .insert(setting);
          if (error) throw error;
        }
      }

      setCategories({ ...categories, [key]: editForm });
      setEditingCategory(null);
      toast({ title: "Category updated", description: "The category has been updated successfully." });
    } catch (error: any) {
      toast({
        title: "Error saving category",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const resetToDefault = async (key: string) => {
    const defaultCat = DEFAULT_CATEGORIES.find((c) => c.key === key);
    if (!defaultCat) return;

    setSaving(key);
    try {
      const keysToDelete = [
        `category_${key}_title`,
        `category_${key}_description`,
        `category_${key}_image`,
      ];

      for (const settingKey of keysToDelete) {
        await supabase
          .from("site_settings")
          .delete()
          .eq("setting_key", settingKey);
      }

      setCategories({
        ...categories,
        [key]: {
          title: defaultCat.defaultTitle,
          description: defaultCat.defaultDescription,
          image: defaultCat.defaultImage,
        },
      });
      setEditingCategory(null);
      toast({ title: "Category reset", description: "The category has been reset to default." });
    } catch (error: any) {
      toast({
        title: "Error resetting category",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Service Categories</h2>
        <p className="text-sm text-muted-foreground">
          Customize the main service category names and images displayed on the website
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {DEFAULT_CATEGORIES.map((defaultCat) => {
          const cat = categories[defaultCat.key];
          const isEditing = editingCategory === defaultCat.key;
          const isSaving = saving === defaultCat.key;
          const isUploading = uploading === defaultCat.key;

          return (
            <Card key={defaultCat.key} className={isEditing ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  {isEditing ? (
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="text-lg font-semibold"
                      placeholder="Category title"
                    />
                  ) : (
                    <span>{cat?.title || defaultCat.defaultTitle}</span>
                  )}
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(defaultCat.key)}
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Category description"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Image</label>
                      <input
                        ref={(el) => (fileInputRefs.current[defaultCat.key] = el)}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => handleImageUpload(defaultCat.key, e)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-4">
                        <img
                          src={editForm.image}
                          alt={editForm.title}
                          className="w-20 h-20 object-cover rounded-lg border border-border"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[defaultCat.key]?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 size={16} className="animate-spin mr-2" />
                          ) : (
                            <Upload size={16} className="mr-2" />
                          )}
                          Upload New
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => saveCategory(defaultCat.key)}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                        disabled={isSaving}
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resetToDefault(defaultCat.key)}
                        disabled={isSaving}
                        className="ml-auto text-muted-foreground"
                      >
                        Reset to Default
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">{cat?.description || defaultCat.defaultDescription}</p>
                    <img
                      src={cat?.image || defaultCat.defaultImage}
                      alt={cat?.title || defaultCat.defaultTitle}
                      className="w-full h-32 object-cover rounded-lg border border-border"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCategories;
