import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Mandap from "./pages/Mandap";
import Lighting from "./pages/Lighting";
import WeddingShop from "./pages/WeddingShop";
import Drums from "./pages/Drums";
import DrivingServices from "./pages/DrivingServices";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/mandap" element={<Mandap />} />
            <Route path="/lighting" element={<Lighting />} />
            <Route path="/wedding-shop" element={<WeddingShop />} />
            <Route path="/drums" element={<Drums />} />
            <Route path="/driving-services" element={<DrivingServices />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
