
import React, { useState } from 'react';
import { AppTab } from './types';
import { LanguageProvider, useTranslation } from './LanguageContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeView from './views/HomeView';
import MarketingView from './views/MarketingView';
import OrdersView from './views/OrdersView';
import TechSpecView from './views/TechSpecView';
// import ProtocolsView from './views/ProtocolsView'; // Удалено
import ProcurementPlanView from './views/ProcurementPlanView';
import SuppliersDBView from './views/SuppliersDBView';
import EnsTruView from './views/EnsTruView';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Home);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.Home: return <HomeView />;
      case AppTab.Marketing: return <MarketingView />;
      case AppTab.Orders: return <OrdersView />;
      case AppTab.TechnicalSpec: return <TechSpecView />;
      // case AppTab.Protocols: return <ProtocolsView />; // Удалено
      case AppTab.ProcurementPlan: return <ProcurementPlanView />;
      case AppTab.SuppliersDB: return <SuppliersDBView />;
      case AppTab.EnsTru: return <EnsTruView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-20'}`}>
        <Header activeTab={activeTab} />
        <main className="p-8">
          <div className="animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
