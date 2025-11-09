import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { TrendingUp, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { authApi } from "../lib/api";
import { toast } from "sonner";

/**
 * Navbar component
 * Barra de navegación principal de la aplicación
 * Incluye logo, enlaces de navegación y botones de autenticación
 * Los botones de login/registro solo aparecen cuando NO está autenticado
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      await authApi.getProfile();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
      toast.success("Sesión cerrada correctamente");
      navigate("/");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  // Mostrar en landing page, login y register pages
  const shouldShowNavbar = ["/", "/login", "/register", "/signup"].includes(
    location.pathname
  );

  if (!shouldShowNavbar) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.header}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <TrendingUp />
            </div>
            <span className={styles.logoText}>Finance Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <Link to="/articles" className={styles.navLink}>
              Artículos
            </Link>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={styles.navLink}
            >
              Cómo funciona
            </button>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className={styles.authButtons}>
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  // Mostrar opciones cuando está autenticado
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
                  // Mostrar login/registro cuando NO está autenticado
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link
              to="/articles"
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Artículos
            </Link>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={styles.mobileNavLink}
            >
              Cómo funciona
            </button>

            <div className={styles.mobileAuthSection}>
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    // Mostrar opciones cuando está autenticado
                    <>
                      <Link to="/dashboard">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={styles.mobileAuthButton}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Mi Cuenta
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={styles.mobileAuthButton}
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    // Mostrar login/registro cuando NO está autenticado
                    <>
                      <Link to="/login">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={styles.mobileAuthButton}
                        >
                          Iniciar Sesión
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button size="sm" className={styles.mobileAuthButton}>
                          Registrarse
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
