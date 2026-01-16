import { Phone, MapPin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="bg-maroon text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://tse1.mm.bing.net/th/id/OIP.2g2wAghD2LpXjoJC0461FwHaHa?pid=Api&P=0&h=180" 
                alt="Anjineya Service Logo" 
                className="w-12 h-12 rounded-full object-cover border-2 border-saffron"
              />
              <span className="text-xl font-serif font-bold">Anjineya Service</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Premium wedding and event solutions for your special occasions. 
              Making your celebrations memorable since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                Home
              </Link>
              <Link to="/services" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                Services
              </Link>
              <Link to="/mandap" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                Wedding Mandap
              </Link>
              <Link to="/lighting" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                Lighting
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a 
                href="tel:9876543210" 
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-saffron transition-colors"
              >
                <Phone size={18} />
                <span>9876543210</span>
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin size={18} />
                <span>Erode, Tamil Nadu</span>
              </div>
              <a 
                href="https://instagram.com/anjineya_service" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-saffron transition-colors"
              >
                <Instagram size={18} />
                <span>@anjineya_service</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>© 2024 Anjineya Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
