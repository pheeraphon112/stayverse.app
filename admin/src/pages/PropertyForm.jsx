import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'

const CONTRACT_TYPES = ['HIRE_PURCHASE', 'RENTAL_OPTION', 'BOTH']
const STATUSES = ['DRAFT', 'PENDING', 'ACTIVE', 'FIRE_SALE', 'CLOSED']
const VIEW_TYPES = ['Sea View', 'Sea View Extra', 'Garden View', 'Pool View', 'Pool View A+', 'Golden View', 'City View', 'Mountain View']

export default function PropertyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [projects, setProjects] = useState([])

  const [form, setForm] = useState({
    title: '',
    unit_number: '',
    building: '',
    floor: '',
    project_id: '',
    address: '',
    size_sqm: '',
    bedrooms: 1,
    bathrooms: 1,
    property_type: 'Condominium',
    view_type: 'Sea View',
    furnished: 'Fully Furnished',
    list_price: '',
    monthly_rent: '',
    contract_type: 'BOTH',
    status: 'DRAFT',
    equity_pct_per_year: 6.7,
    ownership_years: 15,
    foreign_quota: true,
  })

  useEffect(() => {
    loadProjects()
    if (isEdit) loadProperty()
  }, [id])

  async function loadProjects() {
    const { data } = await supabase.from('projects').select('id, name')
    setProjects(data || [])
  }

  async function loadProperty() {
    const { data } = await supabase.from('properties').select('*').eq('id', id).single()
    if (data) {
      setForm({
        title: data.title || '',
        unit_number: data.unit_number || '',
        building: data.building || '',
        floor: data.floor || '',
        project_id: data.project_id || '',
        address: data.address || '',
        size_sqm: data.size_sqm || '',
        bedrooms: data.bedrooms || 1,
        bathrooms: data.bathrooms || 1,
        property_type: data.property_type || 'Condominium',
        view_type: data.view_type || 'Sea View',
        furnished: data.furnished || 'Fully Furnished',
        list_price: data.list_price || '',
        monthly_rent: data.monthly_rent || '',
        contract_type: data.contract_type || 'BOTH',
        status: data.status || 'DRAFT',
        equity_pct_per_year: data.equity_pct_per_year || 6.7,
        ownership_years: data.ownership_years || 15,
        foreign_quota: data.foreign_quota ?? true,
      })
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...form,
      floor: form.floor ? parseInt(form.floor) : null,
      size_sqm: form.size_sqm ? parseFloat(form.size_sqm) : null,
      list_price: form.list_price ? parseInt(form.list_price) : null,
      monthly_rent: form.monthly_rent ? parseInt(form.monthly_rent) : null,
      equity_pct_per_year: parseFloat(form.equity_pct_per_year),
      ownership_years: parseInt(form.ownership_years),
      project_id: form.project_id || null,
    }

    if (isEdit) {
      await supabase.from('properties').update(payload).eq('id', id)
    } else {
      // For new properties, we need developer_id — use first available
      const { data: dev } = await supabase.from('developer_profiles').select('id').limit(1).single()
      if (dev) payload.developer_id = dev.id
      await supabase.from('properties').insert(payload)
    }

    setSaving(false)
    navigate('/properties')
  }

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div>
      <button onClick={() => navigate('/properties')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm">
        <ArrowLeft size={16} /> Back to Properties
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Property' : 'Add Property'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
              <input type="text" value={form.unit_number} onChange={(e) => update('unit_number', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
              <input type="text" value={form.building} onChange={(e) => update('building', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input type="number" value={form.floor} onChange={(e) => update('floor', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select value={form.project_id} onChange={(e) => update('project_id', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none">
                <option value="">-- Select Project --</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Property Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqm)</label>
              <input type="number" step="0.01" value={form.size_sqm} onChange={(e) => update('size_sqm', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={(e) => update('bedrooms', parseInt(e.target.value))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input type="number" value={form.bathrooms} onChange={(e) => update('bathrooms', parseInt(e.target.value))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <input type="text" value={form.property_type} onChange={(e) => update('property_type', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
              <select value={form.view_type} onChange={(e) => update('view_type', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none">
                {VIEW_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Furnished</label>
              <select value={form.furnished} onChange={(e) => update('furnished', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none">
                <option>Fully Furnished</option>
                <option>Partially Furnished</option>
                <option>Unfurnished</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing & Terms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (THB)</label>
              <input type="number" value={form.list_price} onChange={(e) => update('list_price', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (THB)</label>
              <input type="number" value={form.monthly_rent} onChange={(e) => update('monthly_rent', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
              <select value={form.contract_type} onChange={(e) => update('contract_type', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none">
                {CONTRACT_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equity % / Year</label>
              <input type="number" step="0.1" value={form.equity_pct_per_year} onChange={(e) => update('equity_pct_per_year', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ownership (years)</label>
              <input type="number" value={form.ownership_years} onChange={(e) => update('ownership_years', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0E7C7B] focus:border-transparent outline-none" />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <input type="checkbox" id="foreign_quota" checked={form.foreign_quota} onChange={(e) => update('foreign_quota', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#0E7C7B] focus:ring-[#0E7C7B]" />
              <label htmlFor="foreign_quota" className="text-sm font-medium text-gray-700">Foreign Quota Available</label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B3A6B] text-white rounded-lg font-medium hover:bg-[#2a5298] transition-colors disabled:opacity-50">
            <Save size={16} />
            {saving ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
          </button>
          <button type="button" onClick={() => navigate('/properties')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
