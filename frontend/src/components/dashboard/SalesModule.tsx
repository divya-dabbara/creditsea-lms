'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/services/api.service';
import { User } from '@/types';
import { Users } from 'lucide-react';

export function SalesModule() {
  const [leads, setLeads] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getLeads().then((data) => {
      setLeads(data.leads);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium leading-6 text-gray-900">Registered Leads (No Application)</h3>
      </div>
      
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-4 text-center">Loading leads...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No new leads found.</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date().toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
