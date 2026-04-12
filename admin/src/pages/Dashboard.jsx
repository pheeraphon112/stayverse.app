import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Building2, FileText, ClipboardList, Users, TrendingUp, DollarSign } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    activeListings: 0,
    leads: 0,
    applications: 0,
    developers: 0,
    tenants: 0,
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const [
      { count: properties },
      { count: leads },
      { count: applications },
      { count: developers },
      { count: tenants },
      { data: recent },
    ] = await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('developer_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('tenant_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
    ])

    setStats({
      properties: properties || 0,
      leads: leads || 0,
      applications: applications || 0,
      developers: developers || 0,
      tenants: tenants || 0,
    })
    setRecentLeads(recent || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">StayVerse platform overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Building2} label="Properties" value={stats.properties} sub="Active listings" color="bg-[#1B3A6B]" />
        <StatCard icon={FileText} label="Leads" value={stats.leads} sub="Total inquiries" color="bg-[#0E7C7B]" />
        <StatCard icon={ClipboardList} label="Applications" value={stats.applications} sub="Rental applications" color="bg-[#C9931A]" />
        <StatCard icon={Users} label="Developers" value={stats.developers} sub="Registered partners" color="bg-purple-600" />
        <StatCard icon={Users} label="Tenants" value={stats.tenants} sub="Registered users" color="bg-blue-500" />
        <StatCard icon={TrendingUp} label="Occupancy" value="100%" sub="Grand Florida pilot" color="bg-green-600" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Leads</h2>
        </div>
        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No leads yet. They will appear here when submitted via the website.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{lead.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{lead.email} &middot; {lead.phone}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    lead.status === 'qualified' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(lead.created_at).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
