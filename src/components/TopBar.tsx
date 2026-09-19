import React from 'react';
import { AppLanguage, UserProfile, normalizeRole } from '../types';
import {
  HelpCircle,
  LogOut,
  Scissors,
  Building2,
  ShoppingBag,
  Sparkles,
  MapPin,
  Package,
  History,
  User,
  UploadCloud,
  ListFilter,
  Layers,
  Search,
  Bookmark,
  CheckCircle2,
  PackageCheck,
  Wallet
} from 'lucide-react';

interface TopBarProps {
  currentUser: UserProfile | null;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onOpenHelp: () => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  language,
  setLanguage,
  onOpenHelp,
  onLogout
}) => {
  const isBm = language === 'bm';
  const role = currentUser ? normalizeRole(currentUser.role) : null;
  const userName = currentUser?.name || 'Pengguna';

  // Role metadata
  const getRoleMeta = () => {
    switch (role) {
      case 'pengumpul':
        return {
          title: isBm ? 'Pengumpul' : 'Collector',
          color: 'bg-emerald-600 text-white',
          icon: Scissors,
          border: 'border-emerald-700'
        };
      case 'pembekal':
        return {
          title: isBm ? 'Pembekal' : 'Supplier',
          color: 'bg-teal-700 text-white',
          icon: Building2,
          border: 'border-teal-800'
        };
      case 'pembeli':
        return {
          title: isBm ? 'Pembeli' : 'Buyer',
          color: 'bg-sky-700 text-white',
          icon: ShoppingBag,
          border: 'border-sky-800'
        };
      default:
        return {
          title: isBm ? 'Pengguna' : 'User',
          color: 'bg-slate-700 text-white',
          icon: User,
          border: 'border-slate-800'
        };
    }
  };

  const roleMeta = getRoleMeta();
  const RoleIcon = roleMeta.icon;

  // Role-specific navigation items strictly tailored to the authenticated role
  const getNavItems = () => {
    if (role === 'pengumpul') {
      return [
        {
          id: 'materials',
          label: isBm ? 'Hub Fabrik' : 'Fabric Hub',
          icon: Layers
        },
        {
          id: 'claimed',
          label: isBm ? 'Dituntut Saya' : 'My Claimed Items',
          icon: PackageCheck
        },
        {
          id: 'earnings',
          label: isBm ? 'Pendapatan & Bank' : 'Earnings & Bank',
          icon: Wallet
        },
        {
          id: 'opportunities',
          label: isBm ? 'Peluang Kutipan' : 'Collection Jobs',
          icon: Scissors
        },
        {
          id: 'profile',
          label: isBm ? 'Profil Saya' : 'My Profile',
          icon: User
        }
      ];
    }

    if (role === 'pembekal') {
      return [
        {
          id: 'upload',
          label: isBm ? 'Muat Naik Sisa Fabrik' : 'Upload Fabric Waste',
          icon: UploadCloud
        },
        {
          id: 'listings',
          label: isBm ? 'Senarai Saya' : 'My Listings',
          icon: ListFilter
        },
        {
          id: 'available',
          label: isBm ? 'Bahan Tersedia' : 'Available Materials',
          icon: Layers
        },
        {
          id: 'history',
          label: isBm ? 'Sejarah Pembekal' : 'Supplier History',
          icon: History
        },
        {
          id: 'profile',
          label: isBm ? 'Profil Saya' : 'My Profile',
          icon: User
        }
      ];
    }

    if (role === 'pembeli') {
      return [
        {
          id: 'browse',
          label: isBm ? 'Teroka Bahan' : 'Browse Materials',
          icon: ShoppingBag
        },
        {
          id: 'search',
          label: isBm ? 'Cari Fabrik' : 'Search',
          icon: Search
        },
        {
          id: 'orders',
          label: isBm ? 'Pesanan Saya' : 'My Orders',
          icon: Package
        },
        {
          id: 'saved',
          label: isBm ? 'Item Disimpan' : 'Saved Items',
          icon: Bookmark
        },
        {
          id: 'profile',
          label: isBm ? 'Profil Saya' : 'My Profile',
          icon: User
        }
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8dfd5] shadow-xs">
      {/* Top Banner: Dynamic Greeting, Role Identity & Account Controls */}
      <div className="bg-[#234e3f] text-white px-3 sm:px-5 py-2 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* User Greeting & Role Badge */}
          <div className="flex items-center gap-2.5">
            {currentUser && (
              <>
                <div className="flex items-center gap-1.5 font-extrabold text-sm sm:text-base text-white">
                  <span>Hello, {userName}</span>
                </div>

                <span className="text-white/40">|</span>

                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black shadow-2xs ${roleMeta.color}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                  <span>{roleMeta.title}</span>
                </div>

                {currentUser.email && (
                  <span className="hidden lg:inline text-white/70 text-xs font-mono">
                    ({currentUser.email})
                  </span>
                )}
              </>
            )}
          </div>

          {/* Right Controls: Language, Help & Logout */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'bm' ? 'en' : 'bm')}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              title="Tukar Bahasa / Change Language"
            >
              {language === 'bm' ? 'BM 🇲🇾' : 'EN 🇬🇧'}
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center gap-1 transition cursor-pointer"
              title={isBm ? 'Pusat Bantuan' : 'Help Center'}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBm ? 'Bantuan' : 'Help'}</span>
            </button>

            {/* Logout Button (Ends session, returns to login screen) */}
            {currentUser && (
              <button
                type="button"
                onClick={onLogout}
                className="text-xs font-extrabold px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title={isBm ? 'Log keluar akaun' : 'Log out from this account'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isBm ? 'Log Keluar' : 'Log Out'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar: PASAR KITA Brand & Role-Specific Navigation Menu */}
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* PASAR KITA Branding */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-2xl bg-[#234e3f] text-white flex items-center justify-center font-display font-black text-xl shadow-xs">
            PK
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-display font-black text-2xl text-[#1e3f33] tracking-tight">
                PASAR KITA
              </span>
            </div>
            <p className="text-[11px] text-[#556960] font-semibold mt-0.5">
              {role === 'pengumpul' && (isBm ? 'Portal Pengumpul Komuniti' : 'Community Collector Portal')}
              {role === 'pembekal' && (isBm ? 'Portal Pembekal Fabrik' : 'Fabric Supplier Portal')}
              {role === 'pembeli' && (isBm ? 'Portal Pembeli & Usahawan' : 'Buyer & Maker Portal')}
              {!role && (isBm ? 'Platform Sisa Tekstil Komuniti' : 'Textile Waste Community Platform')}
            </p>
          </div>
        </div>

        {/* Role-Specific Navigation Menu (Shows ONLY items for the logged-in role) */}
        {navItems.length > 0 && (
          <nav
            aria-label="Role Navigation Menu"
            className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#f4eee6] rounded-2xl border border-[#e5dfd7] overflow-x-auto max-w-full"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-[#234e3f] text-white shadow-xs'
                      : 'text-[#40534C] hover:text-[#1e3f33] hover:bg-white/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#84cc16]' : 'text-[#6b7c73]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
