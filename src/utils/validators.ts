export const isValidEmail = (email: string) =>
  /\S+@\S+\.\S+/.test(email)

export const validateLogin = (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {}

  if (!email) errors.email = "El correo es obligatorio"
  else if (!isValidEmail(email)) errors.email = "Correo inválido"

  if (!password) errors.password = "La contraseña es obligatoria"
  else if (password.length < 6)
    errors.password = "Debe tener al menos 6 caracteres"

  return errors
}
