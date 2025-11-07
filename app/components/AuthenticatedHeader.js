"use client";
import { useState } from "react";
import Link from "next/link";
import { getUser, logout } from "../lib/auth";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../lib/translations";
import LanguageSelector from "./LanguageSelector";

export default function AuthenticatedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = getUser();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation(language);

  if (!user) return null;

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ShopSphere
          </Link>

          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base">{t('dashboard')}</Link>
            <Link href="/analytics" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base">Analytics</Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base">{t('products')}</Link>
            <Link href="/orders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base">Orders</Link>
            <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative text-sm lg:text-base">
              {t('cart')}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center text-xs">0</span>
            </Link>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <LanguageSelector onLanguageChange={changeLanguage} currentLang={language} />
              <span className="text-gray-700 font-medium text-sm lg:text-base">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm lg:text-base"
              >
                {t('logout')}
              </button>
            </div>
          </nav>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2 sm:space-y-3 pt-3 sm:pt-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1">{t('dashboard')}</Link>
              <Link href="/analytics" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1">Analytics</Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1">{t('products')}</Link>
              <Link href="/orders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1">Orders</Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-1">{t('cart')} (0)</Link>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-2">Logged in as {user.name}</p>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-center w-full"
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}