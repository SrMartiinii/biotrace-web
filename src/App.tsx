import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"
import { Login } from "@/pages/Login"
import { clearToken } from "@/lib/auth"
import type { AuthResponse } from "@/types"

function App() {
  const [user, setUser] = useState<AuthResponse | null>(null)

  if (!user) {
    return <Login onLoginSuccess={setUser} />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg">
        Bienvenido, <strong>{user.fullName}</strong> ({user.role})
      </p>
      <Button
        variant="outline"
        onClick={() => {
          clearToken()
          setUser(null)
        }}
      >
        Cerrar sesión
      </Button>
    </div>
  )
}

export default App