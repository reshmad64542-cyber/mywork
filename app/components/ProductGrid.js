"use client";
import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../lib/translations";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const [selectedVariants, setSelectedVariants] = useState({});
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  useEffect(() => {
    fetch(`/api/products?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setModal({
            isOpen: true,
            title: 'Error Loading Products',
            message: data.error,
            type: 'error'
          });
        } else {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setModal({
          isOpen: true,
          title: 'Connection Error',
          message: 'Unable to load products. Please check your internet connection.',
          type: 'error'
        });
        setLoading(false);
      });
  }, [language]);

  const handleVariantChange = (productId, type, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {[1,2,3].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl h-80 sm:h-96 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('products')}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {products.map((product) => {
          const selectedVariant = selectedVariants[product.id] || {};
          return (
            <div key={product.id} className="group bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md hover:shadow-lg sm:hover:shadow-xl lg:hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <div className="text-3xl sm:text-4xl lg:text-6xl opacity-30">
                    {product.category === 'Groceries' ? '🌾' : 
                     product.category === 'Clothing' ? '👕' :
                     product.category === 'Kitchen' ? '🍳' :
                     product.category === 'Beauty' ? '💄' :
                     product.category === 'Sports' ? '🏏' : '☕'}
                  </div>
                </div>
                <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                  {product.discount}% OFF
                </div>
              </div>
              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
                
                {/* Variant Selection */}
                {product.sizes && product.sizes.length > 1 && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">{t('size')}:</label>
                    <select 
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                      value={selectedVariant.size || product.sizes[0]}
                      onChange={(e) => handleVariantChange(product.id, 'size', e.target.value)}
                    >
                      {product.sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {product.colors && product.colors.length > 1 && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">{t('color')}:</label>
                    <div className="flex space-x-1">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => handleVariantChange(product.id, 'color', color)}
                          className={`w-6 h-6 rounded-full border-2 ${
                            selectedVariant.color === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl sm:text-2xl font-bold text-green-600">{product.formattedPrice}</span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through">{product.formattedOriginalPrice}</span>
                  </div>
                  <button className="bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto">
                    🛒 {t('addToCart')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}