import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="h-screen flex main-layout dashboard-background">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-6 dashboard-background">
<<<<<<< HEAD
          <div className="min-h-full">
            {children}
          </div>
=======
          {children}
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
        </main>
      </div>
    </div>
  );
};