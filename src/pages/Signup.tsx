import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  validatePassword,
  validateEmail,
  validateAge,
  validateRequired,
  validateName,
  getPasswordErrors,
} from "../lib/validations";
import styles from "./Signup.module.scss";

/**
 * US-1: Sign-up básico (HU10)
 * Formulario de registro con validación en tiempo real
 *
 * Campos requeridos:
 * - Nombres (solo letras, mín. 2 caracteres)
 * - Apellidos (solo letras, mín. 2 caracteres)
 * - Edad (≥ 13 años)
 * - Correo electrónico (formato RFC 5322)
 * - Contraseña (≥ 8 caracteres, mayúscula, minúscula, número y carácter especial)
 * - Confirmar contraseña (debe coincidir)
 */
export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado de los errores
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado de campos tocados
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    age: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  /**
   * Validación en tiempo real de cada campo
   */
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
        }
        if (!validateName(value)) {
          return "Solo se permiten letras (mínimo 2 caracteres)";
        }
        return "";

      case "age":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
        }
        if (!/^\d+$/.test(value)) {
          return "Solo se permiten números";
        }
        if (!validateAge(value)) {
          return "Debes tener al menos 13 años";
        }
        return "";

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
    return (
      Object.values(formData).every(value => value.trim() !== "") &&
      Object.values(errors).every(error => error === "") &&
      validatePassword(formData.password) &&
      formData.password === formData.confirmPassword &&
      validateEmail(formData.email) &&
      validateAge(formData.age) &&
      validateName(formData.firstName) &&
      validateName(formData.lastName)
    );
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      firstName: true,
      lastName: true,
      age: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validar todos los campos
    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      age: validateField("age", formData.age),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
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
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     age: parseInt(formData.age),
      //     email: formData.email,
      //     password: formData.password
      //   })
      // });

      // Simulación de respuesta exitosa
      toast.success("Cuenta creada con éxito", {
        description: "Serás redirigido al login",
        icon: <CheckCircle2 />,
      });

      // Redirigir a login después de 500ms
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      // Manejo de errores del servidor
      toast.error("Error al crear la cuenta", {
        description: "Por favor, intenta de nuevo más tarde",
      });
      console.error("Error en registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.container}>
        {/* Botón para volver */}
        <Link to="/" className={styles.backLink}>
          <ArrowLeft />
          <span>Volver al inicio</span>
        </Link>

        <Card>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Crear cuenta</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Ingresa tus datos para registrarte en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* Nombres */}
              <div className={styles.formGroup}>
                <Label htmlFor="firstName">
                  Nombres <span className={styles.required}>*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.firstName && errors.firstName ? styles.inputError : ""}
                  aria-invalid={touched.firstName && errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {touched.firstName && errors.firstName && (
                  <p
                    id="firstName-error"
                    className={styles.errorMessage}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Apellidos */}
              <div className={styles.formGroup}>
                <Label htmlFor="lastName">
                  Apellidos <span className={styles.required}>*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.lastName && errors.lastName ? styles.inputError : ""}
                  aria-invalid={touched.lastName && errors.lastName ? "true" : "false"}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {touched.lastName && errors.lastName && (
                  <p
                    id="lastName-error"
                    className={styles.errorMessage}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Edad */}
              <div className={styles.formGroup}>
                <Label htmlFor="age">
                  Edad <span className={styles.required}>*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="text"
                  inputMode="numeric"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.age && errors.age ? styles.inputError : ""}
                  aria-invalid={touched.age && errors.age ? "true" : "false"}
                  aria-describedby={errors.age ? "age-error" : undefined}
                />
                {touched.age && errors.age && (
                  <p id="age-error" className={styles.errorMessage} role="alert" aria-live="polite">
                    {errors.age}
                  </p>
                )}
              </div>

              {/* Correo electrónico */}
              <div className={styles.formGroup}>
                <Label htmlFor="email">
                  Correo electrónico <span className={styles.required}>*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
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
              <div className={styles.formGroup}>
                <Label htmlFor="password">
                  Contraseña <span className={styles.required}>*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
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

              {/* Confirmar contraseña */}
              <div className={styles.formGroup}>
                <Label htmlFor="confirmPassword">
                  Confirmar contraseña <span className={styles.required}>*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    touched.confirmPassword && errors.confirmPassword ? styles.inputError : ""
                  }
                  aria-invalid={
                    touched.confirmPassword && errors.confirmPassword ? "true" : "false"
                  }
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className={styles.errorMessage}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Botón de registro */}
              <Button
                type="submit"
                className={styles.submitButton}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className={styles.spinner} />
                    Procesando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>

              {/* Link a login */}
              <div className={styles.footerLink}>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className={styles.loginLink}>
                  Inicia sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
