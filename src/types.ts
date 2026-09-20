export type Role = "STAFF" | "ADMIN"

export interface AuthResponse {
  token: string
  username: string
  fullName: string
  role: Role
}

export type AlertSeverity = "LOW" | "HIGH" | "CRITICAL"
export type AlertStatus = "PENDING" | "REVIEWED" | "DISMISSED"

export interface AlertResponse {
  id: number
  severity: AlertSeverity
  status: AlertStatus
  patientName: string
  medicalRecordNumber: string
  testName: string
  value: number
  unit: string
  referenceMin: number
  referenceMax: number
  measuredAt: string
  createdAt: string
  reviewedAt: string | null
}