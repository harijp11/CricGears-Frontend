import React, { useState } from 'react';
import { Sidebar } from '../../components/Admin/dashboard/Sidebar';
import { DashboardContent } from '../../components/Admin/dashboard/Dashboard';
import { Menu,ArrowLeft } from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="text-gray-800 focus:outline-none">
          {sidebarOpen ? <ArrowLeft className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        </header>
        <main className="p-6">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}

