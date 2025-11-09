import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { validateEmail, validateRequired } from "../lib/validations";
import styles from "./Login.module.scss";

/**
 * US-2: Login / Logout (HU11)
 * Formulario de inicio de sesión con validación en tiempo real
 *
 * Campos requeridos:
 * - Correo electrónico (formato RFC 5322)
 * - Contraseña
 */
export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Estado de los errores
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Estado de campos tocados
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  /**
   * Validación en tiempo real de cada campo
   */
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
        }
        if (!validateEmail(value)) {
          return "Formato de correo inválido";
        }
        return "";

      case "password":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
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
    return (
      Object.values(formData).every(value => value.trim() !== "") &&
      Object.values(errors).every(error => error === "") &&
      validateEmail(formData.email) &&
      validateRequired(formData.password)
    );
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      email: true,
      password: true,
    });

    // Validar todos los campos
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
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
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: formData.email,
      //     password: formData.password
      //   })
      // });

      // TODO: Almacenar token en localStorage o cookie HttpOnly
      // localStorage.setItem('token', response.token);

      // Simulación de respuesta exitosa
      const userName = "Usuario"; // Este valor vendría del backend
      toast.success(`¡Hola, ${userName}!`, {
        description: "Has iniciado sesión correctamente",
        icon: <CheckCircle2 />,
      });

      // Redirigir a dashboard después de 500ms
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      // Manejo de errores del servidor
      // 401 Unauthorized -> Credenciales incorrectas
      // 423 Locked -> Cuenta bloqueada
      // 429 Too Many Requests -> Demasiados intentos
      // 5xx -> Error del servidor

      toast.error("Error al iniciar sesión", {
        description: "Correo o contraseña inválidos",
      });
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        {/* Botón para volver */}
        <Link to="/" className={styles.backLink}>
          <ArrowLeft />
          <span>Volver al inicio</span>
        </Link>

        <Card>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Iniciar sesión</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
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

              {/* Contraseña */}
              <div className={styles.passwordGroup}>
                <div className={styles.passwordLabel}>
                  <Label htmlFor="password">
                    Contraseña <span className={styles.required}>*</span>
                  </Label>
                  <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.password && errors.password ? styles.inputError : ""}
                  aria-invalid={touched.password && errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {touched.password && errors.password && (
                  <p
                    id="password-error"
                    className={styles.errorMessage}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Botón de inicio de sesión */}
              <Button
                type="submit"
                className={styles.submitButton}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className={styles.spinner} />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>

              {/* Link a registro */}
              <div className={styles.footerLink}>
                ¿No tienes una cuenta?{" "}
                <Link to="/signup" className={styles.signupLink}>
                  Regístrate
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
