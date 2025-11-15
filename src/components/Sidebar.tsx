import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  LogOut,
  Wallet,
  FolderKanban,
  User,
  Tag,
  ArrowRightLeft,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { authApi } from "../lib/api";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Calendario", path: "/calendar" },
  { icon: ArrowRightLeft, label: "Transacciones", path: "/transactions" },
  { icon: FolderKanban, label: "Categorías", path: "/categories" },
  { icon: Wallet, label: "Cuentas", path: "/accounts" },
  { icon: Tag, label: "Etiquetas", path: "/tags" },
  { icon: BarChart3, label: "Estadísticas", path: "/statistics" },
  { icon: TrendingUp, label: "Reportes", path: "/reports" },
  { icon: User, label: "Gestión de Cuenta", path: "/profile" },
];

interface UserProfile {
  id: number;
  email: string;
  nickname: string;
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log("📱 [Sidebar] Componente montado, ruta actual:", location.pathname);

  useEffect(() => {
    const loadUserProfile = async () => {
      console.log("👤 [Sidebar] Cargando perfil de usuario");
      try {
        const response = await authApi.getProfile();
        console.log("✅ [Sidebar] Perfil cargado:", response.user.nickname);
        setUser(response.user);
      } catch (error) {
        console.error("❌ [Sidebar] Error al cargar perfil:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    console.log("🚪 [Sidebar] Cerrando sesión");
    try {
      await authApi.logout();
      console.log("✅ [Sidebar] Sesión cerrada exitosamente");
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("❌ [Sidebar] Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  const handleMenuItemClick = (path: string, label: string) => {
    console.log(`🔗 [Sidebar] Navegando a: ${path} (${label})`);
    setIsMobileMenuOpen(false);
  };

  const getInitials = (nickname: string) => {
    return nickname
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => {
          console.log("🍔 [Sidebar] Toggle menú móvil:", !isMobileMenuOpen);
          setIsMobileMenuOpen(!isMobileMenuOpen);
        }}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center border border-slate-200"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-slate-700" />
        ) : (
          <Menu className="w-6 h-6 text-slate-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            console.log("📱 [Sidebar] Cerrando menú por overlay");
            setIsMobileMenuOpen(false);
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={() => console.log("🏠 [Sidebar] Navegando a dashboard desde logo")}>
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
              onClick={() => handleMenuItemClick(item.path, item.label)}
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
        {isLoading ? (
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold">
              {getInitials(user.nickname)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-900 truncate">
                {user.nickname}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {user.email}
              </div>
            </div>
          </div>
        ) : null}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-600"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
    </>
  );
}
