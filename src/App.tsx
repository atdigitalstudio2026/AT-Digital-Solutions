import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuroraBackground } from './components/AuroraBackground';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { InteractiveDemoModal } from './components/InteractiveDemoModal';
import { DownloadModal } from './components/DownloadModal';
import { WhatsAppChatWidget } from './components/WhatsAppChatWidget';

// Views
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { DetailView } from './views/DetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { SuccessView } from './views/SuccessView';
import { DashboardView } from './views/DashboardView';
import { AuthView } from './views/AuthView';

const MainContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderCurrentView = () => {
    switch (currentRoute.name) {
      case 'home':
        return <HomeView />;
      case 'catalog':
        return <CatalogView />;
      case 'detail':
        return <DetailView productId={currentRoute.productId} />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'success':
        return <SuccessView orderId={currentRoute.orderId} />;
      case 'dashboard':
        return <DashboardView />;
      case 'auth':
        return <AuthView initialMode={currentRoute.mode} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between z-10">
      <Navbar />
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>
      <Footer />

      {/* Global Interactive Overlays */}
      <InteractiveDemoModal />
      <DownloadModal />
      <WhatsAppChatWidget />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="relative min-h-screen bg-[#07070c] text-[#edecf6] overflow-x-hidden selection:bg-[#7c5cff] selection:text-white">
        <AuroraBackground />
        <MainContent />
      </div>
    </AppProvider>
  );
}
