export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user?: any
  message?: string
}

const API_BASE_URL = "https://dev.apinetbo.bekindnetwork.com/api"

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/Authentication/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error de autenticación")
    }

    return data
  },
}
