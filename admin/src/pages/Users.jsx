import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Shield, Home, Building2 } from 'lucide-react'

const ROLE_ICONS = { ADMIN: Shield, TENANT: Home, DEVELOPER: Building2 }
const ROLE_COLORS = {
  ADMIN: 'bg-purple-100 text-purple-700',
  TENANT: 'bg-blue-100 text-blue-700',
  DEVELOPER: 'bg-teal-100 text-teal-700',
}
const KYC_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  VERIFIED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  async function updateKYC(id, newStatus) {
    await supabase.from('users').update({ kyc_status: newStatus }).eq('id', id)
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, kyc_status: newStatus } : u))
  }

  const filtered = users.filter((u) => {
    const matchSearch = search === '' ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">{users.length} registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none">
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="DEVELOPER">Developer</option>
          <option value="TENANT">Tenant</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">User</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Role</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">KYC</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{u.full_name || 'No Name'}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{u.phone || '-'}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <select
                      value={u.kyc_status}
                      onChange={(e) => updateKYC(u.id, e.target.value)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${KYC_COLORS[u.kyc_status]}`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(u.created_at).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">No users found.</div>
        )}
      </div>
    </div>
  )
}
