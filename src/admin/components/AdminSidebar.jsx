import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Home,
  BookOpen,
  Compass,
  Megaphone,
  PanelBottom,
  Store,
  MessageCircle,
  ExternalLink,
  LogOut,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { adminAuth } from '../services/adminAuth';
import { isSupabaseActive, getProviderStatus } from '../../lib/storage/dataProvider.js';

export function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const provider = getProviderStatus();

  const handleLogout = async () => {
    await adminAuth.signOut();
    showToast('Berhasil keluar dari sesi admin.', 'info');
    navigate('/admin/login');
  };

  const dashboardMenu = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  ];

  const katalogMenu = [
    { label: 'Katalog Produk', to: '/admin/products', icon: Package },
    { label: 'Kategori', to: '/admin/categories', icon: Layers },
  ];

  const kontenWebsite = [
    { label: 'Homepage', to: '/admin/homepage', icon: Home },
    { label: 'Tentang Kami', to: '/admin/about', icon: BookOpen },
    { label: 'Navigasi Header', to: '/admin/navigation', icon: Compass },
    { label: 'Banner & Promo', to: '/admin/banner-promo', icon: Megaphone },
    { label: 'Footer Brand', to: '/admin/footer', icon: PanelBottom },
  ];

  const pengaturan = [
    { label: 'Pengaturan Toko', to: '/admin/settings', icon: Store },
    { label: 'WhatsApp Checkout', to: '/admin/whatsapp', icon: MessageCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-espresso-950 text-cream-100 flex flex-col z-40 border-r border-espresso-900 transition-transform duration-300 lg:translate-x-0 font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-espresso-900 flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="text-2xl tracking-[0.18em] font-bold text-cream-50">
              HAECCA
            </span>
            <span className="text-[9px] tracking-[0.25em] font-semibold text-mocha-400 uppercase">
              STUDIO CMS & ADMIN
            </span>
          </div>
        </div>

        {/* Security / Provider Banner in Sidebar */}
        <div
          className={`mx-4 mt-3 p-3 rounded-xl border text-left ${
            provider.isSupabase
              ? 'bg-emerald-500/10 border-emerald-500/25'
              : 'bg-amber-500/10 border-amber-500/20'
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold ${
              provider.isSupabase ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {provider.isSupabase ? (
              <ShieldCheck className="w-4 h-4 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 shrink-0" />
            )}
            <span>{provider.badge}</span>
          </div>
          <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
            {provider.description}. Storage: {provider.storage}.
          </p>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto text-left">
          {/* Section 1: DASHBOARD */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 block mb-1">
              Dashboard
            </span>
            {dashboardMenu.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-mocha-500 text-white font-semibold shadow-sm'
                        : 'text-stone-400 hover:text-cream-100 hover:bg-espresso-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Section 2: KATALOG */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 block mb-1">
              Katalog
            </span>
            {katalogMenu.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-mocha-500 text-white font-semibold shadow-sm'
                        : 'text-stone-400 hover:text-cream-100 hover:bg-espresso-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Section 3: KONTEN WEBSITE */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 block mb-1">
              Konten Website
            </span>
            {kontenWebsite.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-mocha-500 text-white font-semibold shadow-sm'
                        : 'text-stone-400 hover:text-cream-100 hover:bg-espresso-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Section 4: PENGATURAN */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 block mb-1">
              Pengaturan
            </span>
            {pengaturan.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-mocha-500 text-white font-semibold shadow-sm'
                        : 'text-stone-400 hover:text-cream-100 hover:bg-espresso-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Section 5: NAVIGASI CEPAT */}
          <div className="pt-3 border-t border-espresso-900 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 block mb-1">
              Navigasi Cepat
            </span>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-cream-100 hover:bg-espresso-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4" />
                <span>Lihat Toko Publik</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-espresso-900 text-mocha-400">
                Tab Baru
              </span>
            </Link>
          </div>
        </div>

        {/* Admin Profile & Logout */}
        <div className="p-4 border-t border-espresso-900 bg-espresso-950/80 flex items-center justify-between text-left">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-mocha-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-cream-100 truncate">Administrator</p>
              <p className="text-[10px] text-stone-400 truncate">admin@haeccahijab.com</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Keluar dari sesi admin"
            className="p-2 text-stone-400 hover:text-rose-400 hover:bg-espresso-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
