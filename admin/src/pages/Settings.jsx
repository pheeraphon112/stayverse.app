import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Save, Key, Database, Globe } from 'lucide-react'

export default function Settings() {
  const [saved, setSaved] = useState(false)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Platform configuration</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={20} className="text-[#1B3A6B]" />
            <h2 className="font-semibold text-gray-900">Supabase Connection</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Project URL</label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-mono">
                {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Connected
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-[#0E7C7B]" />
            <h2 className="font-semibold text-gray-900">Platform Info</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Platform</p>
              <p className="font-medium text-gray-900">StayVerse</p>
            </div>
            <div>
              <p className="text-gray-500">Version</p>
              <p className="font-medium text-gray-900">v1.0.0 (Admin Panel)</p>
            </div>
            <div>
              <p className="text-gray-500">Pilot Project</p>
              <p className="font-medium text-gray-900">Grand Florida Pattaya</p>
            </div>
            <div>
              <p className="text-gray-500">Region</p>
              <p className="font-medium text-gray-900">ap-southeast-1 (Singapore)</p>
            </div>
            <div>
              <p className="text-gray-500">Payment Gateway</p>
              <p className="font-medium text-gray-900">Money Space (pending Apr 16)</p>
            </div>
            <div>
              <p className="text-gray-500">Revenue Model</p>
              <p className="font-medium text-gray-900">Freemium + SaaS + 3% Commission</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key size={20} className="text-[#C9931A]" />
            <h2 className="font-semibold text-gray-900">API Integrations</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-700">Money Space (Payment)</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-700">ONE Wallet</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Phase 2</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-700">All ID Global (eKYC)</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Phase 2</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">LINE Notify</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Not Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
