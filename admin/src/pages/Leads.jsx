import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Phone, Mail, ChevronDown } from 'lucide-react'

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted', 'lost']
const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  converted: 'bg-purple-100 text-purple-700',
  lost: 'bg-gray-100 text-gray-500',
}

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => { loadLeads() }, [])

  async function loadLeads() {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  async function updateStatus(id, newStatus) {
    await supabase.from('leads').update({ status: newStatus }).eq('id', id)
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l))
  }

  const filtered = leads.filter((l) => {
    const matchSearch = search === '' ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search)
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 mt-1">{leads.length} total inquiries</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none"
        >
          <option value="ALL">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Contact</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Nationality</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Income</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Interest</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{lead.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-400">{lead.source}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="space-y-1">
                      {lead.email && <p className="flex items-center gap-1.5 text-gray-600"><Mail size={12} />{lead.email}</p>}
                      {lead.phone && <p className="flex items-center gap-1.5 text-gray-600"><Phone size={12} />{lead.phone}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{lead.nationality || '-'}</td>
                  <td className="px-5 py-3 text-gray-700">{lead.monthly_income || '-'}</td>
                  <td className="px-5 py-3 text-gray-700 max-w-[150px] truncate">{lead.property_interest || '-'}</td>
                  <td className="px-5 py-3 text-center">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[lead.status] || 'bg-gray-100'}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(lead.created_at).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">No leads found.</div>
        )}
      </div>
    </div>
  )
}
