import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  console.log("🎨 [DashboardLayout] Componente montado");
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      {/* Main content area - adjusted for mobile */}
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        {children}
      </main>
    </div>
  );
}
