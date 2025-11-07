"use client";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "../../lib/translations";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/Sidebar";

export default function CustomerBehavior() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Customer Behavior Analytics</h1>
              <p className="text-gray-600 mt-2">Analyze customer interactions and purchase patterns</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Purchase Frequency Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Frequency</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">2.4</p>
                    <p className="text-sm text-gray-500">orders per month</p>
                  </div>
                  <div className="text-green-500 text-sm">↑ 12% increase</div>
                </div>
              </div>

              {/* Average Session Duration */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Avg. Session Duration</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-600">5:32</p>
                    <p className="text-sm text-gray-500">minutes</p>
                  </div>
                  <div className="text-green-500 text-sm">↑ 8% increase</div>
                </div>
              </div>

              {/* Cart Abandonment */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Abandonment</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-red-600">23%</p>
                    <p className="text-sm text-gray-500">rate</p>
                  </div>
                  <div className="text-green-500 text-sm">↓ 5% decrease</div>
                </div>
              </div>
            </div>

            {/* More detailed analytics would go here */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}