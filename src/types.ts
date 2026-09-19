export type Role = "STAFF" | "ADMIN"

export interface AuthResponse {
  token: string
  username: string
  fullName: string
  role: Role
}