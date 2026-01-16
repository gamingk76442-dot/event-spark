import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  backText?: string;
}

const PageHeader = ({ title, subtitle, backLink = "/services", backText = "Back to Services" }: PageHeaderProps) => {
  return (
    <div className="bg-gradient-navbar pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Link 
          to={backLink}
          className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-saffron transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span>{backText}</span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-primary-foreground/80">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PageHeader;
