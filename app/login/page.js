"use client";
import { useState } from "react";
import Link from "next/link";
import Modal from "../components/ui/Modal";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../lib/translations";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('token', data.token);
        
        // Force page reload to update auth state
        window.location.href = '/dashboard';
       
      } else {
        setModal({
          isOpen: true,
          title: 'Login Failed',
          message: data.message || 'Invalid credentials',
          type: 'error'
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        title: 'Connection Error',
        message: 'Unable to connect to server. Please check your internet connection.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-4 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{t('welcomeBack')}</h2>
          <p className="text-sm sm:text-base text-gray-600">{t('signInAccount')}</p>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('email')}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('password')}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600">
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                {t('forgotPassword')}
              </Link>
            </p>
            <p className="text-gray-600">
              {t('dontHaveAccount')}{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
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