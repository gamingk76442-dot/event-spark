import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FIXED_CATEGORIES = [
  { value: "Wedding Mandap", label: "Wedding Mandap" },
  { value: "Lighting", label: "Lighting" },
  { value: "Wedding Shop", label: "Wedding Shop" },
  { value: "Drums", label: "Drums" },
  { value: "Driving Services", label: "Driving Services" },
  { value: "Other", label: "Other (Create New Service)" },
];

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
  category: string | null;
  is_active: boolean;
  display_order: number;
}

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
    price: "",
    category: "",
    is_active: true,
    display_order: 0,
  });

  // Get all categories including custom ones (from "Other" services)
  const allCategories = [
    ...FIXED_CATEGORIES.filter(c => c.value !== "Other"),
    ...customCategories.map(name => ({ value: name, label: `${name} (Custom)` })),
    { value: "Other", label: "Other (Create New Service)" },
  ];

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
      
      // Extract custom categories from "Other" services
      const otherServices = (data || []).filter(s => s.category === "Other");
      setCustomCategories(otherServices.map(s => s.name));
    } catch (error: any) {
      toast({
        title: "Error fetching services",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateDialog = () => {
    setForm({
      name: "",
      description: "",
      image_url: "",
      price: "",
      category: "",
      is_active: true,
      display_order: services.length,
    });
    setIsCreating(true);
  };

  const openEditDialog = (service: Service) => {
    setForm({
      name: service.name,
      description: service.description || "",
      image_url: service.image_url || "",
      price: service.price || "",
      category: service.category || "",
      is_active: service.is_active,
      display_order: service.display_order,
    });
    setEditingService(service);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      setForm({ ...form, image_url: publicUrl });
      toast({ title: "Image uploaded", description: "Image has been uploaded successfully." });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setForm({ ...form, image_url: "" });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Service name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isCreating) {
        const { error } = await supabase.from("services").insert({
          name: form.name,
          description: form.description || null,
          image_url: form.image_url || null,
          price: form.price || null,
          category: form.category || null,
          is_active: form.is_active,
          display_order: form.display_order,
        });
        if (error) throw error;
        toast({ title: "Service Created", description: "New service has been added." });
      } else if (editingService) {
        const { error } = await supabase
          .from("services")
          .update({
            name: form.name,
            description: form.description || null,
            image_url: form.image_url || null,
            price: form.price || null,
            category: form.category || null,
            is_active: form.is_active,
            display_order: form.display_order,
          })
          .eq("id", editingService.id);
        if (error) throw error;
        toast({ title: "Service Updated", description: "Service has been updated." });
      }

      setIsCreating(false);
      setEditingService(null);
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error saving service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteService) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", deleteService.id);

      if (error) throw error;

      toast({ title: "Service Deleted", description: "Service has been removed." });
      setDeleteService(null);
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: !service.is_active })
        .eq("id", service.id);

      if (error) throw error;
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error updating service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Services</h2>
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus size={18} />
          Add Service
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No services found. Add your first service!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <GripVertical size={16} className="text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {service.image_url && (
                          <img
                            src={service.image_url}
                            alt={service.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p>{service.name}</p>
                          {service.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{service.category || "-"}</TableCell>
                    <TableCell>{service.price || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.is_active ? "Active" : "Hidden"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(service)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={service.is_active ? "Hide" : "Show"}
                        >
                          {service.is_active ? (
                            <EyeOff size={16} className="text-muted-foreground" />
                          ) : (
                            <Eye size={16} className="text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={() => openEditDialog(service)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={() => setDeleteService(service)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreating || !!editingService}
        onOpenChange={() => {
          setIsCreating(false);
          setEditingService(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Add New Service" : "Edit Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Service name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Service description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category *</label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price</label>
                <Input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g., ₹25,000"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Service Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
              {form.image_url ? (
                <div className="relative inline-block">
                  <img
                    src={form.image_url}
                    alt="Service preview"
                    className="w-32 h-32 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-secondary/50 transition-colors w-full justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Click to upload image</span>
                    </>
                  )}
                </button>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG, WebP or GIF. Max 5MB.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded border-border"
              />
              <label htmlFor="is_active" className="text-sm">Active (visible on website)</label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setEditingService(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isCreating ? "Create Service" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteService} onOpenChange={() => setDeleteService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{deleteService?.name}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteService(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminServices;
