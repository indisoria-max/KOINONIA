import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(date))
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function getVerificationLabel(level: number): string {
  const labels: Record<number, string> = {
    1: 'Email verificado',
    2: 'Teléfono verificado',
    3: 'Identidad verificada',
    4: 'Verificado Koinonia ✝',
  }
  return labels[level] || 'Sin verificar'
}