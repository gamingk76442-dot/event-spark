import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Heart, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] border border-saffron/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] border border-saffron/20 rounded-full"
          />
          
          {/* Floating Icons */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 text-saffron/30"
          >
            <Sparkles size={48} />
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-1/3 right-1/4 text-saffron/30"
          >
            <Heart size={40} />
          </motion.div>
          <motion.div
            animate={{ y: [-8, 12, -8] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute top-1/3 right-1/3 text-saffron/20"
          >
            <Star size={36} />
          </motion.div>
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img
              src="https://tse1.mm.bing.net/th/id/OIP.2g2wAghD2LpXjoJC0461FwHaHa?pid=Api&P=0&h=180"
              alt="Anjineya Service Logo"
              className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full object-cover border-4 border-saffron shadow-2xl animate-float"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground mb-4"
          >
            Anjaneya Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-primary-foreground/80 mb-8 font-light"
          >
            Wedding & Event Solutions
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-primary-foreground/70 max-w-xl mx-auto mb-10 text-sm md:text-base"
          >
            Creating magical moments for your special day with premium mandaps, 
            stunning lighting, and complete event solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/services"
              className="px-8 py-4 bg-gradient-accent text-accent-foreground rounded-full font-semibold text-lg hover:opacity-90 transition-all shadow-xl animate-glow"
            >
              Explore Services
            </Link>
            <a
              href="tel:9876543210"
              className="px-8 py-4 border-2 border-primary-foreground/50 text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary-foreground/10 transition-all"
            >
              Call Us Now
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-saffron rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Why Choose Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With years of experience in wedding and event services, we bring your dreams to life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎪",
                title: "Premium Mandaps",
                description: "Exquisite traditional and modern mandap designs for your wedding ceremony."
              },
              {
                icon: "✨",
                title: "Stunning Lighting",
                description: "Professional LED and decorative lighting to create the perfect ambiance."
              },
              {
                icon: "🥁",
                title: "Complete Solutions",
                description: "From drums to driving services, we handle all your event needs."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-border"
              >
                <span className="text-5xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/services"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              View All Services
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
