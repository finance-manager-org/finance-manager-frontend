
/**
 * API Service - Centralizes all HTTP requests to the backend
 * Base URL configured via environment variable
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface SignupRequest {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Important: Send cookies (AccessToken, RefreshToken, deviceId)
  };

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw {
        message: "Error del servidor. Intenta nuevamente.",
        statusCode: response.status,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Error en la solicitud",
        statusCode: response.status,
      };
    }

    return data;
  } catch (error) {
    // Network errors or fetch failures
    if (error instanceof TypeError) {
      throw {
        message:
          "No se pudo conectar al servidor. Verifica tu conexión a internet.",
        statusCode: 0,
      };
    }
    throw error;
  }
}

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * POST /api/auth/signup
   * Register a new user
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return apiRequest<SignupResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/auth/login
   * Authenticate user and receive session cookies
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/auth/logout
   * Revoke current device session
   */
  logout: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  /**
   * POST /api/auth/recover
   * Send password recovery email
   */
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    return apiRequest<ForgotPasswordResponse>("/api/auth/recover", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/auth/reset/:token
   * Reset password using token from email
   */
  resetPassword: async (
    token: string,
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    return apiRequest<ResetPasswordResponse>(`/api/auth/reset/${token}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/auth/profile
   * Get authenticated user profile
   */
  getProfile: async (): Promise<{ user: SignupResponse["user"] }> => {
    return apiRequest<{ user: SignupResponse["user"] }>("/api/auth/profile", {
      method: "GET",
    });
  },

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token from cookies
   */
  refreshToken: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/api/auth/refresh", {
      method: "POST",
    });
  },
};

/**
 * Category interfaces
 */
export interface Category {
  id: number;
  tipo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  tipo: string;
}

export interface UpdateCategoryRequest {
  tipo?: string;
}

/**
 * Category API endpoints
 */
export const categoryApi = {
  /**
   * POST /api/category
   * Create a new category
   */
  create: async (data: CreateCategoryRequest): Promise<{ message: string; category: Category }> => {
    return apiRequest<{ message: string; category: Category }>("/api/category", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/category
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    return apiRequest<Category[]>("/api/category", {
      method: "GET",
    });
  },

  /**
   * GET /api/category/:id
   * Get category by ID
   */
  getById: async (id: number): Promise<Category> => {
    return apiRequest<Category>(`/api/category/${id}`, {
      method: "GET",
    });
  },

  /**
   * PUT /api/category/:id
   * Update category
   */
  update: async (id: number, data: UpdateCategoryRequest): Promise<{ message: string; category: Category }> => {
    return apiRequest<{ message: string; category: Category }>(`/api/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE /api/category/:id
   * Delete category
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/category/${id}`, {
      method: "DELETE",
    });
  },
};

export { API_BASE_URL };
