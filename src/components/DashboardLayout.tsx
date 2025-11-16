import React, { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  console.log("🎨 [DashboardLayout] Componente montado con nuevo Navbar");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar reemplaza al Sidebar */}
      <Navbar />

      {/* Main Content - Sin conflictos con navbar fijo */}
      <main className="w-full min-h-screen pt-0">
        {children}
      </main>
    </div>
  );
}
