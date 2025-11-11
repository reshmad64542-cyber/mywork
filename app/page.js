"use client";
import Carousel from "./components/Carousel";
import ProductGrid from "./components/ProductGrid";
import { useLanguage } from "./context/LanguageContext";
import { useTranslation } from "./lib/translations";

export default function Home() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  // Beautiful high-quality e-commerce banner URLs (free and royalty-free)
  
    const carouselImages = [
  // Modern fashion sale banner
  "https://images.unsplash.com/photo-1618354691321-d9485f6f84b0?auto=format&fit=crop&w=1600&q=80",

  // Electronics & gadgets offer
  "https://images.unsplash.com/photo-1607083206968-13611e3d76f0?auto=format&fit=crop&w=1600&q=80",

  // Home decor collection
  "https://images.unsplash.com/photo-1616627458537-4a08a9d3e1d5?auto=format&fit=crop&w=1600&q=80",

  // Beauty & lifestyle promotion
  "https://images.unsplash.com/photo-1600180758890-6b94519a8ba5?auto=format&fit=crop&w=1600&q=80",

  // Festive sale banner / footwear / accessories
  "https://images.unsplash.com/photo-1607082349566-187342175e2b?auto=format&fit=crop&w=1600&q=80",

  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
      <div className="pt-4 sm:pt-6">
        <Carousel images={carouselImages} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl text-center pb-8">
      </div>
   </div>
  );
}
