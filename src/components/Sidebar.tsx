import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, TrendingUp, Settings, LogOut, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Calendario", path: "/calendar" },
  { icon: TrendingUp, label: "Reportes", path: "/reports" },
  { icon: Settings, label: "Configuración", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-slate-900">FinanzasApp</div>
            <div className="text-xs text-slate-500">Panel de control</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white">
            JP
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-900 truncate">Juan Pérez</div>
            <div className="text-xs text-slate-500 truncate">juan@email.com</div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
