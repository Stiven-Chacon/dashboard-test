"use client"

import { useState, useEffect } from "react"
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { useCreateCategory } from "@/src/hooks/auth/dashboard/bakanes/useCreateCategory"
import {
  validateCategoryForm,
  formatColorHex,
  hasErrors,
} from "@/src/utils/categoryValidators"

interface ValidationErrors {
  name?: string
  description?: string
  color?: string
  imageFile?: string
  general?: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  status: number
  createdAt: string
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
  onSuccess?: () => void
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isActive, setIsActive] = useState(true)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const { isLoading, errors, createCategory, setErrors } = useCreateCategory()

  // Cargar datos si es edición
  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description)
      setColor(category.color)
      setImagePreview(category.icon)
      setIsActive(category.status === 1)
      setImageFile(null) // Resetear el archivo cuando es edición
    } else {
      resetForm()
    }
    setErrors({})
    setValidationErrors({})
  }, [category, setErrors])

  const resetForm = () => {
    setName("")
    setDescription("")
    setColor("")
    setImageFile(null)
    setImagePreview("")
    setIsActive(true)
    setValidationErrors({})
    setShowSuccessMessage(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          imageFile: "La imagen no debe superar 5MB"
        }))
        return
      }

      // Validar tipo
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setValidationErrors((prev) => ({
          ...prev,
          imageFile: "Formato no válido. Usa JPG, PNG, GIF o WebP"
        }))
        return
      }

      setImageFile(file)
      
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Limpiar error si existe
      if (validationErrors.imageFile) {
        setValidationErrors((prev) => ({ ...prev, imageFile: undefined }))
      }
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(category?.icon || "") // Volver a la imagen original si es edición
    const fileInput = document.getElementById("image-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setColor(value)
    
    if (value.trim()) {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
      if (!hexColorRegex.test(value.trim())) {
        setValidationErrors((prev) => ({
          ...prev,
          color: "Formato inválido (ej: #FF5733)",
        }))
      } else {
        setValidationErrors((prev) => ({ ...prev, color: undefined }))
      }
    }
  }

  const handleColorBlur = () => {
    if (color.trim()) {
      const formatted = formatColorHex(color)
      setColor(formatted)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isEditMode = !!category

    // Validar formulario
    const formData = {
      name,
      description,
      color: color.trim(),
      imageFile: imageFile || undefined,
    }

    const errors = validateCategoryForm(formData, isEditMode)
    setValidationErrors(errors)

    if (hasErrors(errors)) {
      return
    }

    // Preparar payload base
    const payload: any = {
      name: name.trim(),
      description: description.trim(),
      color: formatColorHex(color),
    }

    if (isEditMode) {
      // Modo edición: enviar todos los campos
      payload.id = category.id
      payload.status = isActive ? 1 : 0
      
      // Solo enviar imageFile si hay una nueva imagen
      if (imageFile) {
        payload.imageFile = imageFile
      }
    } else {
      // Modo creación: imagen es obligatoria
      if (!imageFile) {
        setValidationErrors((prev) => ({
          ...prev,
          imageFile: "La imagen es obligatoria",
        }))
        return
      }
      payload.imageFile = imageFile
      payload.status = 1 // Por defecto activo en creación
    }

    const result = await createCategory(payload)

    if (result.success) {
      setShowSuccessMessage(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
        resetForm()
      }, 1500)
    }
  }

  const handleClose = () => {
    resetForm()
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  const isEditMode = !!category
  const allErrors = { ...validationErrors, ...errors }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Editar categoría" : "Crear categoría"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">
              {isEditMode
                ? "Categoría actualizada exitosamente"
                : "Categoría creada exitosamente"}
            </p>
          </div>
        )}

        {/* General Error Message */}
        {allErrors.general && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800 font-medium">
              {allErrors.general}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la categoría*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (allErrors.name) {
                  setValidationErrors((prev) => ({ ...prev, name: undefined }))
                }
              }}
              placeholder="Escribe el nombre de la buena acción"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400 ${
                allErrors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {allErrors.name && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <p className="text-red-500 text-xs">{allErrors.name}</p>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de la buena acción*
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (allErrors.description) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    description: undefined,
                  }))
                }
              }}
              placeholder="Agregar descripción"
              rows={4}
              maxLength={200}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900 placeholder-gray-400 ${
                allErrors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {allErrors.description && (
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <p className="text-red-500 text-xs">{allErrors.description}</p>
                </div>
              )}
              <p
                className={`text-xs ml-auto ${
                  description.length > 180 ? "text-orange-500" : "text-gray-500"
                }`}
              >
                {description.length}/200
              </p>
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo{isEditMode ? "" : "*"}
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-between w-full px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  allErrors.imageFile ? "border-red-500" : "border-gray-300"
                }`}
              >
                <span className="text-sm text-gray-900">
                  {imageFile?.name || (isEditMode ? "Cambiar imagen" : "Carga archivo")}
                </span>
                <Upload className="w-4 h-4 text-gray-400" />
              </label>
            </div>
            {allErrors.imageFile && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <p className="text-red-500 text-xs">{allErrors.imageFile}</p>
              </div>
            )}
            {imagePreview && (
              <div className="mt-2 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                {imageFile && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Formatos: JPG, PNG, GIF, WebP (máx. 5MB)
            </p>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color*
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={color}
                onChange={handleColorChange}
                onBlur={handleColorBlur}
                placeholder="#FF5733"
                maxLength={7}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400 ${
                  allErrors.color ? "border-red-500" : "border-gray-300"
                }`}
              />
              {color && !allErrors.color && (
                <div
                  className="w-10 h-10 rounded-lg border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              )}
            </div>
            {allErrors.color && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <p className="text-red-500 text-xs">{allErrors.color}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Formato HEX (ej: #FF5733)
            </p>
          </div>

          {/* Estado - Visible siempre */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <p className="text-xs text-gray-500">
                {isActive ? "La categoría está activa" : "La categoría está inactiva"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-[#01BABB]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : isEditMode ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}