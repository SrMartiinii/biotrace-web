import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg">
        Bienvenido, <strong>{user?.fullName}</strong> ({user?.role})
      </p>
      <Button variant="outline" onClick={logout}>
        Cerrar sesión
      </Button>
    </div>
  )
}