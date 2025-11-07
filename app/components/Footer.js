"use client";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../lib/translations";

export default function Footer() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  return (
    <footer className="bg-gray-900 text-white py-2 sm:py-2 lg:py-2">
      <div className="container mx-auto px-4 sm:px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-2 sm:mb-2">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4">ShopSphere</h3>
            <p className="text-gray-400 text-sm sm:text-base">Your premium online shopping destination</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('quickLinks')}</h4>
            <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm">
              <p>{t('aboutUs')}</p>
              <p>{t('contact')}</p>
              <p>{t('faq')}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('categories')}</h4>
            <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm">
              <p>Electronics</p>
              <p>Clothing</p>
              <p>Home & Garden</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('support')}</h4>
            <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm">
              <p>{t('helpCenter')}</p>
              <p>{t('returns')}</p>
              <p>{t('shipping')}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-2 sm:pt-2 text-center text-gray-400">
          <p className="text-sm">&copy; 2024 ShopSphere. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
}