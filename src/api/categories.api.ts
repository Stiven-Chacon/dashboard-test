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

    const isEditMode = !!payload.id
    const formData = createFormData(payload, isEditMode)

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
      throw new Error(errorData?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la categoría`)
    }

    return await response.json()
  },
}

function createFormData(payload: CreateCategoryPayload, isEditMode: boolean): FormData {
  const formData = new FormData()
  formData.append("name", payload.name)
  formData.append("description", payload.description)
  
  if (payload.color) {
    formData.append("color", payload.color)
  }
  
  if (payload.status !== undefined) {
    formData.append("status", payload.status.toString())
  }

  if (isEditMode && payload.id) {
    formData.append("id", payload.id)
  }


  if (payload.imageFile instanceof File) {
    formData.append("icon", payload.imageFile)
  } else if (isEditMode) {
    const emptyBlob = new Blob([], { type: "application/octet-stream" })
    formData.append("icon", emptyBlob, "keep-existing.tmp")
  } else {
    const emptyBlob = new Blob([], { type: "application/octet-stream" })
    formData.append("icon", emptyBlob, "empty.tmp")
  }

  return formData
}