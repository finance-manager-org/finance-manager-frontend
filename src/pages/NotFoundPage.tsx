import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Página no encontrada
          </h2>
          <p className="text-gray-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            Si crees que esto es un error, por favor contacta al soporte.
          </p>
        </div>
      </Card>
    </div>
  );
}
