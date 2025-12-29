"use client"

import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useLoginForm } from "@/src/hooks/useLoginForm"

export default function LoginForm() {
  const {
    email,
    password,
    showPassword,
    errors,
    formError,
    isLoading,
    setEmail,
    setPassword,
    setShowPassword,
    submit,
  } = useLoginForm()

  return (
    <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-10 space-y-6">
      {/* HEADER + LOGO */}
      <div className="text-center space-y-6">
        <img
          src="/logo.svg"
          alt="bekind network"
          className="mx-auto h-20 w-auto"
        />

        <p className="text-gray-900 text-lg font-normal leading-snug">
          ¡Empieza a conectar tu comunidad ante
          <br />
          buenas acciones!
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="space-y-5"
      >
        {formError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-normal text-gray-900 mb-2">
            Correo Electrónico*
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#1E1B4D' }} />
            <input
              type="email"
              placeholder="Ingresar correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-lg border border-gray-300 px-11 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
                errors.email ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-normal text-gray-900 mb-2">
            Contraseña*
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#1E1B4D' }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-lg border border-gray-300 px-11 py-3 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        {/* FORGOT PASSWORD LINK */}
        <div className="text-center">
          <a
            href="/recuperar-contrasena"
            className="text-sm underline hover:opacity-80"
            style={{ color: '#1E1B4D' }}
          >
            Recuperar contraseña
          </a>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500"
          style={!isLoading && email && password ? { backgroundColor: '#1E1B4D' } : undefined}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>
      </form>
    </div>
  )
}