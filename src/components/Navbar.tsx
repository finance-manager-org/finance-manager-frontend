import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * Navbar component
 * Barra de navegación principal de la aplicación
 * Incluye logo, enlaces de navegación y botones de autenticación
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Solo mostrar en la landing page
  const isLandingPage = location.pathname === "/";

  if (!isLandingPage) {
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
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Finance Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
            >
              Características
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
            >
              Beneficios
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
            >
              Cómo funciona
            </button>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
            >
              Características
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
            >
              Beneficios
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
            >
              Cómo funciona
            </button>
            
            <div className="pt-3 space-y-2 border-t">
              <Link to="/login" className="block">
                <Button variant="ghost" size="sm" className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/signup" className="block">
                <Button size="sm" className="w-full">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
