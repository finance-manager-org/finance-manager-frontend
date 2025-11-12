import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import { authApi, ApiError } from "../lib/api";
import styles from "./Signup.module.scss";

/**
 * US-1: Sign-up básico (HU10)
 * Formulario de registro con validación en tiempo real
 *
 * Campos requeridos:
 * - Nombre completo (solo letras, mín. 2 caracteres)
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
    nickname: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado de los errores
  const [errors, setErrors] = useState({
    nickname: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado de campos tocados
  const [touched, setTouched] = useState({
    nickname: false,
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
      case "nickname":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
        }
        if (!validateName(value)) {
          return "El nombre debe tener al menos 2 caracteres y solo letras";
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar solo si el campo ya fue tocado
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  /**
   * Marca el campo como tocado al perder el foco
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  /**
   * Valida si el formulario completo es válido
   */
  const isFormValid = (): boolean => {
    return (
      Object.values(formData).every((value) => value.trim() !== "") &&
      Object.values(errors).every((error) => error === "") &&
      validatePassword(formData.password) &&
      formData.password === formData.confirmPassword &&
      validateEmail(formData.email) &&
      validateAge(formData.age) &&
      validateName(formData.nickname)
    );
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      nickname: true,
      age: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validar todos los campos
    const newErrors = {
      nickname: validateField("nickname", formData.nickname),
      age: validateField("age", formData.age),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword,
      ),
    };

    setErrors(newErrors);

    // Si hay errores, no continuar
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    setIsLoading(true);

    try {
      // Llamada al backend
      const response = await authApi.signup({
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Mostrar mensaje de éxito
      toast.success("Cuenta creada con éxito", {
        description: `Bienvenido, ${response.user.nickname}!`,
        icon: <CheckCircle2 />,
      });

      // Redirigir a login después de 500ms
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      // Manejo de errores del servidor
      const apiError = error as ApiError;

      if (apiError.statusCode === 400) {
        toast.error("Datos inválidos", {
          description:
            apiError.message || "Verifica que todos los campos sean correctos",
        });
      } else if (apiError.statusCode === 409) {
        toast.error("Email ya registrado", {
          description: "Este correo electrónico ya está en uso",
        });
        setErrors((prev) => ({
          ...prev,
          email: "Este email ya está registrado",
        }));
      } else if (apiError.statusCode === 0) {
        toast.error("Error de conexión", {
          description: apiError.message,
        });
      } else {
        toast.error("Error al crear la cuenta", {
          description: "Por favor, intenta de nuevo más tarde",
        });
      }
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
              {/* Nombre completo / Nickname */}
              <div className={styles.formGroup}>
                <Label htmlFor="nickname">
                  Nombre completo <span className={styles.required}>*</span>
                </Label>
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    touched.nickname && errors.nickname
                      ? styles.inputError
                      : ""
                  }
                  aria-invalid={
                    touched.nickname && errors.nickname ? "true" : "false"
                  }
                  aria-describedby={
                    errors.nickname ? "nickname-error" : undefined
                  }
                />
                {touched.nickname && errors.nickname && (
                  <p
                    id="nickname-error"
                    className={styles.errorMessage}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.nickname}
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
