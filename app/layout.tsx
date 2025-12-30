import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BeKind Network",
  description: "Conecta tu comunidad ante buenas acciones",
  icons: {
    icon: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}