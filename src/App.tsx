/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { SubNav } from './components/SubNav';
import { HeroBanner } from './components/HeroBanner';
import { HomeFeed } from './components/HomeFeed';
import { SearchAndFilterView } from './components/SearchAndFilterView';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersHistoryModal } from './components/OrdersHistoryModal';
import { AdminPanel } from './components/AdminPanel';
import { SideNavDrawer } from './components/SideNavDrawer';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { CheckCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, toastMessage } = useShop();

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col font-sans text-gray-900 antialiased selection:bg-amber-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131921] text-white px-4 py-3 rounded-lg shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Navigation */}
      <Header />
      <SubNav />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeView === 'home' && (
          <div className="space-y-0">
            <HeroBanner />
            <HomeFeed />
          </div>
        )}

        {activeView === 'search' && <SearchAndFilterView />}

        {activeView === 'product_detail' && <ProductDetailPage />}

        {activeView === 'cart' && <CartPage />}

        {activeView === 'checkout' && <CheckoutModal />}

        {activeView === 'orders' && <OrdersHistoryModal />}

        {activeView === 'admin' && <AdminPanel />}
      </main>

      {/* Modals & Overlays */}
      <SideNavDrawer />
      <LocationModal />
      <AuthModal />


      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
