import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { adminAuth } from '../services/adminAuth';
import { isSupabaseActive, getProviderStatus } from '../../lib/storage/dataProvider.js';
import { SEO } from '../../components/common/SEO';

export function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const provider = getProviderStatus();

  const handleLogout = async () => {
    await adminAuth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex text-espresso-950">
      <SEO title={`${title} | Haecca Hijab Admin`} noindex={true} />
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sand-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-espresso-900 hover:bg-sand-100 rounded-lg"
              aria-label="Buka menu navigasi admin"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-espresso-950">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-50 hover:bg-sand-100 text-xs font-semibold text-espresso-900 border border-sand-200 rounded-full transition-colors"
            >
              <span>Lihat Toko Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-stone-500 hover:text-rose-600 px-2 py-1 transition-colors"
            >
              Keluar
            </button>
          </div>
        </header>

        {/* Provider Status Bar */}
        <div
          className={`border-b px-4 sm:px-8 py-2 text-left flex items-center justify-between text-xs ${
            provider.isSupabase
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {provider.isSupabase ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>
              <strong>{provider.badge}:</strong> {provider.description}
            </span>
          </div>
          <span
            className={`hidden md:inline font-mono text-[11px] ${
              provider.isSupabase ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            Storage: {provider.storage}
          </span>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
