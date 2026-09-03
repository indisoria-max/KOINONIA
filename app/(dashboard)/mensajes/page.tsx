import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MensajesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: connections } = await supabase
    .from('connections')
    .select(`
      id, status,
      pilgrim:profiles!connections_pilgrim_id_fkey(id, first_name, last_name, avatar_url),
      host:profiles!connections_host_id_fkey(id, first_name, last_name, avatar_url)
    `)
    .or(`pilgrim_id.eq.${user.id},host_id.eq.${user.id}`)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">💬 Mensajes</h1>

      {!connections || connections.length === 0 ? (
        <div className="text-center text-gray-400 mt-16">
          <p className="text-4xl mb-4">✉️</p>
          <p className="text-lg">No tienes conversaciones aún</p>
          <p className="text-sm mt-2">Conecta con anfitriones para empezar a chatear</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {connections.map((conn: any) => {
            const other = conn.pilgrim?.id === user.id ? conn.host : conn.pilgrim
            return (
              <Link key={conn.id} href={`/mensajes/${conn.id}`}>
                <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 active:scale-95 transition-transform">
                  {other?.avatar_url ? (
                    <img src={other.avatar_url} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">👤</div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800">{other?.first_name} {other?.last_name}</p>
                    <p className="text-sm text-gray-400">Toca para chatear</p>
                  </div>
                  <span className="ml-auto text-gray-300 text-xl">›</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}