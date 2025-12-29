import LoginForm from "@/src/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <main
      className="
        relative min-h-screen w-screen
        flex items-center justify-center
        bg-no-repeat bg-center bg-cover bg-gray-50
      "
      style={{
        backgroundImage: "url('/Background.png')",
      }}
    >
      <LoginForm />
    </main>
  )
}