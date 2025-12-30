export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  status: number // 0 = Inactivo, 1 = Activo
  createdAt: string
}

export interface CategoriesListResponse {
  data: {
    pageSize: number
    pageNumber: number
    totalElements: number
    totalPages: number
    data: Category[]
  }
}

export interface CreateCategoryPayload {
  name: string
  description: string
  color?: string
  imageFile?: File
  // Campos adicionales para edición
  id?: string
  icon?: string
  status?: number
}

const API_BASE_URL = "/api/proxy"

export const categoriesApi = {
  getList: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<CategoriesListResponse> => {
    const token = localStorage.getItem("auth_token")
    
    const response = await fetch(
      `${API_BASE_URL}/actions/admin-list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error("Error al cargar las categorías")
    }

    return await response.json()
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const token = localStorage.getItem("auth_token")
    
    if (!token) {
      throw new Error("No hay token de autenticación")
    }

    // SIEMPRE usar FormData - el backend NO acepta JSON
    const formData = createFormData(payload)

    // NO incluir Content-Type - el navegador lo establece automáticamente
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch(`${API_BASE_URL}/actions/admin-add`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || "Error al crear la categoría")
    }

    return await response.json()
  },
}

function createFormData(payload: CreateCategoryPayload): FormData {
  const formData = new FormData()
  formData.append("name", payload.name)
  formData.append("description", payload.description)
  
  if (payload.color) {
    formData.append("color", payload.color)
  }
  
  if (payload.imageFile) {
    formData.append("imageFile", payload.imageFile)
  } else if (payload.icon) {
    formData.append("icon", payload.icon)
  }

  if (payload.status !== undefined) {
    formData.append("status", payload.status.toString())
  }

  if (payload.id) {
    formData.append("id", payload.id)
  }

  return formData
}