export type UserRole = 'peregrino' | 'anfitrion'
export type VerificationLevel = 1 | 2 | 3 | 4
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'completed'

export interface Profile {
  id: string
  role: UserRole
  first_name: string
  last_name: string
  bio: string | null
  avatar_url: string | null
  video_url: string | null
  city: string | null
  country: string | null
  languages: string[]
  verification_level: VerificationLevel
  parish: string | null
  movements: string[]
  phone_verified: boolean
  document_verified: boolean
  parish_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Church {
  id: string
  name: string
  address: string | null
  city: string
  country: string
  latitude: number
  longitude: number
  phone: string | null
  website: string | null
  has_adoration: boolean
  adoration_hours: string | null
  has_confessions: boolean
  verified: boolean
  added_by: string | null
  created_at: string
}

export interface MassSchedule {
  id: string
  church_id: string
  day_of_week: number
  time: string
  language: string
  notes: string | null
}

export interface Connection {
  id: string
  pilgrim_id: string
  host_id: string
  status: ConnectionStatus
  message: string | null
  destination_city: string | null
  travel_from: string | null
  travel_to: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  connection_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

export interface Review {
  id: string
  connection_id: string
  reviewer_id: string
  reviewed_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface Tip {
  id: string
  connection_id: string
  from_id: string
  to_id: string
  amount: number
  currency: string
  message: string | null
  created_at: string
}