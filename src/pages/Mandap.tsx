import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import PageHeader from "@/components/PageHeader";

const mandapVarieties = [
  {
    title: "Traditional Mandap",
    description: "Classic wooden mandap with beautiful floral décor",
    image: "https://i.pinimg.com/originals/66/c9/34/66c934ac7feb88115ac1fad19b79311b.jpg",
    price: "₹25,000",
    link: "/booking?service=Traditional%20Mandap",
    buttonText: "Book Now"
  },
  {
    title: "Modern Mandap",
    description: "LED based modern wedding mandap with contemporary design",
    image: "https://tse1.mm.bing.net/th/id/OIP.pvBhvHWiXFoQCJz_XisZ1gHaHa?pid=Api&P=0&h=180",
    price: "₹35,000",
    link: "/booking?service=Modern%20Mandap",
    buttonText: "Book Now"
  },
  {
    title: "Royal Mandap",
    description: "Premium royal style grand mandap for luxury weddings",
    image: "https://i.pinimg.com/originals/3d/a4/23/3da42361d3cf2f7f3655e83ce3cbdcdf.jpg",
    price: "₹50,000",
    link: "/booking?service=Royal%20Mandap",
    buttonText: "Book Now"
  }
];

const Mandap = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <PageHeader 
        title="Wedding Mandap Varieties" 
        subtitle="Choose from our exquisite collection of mandap designs"
      />

      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mandapVarieties.map((mandap) => (
            <ServiceCard key={mandap.title} {...mandap} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Mandap;
