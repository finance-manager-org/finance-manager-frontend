import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
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
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authApi } from "../lib/api";
import { toast } from "../utils/toast";

const dashboardMenuItems = [
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

/**
 * Navbar component - Doble función:
 * 1. Landing page: barra simple con login/register
 * 2. Dashboard: navbar completo con menú hamburguesa y perfil de usuario
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  console.log(
    "🧭 [Navbar] Ruta actual:",
    location.pathname,
    "Auth:",
    isAuthenticated
  );

  // Determinar si estamos en dashboard o landing
  const isDashboardRoute = [
    "/dashboard",
    "/calendar",
    "/transactions",
    "/categories",
    "/accounts",
    "/tags",
    "/statistics",
    "/reports",
    "/profile",
  ].includes(location.pathname);

  const isLandingRoute = [
    "/",
    "/login",
    "/register",
    "/signup",
    "/articles",
  ].includes(location.pathname);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    console.log("👤 [Navbar] Verificando autenticación");
    try {
      const response = await authApi.getProfile();
      setUser(response.user);
      setIsAuthenticated(true);
      console.log("✅ [Navbar] Usuario autenticado:", response.user.nickname);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      console.log("❌ [Navbar] Usuario no autenticado");
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMenuOpen && isDashboardRoute) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isDashboardRoute]);

  const handleLogout = async () => {
    console.log("🚪 [Navbar] Cerrando sesión");
    try {
      await authApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Sesión cerrada correctamente");
      console.log("✅ [Navbar] Sesión cerrada exitosamente");
      navigate("/");
    } catch (error) {
      console.error("❌ [Navbar] Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  const getInitials = (nickname: string) => {
    return nickname
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleMenuItemClick = () => {
    console.log("📱 [Navbar] Cerrando menú móvil");
    setIsMenuOpen(false);
  };

  // DASHBOARD NAVBAR
  if (isDashboardRoute && isAuthenticated) {
    return (
      <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-slate-200 shadow-sm z-50">
        <div className="max-w-full mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {/* Cargamos el favicon.svg */}
              <img
                src="../../favicon.svg"
                alt="Finanz logo"
                className="w-6 h-6"
              />

              <span className="hidden sm:block text-base font-semibold text-slate-900">
                Finanz
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Hamburger Button - Solo visible en mobile/tablet y cuando está autenticado */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  console.log("🍔 [Navbar] Toggle menú móvil:", !isMenuOpen);
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </button>
            )}

            {/* User Profile */}
            {isLoading ? (
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="user-menu-container relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {getInitials(user.nickname)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-slate-900 truncate max-w-[120px]">
                      {user.nickname}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[120px]">
                      {user.email}
                    </div>
                  </div>
                  <ChevronDown
                    className={`hidden md:block w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 overflow-hidden z-50">
                    <div className="md:hidden px-4 py-3 border-b border-slate-100">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {user.nickname}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {user.email}
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Mi Perfil</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Menu - Aparece desde la derecha como el user menu */}
        {isMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 top-16 bg-black/20 z-40"
              onClick={() => {
                console.log("📱 [Navbar] Cerrando menú por backdrop");
                setIsMenuOpen(false);
              }}
            />
            <div className="lg:hidden fixed top-16 right-4 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 overflow-hidden z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {dashboardMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleMenuItemClick}
                    className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </header>
    );
  }

  // LANDING PAGE NAVBAR
  if (isLandingRoute) {
    const scrollToSection = (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    };

    return (
      <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-slate-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="../../favicon.svg"
              alt="Finanz logo"
              className="w-6 h-6"
            />
            <span className="text-base font-semibold text-slate-900">
              Finanz
            </span>
          </Link>

          {/* Desktop Navigation - Center aligned */}
          <div className="hidden md:flex items-center gap-6">
            

          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Auth Buttons - Hidden on mobile */}
            {!isLoading && (
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Mi Cuenta
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm">Registrarse</Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay and Dropdown */}
        {isMenuOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 top-16 bg-black/20 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="md:hidden fixed top-16 right-4 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 overflow-hidden z-50">
              <Link
                to="/articles"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Artículos
              </Link>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                Cómo funciona
              </button>

              <div className="border-t border-slate-100 my-2"></div>
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Mi Cuenta
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </>  
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </header>
    );
  }

  // No mostrar navbar en otras rutas
  return null;
}
