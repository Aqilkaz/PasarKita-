import React from 'react';
import { AppLanguage, UserRole, normalizeRole } from '../types';
import {
  Scissors,
  MapPin,
  Package,
  History,
  User,
  UploadCloud,
  ListFilter,
  Layers,
  ShoppingBag,
  Search,
  Bookmark,
  PackageCheck,
  Wallet
} from 'lucide-react';

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  language: AppLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role: rawRole,
  activeTab,
  onSelectTab,
  language
}) => {
  const isBm = language === 'bm';
  const role = normalizeRole(rawRole);

  const getNavItems = () => {
    if (role === 'pengumpul') {
      return [
        { id: 'materials', label: isBm ? 'Hub Fabrik' : 'Fabric Hub', icon: Layers },
        { id: 'claimed', label: isBm ? 'Dituntut' : 'Claimed', icon: PackageCheck },
        { id: 'earnings', label: isBm ? 'Pendapatan' : 'Earnings', icon: Wallet },
        { id: 'opportunities', label: isBm ? 'Peluang' : 'Jobs', icon: Scissors },
        { id: 'profile', label: isBm ? 'Profil' : 'Profile', icon: User }
      ];
    }

    if (role === 'pembekal') {
      return [
        { id: 'upload', label: isBm ? 'Muat Naik' : 'Upload', icon: UploadCloud },
        { id: 'listings', label: isBm ? 'Senarai' : 'Listings', icon: ListFilter },
        { id: 'available', label: isBm ? 'Bahan' : 'Materials', icon: Layers },
        { id: 'history', label: isBm ? 'Sejarah' : 'History', icon: History },
        { id: 'profile', label: isBm ? 'Profil' : 'Profile', icon: User }
      ];
    }

    if (role === 'pembeli') {
      return [
        { id: 'browse', label: isBm ? 'Teroka' : 'Browse', icon: ShoppingBag },
        { id: 'search', label: isBm ? 'Cari' : 'Search', icon: Search },
        { id: 'orders', label: isBm ? 'Pesanan' : 'Orders', icon: Package },
        { id: 'saved', label: isBm ? 'Disimpan' : 'Saved', icon: Bookmark },
        { id: 'profile', label: isBm ? 'Profil' : 'Profile', icon: User }
      ];
    }

    return [];
  };

  const navItems = getNavItems();
  if (navItems.length === 0) return null;

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8dfd5] shadow-lg pb-safe">
      <div className="max-w-md mx-auto px-1 flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 py-1.5 px-0.5 flex flex-col items-center justify-center gap-0.5 transition touch-target ${
                isActive
                  ? 'text-[#234e3f] font-extrabold'
                  : 'text-[#556960] hover:text-[#234e3f] font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition ${
                  isActive ? 'bg-[#eef5f1] text-[#234e3f]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight truncate max-w-[64px] text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
