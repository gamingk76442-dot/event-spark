import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  price?: string;
  link: string;
  buttonText?: string;
}

const ServiceCard = ({ 
  title, 
  description, 
  image, 
  price, 
  link, 
  buttonText = "View Details" 
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-gradient-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        
        {price && (
          <p className="text-accent font-bold text-lg mb-4">{price}</p>
        )}
        
        <Link
          to={link}
          className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          {buttonText}
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
