import { toast as sonnerToast } from "sonner";

// Mantener registro de toasts activos para evitar duplicados
const activeToasts = new Set<string>();

// Función helper para crear un ID único para el toast
const getToastId = (message: string, type: string): string => {
  return `${type}-${message}`;
};

// Función para limpiar toasts que ya se cerraron
const cleanupToast = (id: string) => {
  setTimeout(() => {
    activeToasts.delete(id);
  }, 100); // Pequeño delay para evitar race conditions
};

export const toast = {
  success: (message: string, options?: any) => {
    const id = getToastId(message, "success");

    // Si ya existe un toast con este mensaje, no mostrar otro
    if (activeToasts.has(id)) {
      console.log("🔕 [Toast] Toast duplicado bloqueado:", message);
      return;
    }

    console.log("✅ [Toast] Mostrando success:", message);
    activeToasts.add(id);

    sonnerToast.success(message, {
      ...options,
      onDismiss: () => {
        cleanupToast(id);
        options?.onDismiss?.();
      },
      onAutoClose: () => {
        cleanupToast(id);
        options?.onAutoClose?.();
      },
    });
  },

  error: (message: string, options?: any) => {
    const id = getToastId(message, "error");

    // Si ya existe un toast con este mensaje, no mostrar otro
    if (activeToasts.has(id)) {
      console.log("🔕 [Toast] Toast duplicado bloqueado:", message);
      return;
    }

    console.log("❌ [Toast] Mostrando error:", message);
    activeToasts.add(id);

    sonnerToast.error(message, {
      ...options,
      onDismiss: () => {
        cleanupToast(id);
        options?.onDismiss?.();
      },
      onAutoClose: () => {
        cleanupToast(id);
        options?.onAutoClose?.();
      },
    });
  },

  info: (message: string, options?: any) => {
    const id = getToastId(message, "info");

    if (activeToasts.has(id)) {
      console.log("🔕 [Toast] Toast duplicado bloqueado:", message);
      return;
    }

    console.log("ℹ️ [Toast] Mostrando info:", message);
    activeToasts.add(id);

    sonnerToast.info(message, {
      ...options,
      onDismiss: () => {
        cleanupToast(id);
        options?.onDismiss?.();
      },
      onAutoClose: () => {
        cleanupToast(id);
        options?.onAutoClose?.();
      },
    });
  },

  warning: (message: string, options?: any) => {
    const id = getToastId(message, "warning");

    if (activeToasts.has(id)) {
      console.log("🔕 [Toast] Toast duplicado bloqueado:", message);
      return;
    }

    console.log("⚠️ [Toast] Mostrando warning:", message);
    activeToasts.add(id);

    sonnerToast.warning(message, {
      ...options,
      onDismiss: () => {
        cleanupToast(id);
        options?.onDismiss?.();
      },
      onAutoClose: () => {
        cleanupToast(id);
        options?.onAutoClose?.();
      },
    });
  },

  // Método para limpiar todos los toasts
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
    if (!toastId) {
      activeToasts.clear();
    }
  },
};
