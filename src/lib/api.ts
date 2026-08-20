import { getToken, clearToken } from "./auth"

const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    clearToken()
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.message ?? `Error ${response.status}`
    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<T>
}