import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, CheckCircle, XCircle, Star } from 'lucide-react'

const STATUS_COLORS = {
  SUBMITTED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-100 text-gray-500',
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => { loadApplications() }, [])

  async function loadApplications() {
    const { data } = await supabase
      .from('applications')
      .select(`
        *,
        listing:listings(
          monthly_payment,
          property:properties(title, unit_number)
        ),
        tenant:users!applications_tenant_id_fkey(full_name, email, phone)
      `)
      .order('applied_at', { ascending: false })

    setApplications(data || [])
    setLoading(false)
  }

  async function updateStatus(id, newStatus) {
    await supabase.from('applications').update({ status: newStatus, reviewed_at: new Date().toISOString() }).eq('id', id)
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a))
  }

  const filtered = applications.filter((a) => statusFilter === 'ALL' || a.status === statusFilter)

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1">{applications.length} total applications</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'SUBMITTED', 'SHORTLISTED', 'APPROVED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s ? 'bg-[#1B3A6B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          No applications found. They will appear here when tenants apply via the website.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {app.tenant?.full_name || 'Unknown Tenant'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {app.tenant?.email} &middot; {app.tenant?.phone}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Applied for: {app.listing?.property?.title || 'Unknown Property'}
                    {app.listing?.monthly_payment && ` — ${app.listing.monthly_payment.toLocaleString()}/mo`}
                  </p>
                  {app.monthly_income && <p className="text-sm text-gray-400">Income: {app.monthly_income.toLocaleString()} THB/mo</p>}
                  {app.credit_score_at_apply != null && <p className="text-sm text-gray-400">Credit Score: {app.credit_score_at_apply}/100</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                  {app.status === 'SUBMITTED' && (
                    <div className="flex gap-1.5">
                      <button onClick={() => updateStatus(app.id, 'SHORTLISTED')} className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600" title="Shortlist">
                        <Star size={16} />
                      </button>
                      <button onClick={() => updateStatus(app.id, 'APPROVED')} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => updateStatus(app.id, 'REJECTED')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Reject">
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                  {app.status === 'SHORTLISTED' && (
                    <div className="flex gap-1.5">
                      <button onClick={() => updateStatus(app.id, 'APPROVED')} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => updateStatus(app.id, 'REJECTED')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Reject">
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Applied: {new Date(app.applied_at).toLocaleString('th-TH')}
                {app.reviewed_at && ` | Reviewed: ${new Date(app.reviewed_at).toLocaleString('th-TH')}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
