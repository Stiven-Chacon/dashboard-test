export interface CategoryFormData {
  name: string
  description: string
  color: string
  imageFile?: File
}

export interface ValidationErrors {
  name?: string
  description?: string
  color?: string
  imageFile?: string
}

export const validateCategoryForm = (
  data: CategoryFormData,
  isEditMode: boolean = false
): ValidationErrors => {
  const errors: ValidationErrors = {}

  // Validar nombre
  if (!data.name || data.name.trim() === "") {
    errors.name = "El nombre es obligatorio"
  } else if (data.name.trim().length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres"
  } else if (data.name.trim().length > 100) {
    errors.name = "El nombre no puede exceder 100 caracteres"
  }

  // Validar descripción
  if (!data.description || data.description.trim() === "") {
    errors.description = "La descripción es obligatoria"
  } else if (data.description.trim().length < 10) {
    errors.description = "La descripción debe tener al menos 10 caracteres"
  } else if (data.description.trim().length > 200) {
    errors.description = "La descripción no puede exceder 200 caracteres"
  }

  // Validar color (formato HEX)
  if (!data.color || data.color.trim() === "") {
    errors.color = "El color es obligatorio"
  } else {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!hexColorRegex.test(data.color.trim())) {
      errors.color = "El color debe estar en formato HEX (ej: #FF5733)"
    }
  }

  // Validar imagen (solo en modo creación)
  if (!isEditMode && !data.imageFile) {
    errors.imageFile = "La imagen es obligatoria"
  }

  // Validar tipo de archivo de imagen
  if (data.imageFile) {
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!validImageTypes.includes(data.imageFile.type)) {
      errors.imageFile = "El archivo debe ser una imagen (JPG, PNG, GIF o WebP)"
    }

    // Validar tamaño de archivo (máximo 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
    if (data.imageFile.size > maxSizeInBytes) {
      errors.imageFile = "La imagen no debe superar los 5MB"
    }
  }

  return errors
}

// Función auxiliar para formatear color HEX
export const formatColorHex = (color: string): string => {
  let formatted = color.trim()
  
  // Agregar # si no lo tiene
  if (!formatted.startsWith("#")) {
    formatted = `#${formatted}`
  }
  
  // Convertir a mayúsculas
  formatted = formatted.toUpperCase()
  
  return formatted
}

// Función auxiliar para validar si hay errores
export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0
}