import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { validateEmail, validateRequired } from "../lib/validations";
import styles from "./ForgotPassword.module.scss";

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
        icon: <Mail />
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
    <div className={styles.forgotPasswordPage}>
      <div className={styles.container}>
        {/* Botón para volver */}
        <Link 
          to="/login" 
          className={styles.backLink}
        >
          <ArrowLeft />
          <span>Volver al inicio de sesión</span>
        </Link>

        <Card>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              {emailSent ? "Correo enviado" : "Recuperar contraseña"}
            </CardTitle>
            <CardDescription className={styles.cardDescription}>
              {emailSent 
                ? "Te hemos enviado un enlace para restablecer tu contraseña. El enlace es válido por 1 hora."
                : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className={styles.successSection}>
                {/* Mensaje de éxito */}
                <div className={styles.successBox}>
                  <Mail />
                  <div className={styles.successContent}>
                    <p className={styles.successTitle}>
                      Revisa tu correo
                    </p>
                    <p className={styles.successEmail}>
                      {formData.email}
                    </p>
                  </div>
                </div>

                {/* Instrucciones */}
                <div className={styles.instructions}>
                  <p>Si no recibes el correo en unos minutos:</p>
                  <ul className={styles.instructionsList}>
                    <li>Revisa tu carpeta de spam</li>
                    <li>Verifica que el correo sea correcto</li>
                    <li>Intenta reenviar el correo</li>
                  </ul>
                </div>

                {/* Botones */}
                <div className={styles.buttonsGroup}>
                  <Button
                    type="button"
                    variant="outline"
                    className={styles.resendButton}
                    onClick={handleResend}
                  >
                    Enviar a otro correo
                  </Button>
                  
                  <Link to="/login" className={styles.backToLoginLink}>
                    <Button variant="ghost" className={styles.backToLoginButton}>
                      Volver al inicio de sesión
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {/* Correo electrónico */}
                <div className={styles.formGroup}>
                  <Label htmlFor="email">
                    Correo electrónico <span className={styles.required}>*</span>
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
                    className={touched.email && errors.email ? styles.inputError : ""}
                    aria-invalid={touched.email && errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {touched.email && errors.email && (
                    <p 
                      id="email-error" 
                      className={styles.errorMessage}
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
                  className={styles.submitButton}
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className={styles.spinner} />
                      Enviando...
                    </>
                  ) : (
                    "Enviar enlace"
                  )}
                </Button>

                {/* Link para volver */}
                <div className={styles.footerLink}>
                  ¿Recordaste tu contraseña?{" "}
                  <Link to="/login" className={styles.loginLink}>
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
