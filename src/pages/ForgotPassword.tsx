import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { validateEmail, validateRequired } from "../lib/validations";

/**
 * US-3: Recuperar contraseña (HU12) - Parte 1
 * Formulario para solicitar el restablecimiento de contraseña
 * 
 * Campo requerido:
 * - Correo electrónico (formato RFC 5322)
 */
export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    email: ""
  });

  // Estado de los errores
  const [errors, setErrors] = useState({
    email: ""
  });

  // Estado de campos tocados
  const [touched, setTouched] = useState({
    email: false
  });

  /**
   * Validación en tiempo real del campo de correo
   */
  const validateField = (value: string): string => {
    if (!validateRequired(value)) {
      return "Este campo es requerido";
    }
    if (!validateEmail(value)) {
      return "Formato de correo inválido";
    }
    return "";
  };

  /**
   * Maneja el cambio en el campo de correo
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ email: value });
    
    // Validar solo si el campo ya fue tocado
    if (touched.email) {
      const error = validateField(value);
      setErrors({ email: error });
    }
  };

  /**
   * Marca el campo como tocado al perder el foco
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTouched({ email: true });
    const error = validateField(value);
    setErrors({ email: error });
  };

  /**
   * Valida si el formulario es válido
   */
  const isFormValid = (): boolean => {
    return formData.email.trim() !== "" &&
           errors.email === "" &&
           validateEmail(formData.email);
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar el campo como tocado
    setTouched({ email: true });

    // Validar el campo
    const error = validateField(formData.email);
    setErrors({ email: error });

    // Si hay errores, no continuar
    if (error !== "") {
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada al backend (reemplazar cuando esté disponible)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Integrar con el backend
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: formData.email
      //   })
      // });
      
      // Nota: El backend debe devolver HTTP 202 Accepted para no revelar
      // si el correo existe o no (seguridad)
      
      // Marcar como enviado
      setEmailSent(true);
      
      toast.success("Correo enviado", {
        description: "Revisa tu bandeja de entrada para continuar",
        icon: <Mail className="h-5 w-5" />
      });
      
    } catch (error) {
      // Manejo de errores del servidor
      toast.error("Error al enviar el correo", {
        description: "Por favor, intenta de nuevo más tarde"
      });
      console.error("Error en forgot password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja el reenvío del correo
   */
  const handleResend = () => {
    setEmailSent(false);
    setFormData({ email: "" });
    setErrors({ email: "" });
    setTouched({ email: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón para volver */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver al inicio de sesión</span>
        </Link>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-slate-900">
              {emailSent ? "Correo enviado" : "Recuperar contraseña"}
            </CardTitle>
            <CardDescription>
              {emailSent 
                ? "Te hemos enviado un enlace para restablecer tu contraseña. El enlace es válido por 1 hora."
                : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4">
                {/* Mensaje de éxito */}
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">
                      Revisa tu correo
                    </p>
                    <p className="text-sm text-green-700">
                      {formData.email}
                    </p>
                  </div>
                </div>

                {/* Instrucciones */}
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Si no recibes el correo en unos minutos:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Revisa tu carpeta de spam</li>
                    <li>Verifica que el correo sea correcto</li>
                    <li>Intenta reenviar el correo</li>
                  </ul>
                </div>

                {/* Botones */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResend}
                  >
                    Enviar a otro correo
                  </Button>
                  
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full">
                      Volver al inicio de sesión
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Correo electrónico */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Correo electrónico <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.email && errors.email ? "border-red-600" : ""}
                    aria-invalid={touched.email && errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {touched.email && errors.email && (
                    <p 
                      id="email-error" 
                      className="text-sm text-red-600" 
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Botón de enviar */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar enlace"
                  )}
                </Button>

                {/* Link para volver */}
                <div className="text-center text-sm text-slate-600">
                  ¿Recordaste tu contraseña?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Inicia sesión
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
