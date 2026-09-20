import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiFetch, ApiError } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import type { AlertResponse, AlertSeverity, AlertStatus } from "@/types"

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  LOW: "Bajo",
  HIGH: "Alto",
  CRITICAL: "Crítico",
}

const SEVERITY_VARIANT: Record<AlertSeverity, "secondary" | "default" | "destructive"> = {
  LOW: "secondary",
  HIGH: "default",
  CRITICAL: "destructive",
}

export function Dashboard() {
  const { user, logout } = useAuth()
  const [alerts, setAlerts] = useState<AlertResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<AlertResponse[]>("/api/alerts/pending")
      .then(setAlerts)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor")
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleUpdateStatus(id: number, status: AlertStatus) {
    try {
      await apiFetch<AlertResponse>(`/api/alerts/${id}/status?status=${status}`, {
        method: "PATCH",
      })
      setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar la alerta")
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alertas pendientes</h1>
          <p className="text-sm text-muted-foreground">
            {user?.fullName} ({user?.role})
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>

      {loading && <p>Cargando alertas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && alerts.length === 0 && (
        <p className="text-muted-foreground">No hay alertas pendientes ahora mismo.</p>
      )}

      {!loading && !error && alerts.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gravedad</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Prueba</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Rango normal</TableHead>
              <TableHead>Medido</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <Badge variant={SEVERITY_VARIANT[alert.severity]}>
                    {SEVERITY_LABEL[alert.severity]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {alert.patientName}
                  <div className="text-xs text-muted-foreground">{alert.medicalRecordNumber}</div>
                </TableCell>
                <TableCell>{alert.testName}</TableCell>
                <TableCell>
                  {alert.value} {alert.unit}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {alert.referenceMin} – {alert.referenceMax} {alert.unit}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(alert.measuredAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdateStatus(alert.id, "REVIEWED")}>
                      Revisada
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(alert.id, "DISMISSED")}
                    >
                      Descartar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}