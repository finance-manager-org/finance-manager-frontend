import React, { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  console.log("🎨 [DashboardLayout] Componente montado con nuevo Navbar");

  return (
    <>
      {/* Navbar fixed en la parte superior */}
      <Navbar />
      
      {/* Espaciador para el navbar fijo */}
      <div className="pt-16">
        {/* Main Content */}
        <main className="min-h-screen bg-slate-50">
          {children}
        </main>
      </div>
    </>
  );
}
