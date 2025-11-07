import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  validatePassword,
  validateRequired,
  getPasswordErrors
} from "../lib/validations";
import styles from "./ResetPassword.module.scss";

/**
 * US-3: Recuperar contraseña (HU12) - Parte 2
 * Formulario para restablecer la contraseña con token
 * 
 * Campos requeridos:
 * - Nueva contraseña (≥ 8 caracteres, mayúscula, minúscula, número y carácter especial)
 * - Confirmar contraseña (debe coincidir)
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  // Estado de los errores
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });

  // Estado de campos tocados
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false
  });

  /**
   * Valida el token al cargar el componente
   */
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setIsValidatingToken(false);
        return;
      }

      try {
        // Simular validación del token (reemplazar cuando esté disponible el backend)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Integrar con el backend
        // const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
        // const data = await response.json();
        // setIsTokenValid(response.ok);
        
        // Simulación: token válido si tiene más de 10 caracteres
        setIsTokenValid(token.length > 10);
        
      } catch (error) {
        console.error("Error validando token:", error);
        setIsTokenValid(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  /**
   * Validación en tiempo real de cada campo
   */
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "password":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
        }
        const passwordErrors = getPasswordErrors(value);
        if (passwordErrors.length > 0) {
          return passwordErrors.join(", ");
        }
        return "";
      
      case "confirmPassword":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
        }
        if (value !== formData.password) {
          return "Las contraseñas no coinciden";
        }
        return "";
      
      default:
        return "";
    }
  };

  /**
   * Maneja el cambio en los campos del formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar solo si el campo ya fue tocado
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  /**
   * Marca el campo como tocado al perder el foco
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  /**
   * Valida si el formulario completo es válido
   */
  const isFormValid = (): boolean => {
    return Object.values(formData).every(value => value.trim() !== "") &&
           Object.values(errors).every(error => error === "") &&
           validatePassword(formData.password) &&
           formData.password === formData.confirmPassword;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    setTouched({
      password: true,
      confirmPassword: true
    });

    // Validar todos los campos
    const newErrors = {
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword)
    };
    
    setErrors(newErrors);

    // Si hay errores, no continuar
    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada al backend (reemplazar cuando esté disponible)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Integrar con el backend
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     token: token,
      //     password: formData.password
      //   })
      // });
      
      // Marcar como contraseña restablecida
      setPasswordReset(true);
      
      toast.success("Contraseña actualizada", {
        description: "Ahora puedes iniciar sesión con tu nueva contraseña",
        icon: <CheckCircle2 className="h-5 w-5" />
      });
      
      // Redirigir a login después de 500ms
      setTimeout(() => {
        navigate("/login");
      }, 500);
      
    } catch (error) {
      // Manejo de errores del servidor
      toast.error("Error al actualizar la contraseña", {
        description: "Por favor, intenta de nuevo"
      });
      console.error("Error en reset password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renderiza el estado de carga mientras valida el token
   */
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-slate-600">Validando enlace...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /**
   * Renderiza mensaje de token inválido o expirado
   */
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al inicio de sesión</span>
          </Link>

          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-slate-900">Enlace inválido</CardTitle>
              <CardDescription>
                Este enlace es inválido o ha caducado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    No se puede restablecer la contraseña
                  </p>
                  <p className="text-sm text-red-700">
                    El enlace pudo haber expirado o ya fue usado
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Link to="/forgot-password" className="block">
                  <Button className="w-full">
                    Solicitar nuevo enlace
                  </Button>
                </Link>
                
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /**
   * Renderiza el formulario de restablecimiento de contraseña
   */
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver al inicio de sesión</span>
        </Link>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-slate-900">Nueva contraseña</CardTitle>
            <CardDescription>
              Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Nueva contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Nueva contraseña <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.password && errors.password ? "border-red-600" : ""}
                  aria-invalid={touched.password && errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {touched.password && errors.password && (
                  <p 
                    id="password-error" 
                    className="text-sm text-red-600" 
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.password}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
                </p>
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmar contraseña <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.confirmPassword && errors.confirmPassword ? "border-red-600" : ""}
                  aria-invalid={touched.confirmPassword && errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p 
                    id="confirmPassword-error" 
                    className="text-sm text-red-600" 
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Botón de restablecer */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Restablecer contraseña"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
