import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/services#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHome ? "bg-transparent" : "bg-gradient-navbar shadow-lg"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="https://tse1.mm.bing.net/th/id/OIP.2g2wAghD2LpXjoJC0461FwHaHa?pid=Api&P=0&h=180" 
              alt="Anjineya Service Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-saffron"
            />
            <span className="text-lg md:text-xl font-serif font-bold text-primary-foreground">
              Anjaneya Service
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-primary-foreground/90 hover:text-saffron transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/services"
              className="px-6 py-2 bg-gradient-accent text-accent-foreground rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Book Now
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 text-primary-foreground/90 hover:text-saffron transition-colors font-medium"
              >
                <Settings size={18} />
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-primary-foreground/90 hover:text-saffron transition-colors font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 text-primary-foreground/90 hover:text-saffron transition-colors font-medium"
              >
                <User size={18} />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary-foreground p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gradient-navbar border-t border-primary-foreground/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground/90 hover:text-saffron transition-colors font-medium py-2"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/services"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gradient-accent text-accent-foreground rounded-full font-semibold text-center"
              >
                Book Now
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-primary-foreground/90 hover:text-saffron transition-colors font-medium border border-primary-foreground/20 rounded-full"
                >
                  <Settings size={18} />
                  Admin Panel
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-primary-foreground/90 hover:text-saffron transition-colors font-medium border border-primary-foreground/20 rounded-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-primary-foreground/90 hover:text-saffron transition-colors font-medium border border-primary-foreground/20 rounded-full"
                >
                  <User size={18} />
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
