import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import PageHeader from "@/components/PageHeader";

const lightingVarieties = [
  {
    title: "LED Decoration",
    description: "Colorful LED lighting for events and celebrations",
    image: "https://tse1.mm.bing.net/th/id/OIP.3ZkZzIw1heMW9_4FuWNebAHaEz?pid=Api&P=0&h=180",
    price: "₹15,000",
    link: "/booking?service=LED%20Decoration",
    buttonText: "Book Now"
  },
  {
    title: "Stage Lighting",
    description: "Professional stage lighting setup for performances",
    image: "https://tse4.mm.bing.net/th/id/OIP.UO-6T69FjZcIVGQsJadkaQHaHa?pid=Api&P=0&h=180",
    price: "₹20,000",
    link: "/booking?service=Stage%20Lighting",
    buttonText: "Book Now"
  },
  {
    title: "Premium Wedding Lights",
    description: "Luxury lighting solutions for grand weddings",
    image: "https://tse4.mm.bing.net/th/id/OIP.2Zgz5AEF7Pb5Au-WU_FB4wHaHa?pid=Api&P=0&h=180",
    price: "₹30,000",
    link: "/booking?service=Premium%20Wedding%20Lights",
    buttonText: "Book Now"
  }
];

const Lighting = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <PageHeader 
        title="Lighting Varieties" 
        subtitle="Professional lighting solutions for every occasion"
      />

      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lightingVarieties.map((lighting) => (
            <ServiceCard key={lighting.title} {...lighting} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Lighting;
