import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Trash2, 
  Edit, 
  Filter,
  RefreshCw,
  FileText
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import BookingDetailsCard from "./BookingDetailsCard";

interface Booking {
  id: string;
  service_name: string;
  customer_name: string;
  mobile: string;
  event_date: string;
  event_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const AdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deleteBooking, setDeleteBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState({
    status: "",
    notes: "",
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setEditForm({
      status: booking.status,
      notes: booking.notes || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: editForm.status,
          notes: editForm.notes,
        })
        .eq("id", editingBooking.id);

      if (error) throw error;

      toast({
        title: "Booking Updated",
        description: "The booking has been updated successfully.",
      });

      setEditingBooking(null);
      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteBooking) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", deleteBooking.id);

      if (error) throw error;

      toast({
        title: "Booking Deleted",
        description: "The booking has been deleted successfully.",
      });

      setDeleteBooking(null);
      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error deleting booking",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Bookings", value: bookings.length, color: "bg-primary" },
          { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "bg-yellow-500" },
          { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "bg-green-500" },
          { label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "bg-blue-500" },
        ].map((stat, index) => (
          <div key={index} className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Status:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "cancelled", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={fetchBookings}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.service_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-muted-foreground" />
                        {booking.customer_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-muted-foreground" />
                        {booking.mobile}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-muted-foreground" />
                          {new Date(booking.event_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-muted-foreground" />
                          {booking.event_time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-800"}`}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <BookingDetailsCard notes={booking.notes} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={() => setDeleteBooking(booking)}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-4 py-3 bg-background rounded-xl border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes..."
                className="w-full px-4 py-3 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBooking(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteBooking} onOpenChange={() => setDeleteBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground">
            Are you sure you want to delete this booking for{" "}
            <span className="font-semibold text-foreground">{deleteBooking?.customer_name}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBooking(null)}>
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

export default AdminBookings;
