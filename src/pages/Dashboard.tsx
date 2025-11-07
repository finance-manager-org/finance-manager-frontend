import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { LogOut, Home } from "lucide-react";
import { toast } from "sonner";

/**
 * Dashboard - Página placeholder
 * Esta es una página temporal que muestra un mensaje de bienvenida
 * después de un login exitoso.
 * 
 * TODO: Implementar el dashboard completo con:
 * - Resumen de finanzas
 * - Gráficos de ingresos y gastos
 * - Lista de transacciones recientes
 * - Navegación a otras secciones
 */
export default function Dashboard() {
  const navigate = useNavigate();

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    // TODO: Cuando el backend esté disponible, limpiar el token
    // localStorage.removeItem('token');
    // o
    // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    toast.success("Sesión cerrada correctamente", {
      description: "Hasta pronto"
    });
    
    // Redirigir a la página de inicio
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900">Finance Manager</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Inicio
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Saludo */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              ¡Hola, Usuario! 👋
            </h2>
            <p className="text-slate-600 mt-2">
              Bienvenido a tu panel de control financiero
            </p>
          </div>

          {/* Card de información */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard en construcción</CardTitle>
              <CardDescription>
                Esta página está en desarrollo y pronto tendrás acceso a todas las funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Próximas funcionalidades:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 ml-2">
                <li>Resumen de ingresos y gastos del mes</li>
                <li>Gráficos interactivos de tus finanzas</li>
                <li>Lista de transacciones recientes</li>
                <li>Categorización de gastos</li>
                <li>Metas de ahorro</li>
                <li>Exportación de reportes</li>
              </ul>
            </CardContent>
          </Card>

          {/* Grid de stats placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Ingresos del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">$0.00</div>
                <p className="text-xs text-slate-500 mt-1">Próximamente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Gastos del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">$0.00</div>
                <p className="text-xs text-slate-500 mt-1">Próximamente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">$0.00</div>
                <p className="text-xs text-slate-500 mt-1">Próximamente</p>
              </CardContent>
            </Card>
          </div>

          {/* Mensaje informativo */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    ¡Has completado el proceso de autenticación!
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    El sistema de login, registro y recuperación de contraseña está funcionando correctamente.
                    Una vez que el backend esté disponible, podrás empezar a gestionar tus finanzas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
