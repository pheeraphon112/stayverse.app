import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plus, Search, Building2, Eye, Pencil } from 'lucide-react'

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-yellow-100 text-yellow-700',
  FIRE_SALE: 'bg-red-100 text-red-700',
  CLOSED: 'bg-gray-200 text-gray-500',
}

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        project:projects(name),
        photos:property_photos(url, is_primary),
        listings(id, monthly_payment, tenure_months, is_featured)
      `)
      .order('created_at', { ascending: false })

    if (!error) setProperties(data || [])
    setLoading(false)
  }

  const filtered = properties.filter((p) => {
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.unit_number?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 mt-1">{properties.length} total units</p>
        </div>
        <Link
          to="/properties/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1B3A6B] text-white rounded-lg text-sm font-medium hover:bg-[#2a5298] transition-colors"
        >
          <Plus size={16} />
          Add Property
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or unit number..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="FIRE_SALE">Fire Sale</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Unit</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">View / Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Size</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Sale Price</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Monthly</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const primaryPhoto = p.photos?.find((ph) => ph.is_primary)
                const listing = p.listings?.[0]
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {primaryPhoto ? (
                          <img src={primaryPhoto.url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Building2 size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{p.unit_number || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{p.project?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-gray-900">{p.view_type}</p>
                      <p className="text-xs text-gray-400">{p.property_type}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{p.size_sqm} sqm</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">
                      {p.list_price ? `${(p.list_price / 1e6).toFixed(1)}M` : '-'}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700">
                      {listing?.monthly_payment ? `${listing.monthly_payment.toLocaleString()}` : p.monthly_rent?.toLocaleString() || '-'}/mo
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/properties/${p.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                          <Pencil size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">No properties found.</div>
        )}
      </div>
    </div>
  )
}
