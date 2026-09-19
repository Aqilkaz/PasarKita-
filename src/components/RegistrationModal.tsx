import React, { useState } from 'react';
import { AppLanguage, AppRole } from '../types';
import { X, Check, ArrowRight, User, Phone, MapPin } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onGoToAuth: (targetRole: 'collector' | 'supplier' | 'buyer') => void;
  onViewHowItWorks: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  language,
  onGoToAuth,
  onViewHowItWorks
}) => {
  const isBm = language === 'bm';
  const [selectedRole, setSelectedRole] = useState<'collector' | 'supplier' | 'buyer'>('collector');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e5dfd7] text-[#1E2923] relative animate-in fade-in zoom-in-95 duration-200 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#eef5f1] text-[#1E2923]/70 hover:text-[#1E2923] flex items-center justify-center border border-[#e5dfd7] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#eef5f1] text-[#234e3f] flex items-center justify-center mx-auto text-2xl shadow-xs">
            👋
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1e3f33]">
            {isBm ? 'Pilih Peranan Anda di PasarKita' : 'Choose Your Role on PasarKita'}
          </h2>
          <p className="text-xs sm:text-sm text-[#40534C] max-w-sm mx-auto">
            {isBm
              ? 'Platform PasarKita memisahkan peranan untuk memberi pengalaman yang tepat bagi setiap pengguna.'
              : 'PasarKita separates user roles to provide a dedicated, verified experience for everyone.'}
          </p>
        </div>

        {/* 3 Role Options */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setSelectedRole('collector')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition relative flex items-start gap-3.5 cursor-pointer ${
              selectedRole === 'collector'
                ? 'bg-[#eef5f1] border-[#234e3f] shadow-xs'
                : 'bg-[#FAF8F5] border-[#e5dfd7] hover:border-[#234e3f]/40'
            }`}
          >
            <span className="text-3xl">👩</span>
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[#1e3f33]">
                  {isBm ? 'Pengumpul Komuniti B40' : 'B40 Community Collector'}
                </h3>
                <span className="bg-[#234e3f] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {isBm ? 'Utama' : 'Main'}
                </span>
              </div>
              <p className="text-xs text-[#52796F] mt-1 leading-relaxed">
                {isBm
                  ? 'Kumpul sisa fabrik, asingkan di rumah, dan tambah pendapatan tanpa modal.'
                  : 'Collect fabric scraps, sort at home, and earn flexible income with zero capital.'}
              </p>
            </div>
            {selectedRole === 'collector' && (
              <div className="absolute right-4 top-5 w-5 h-5 rounded-full bg-[#234e3f] text-white flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('supplier')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition relative flex items-start gap-3.5 cursor-pointer ${
              selectedRole === 'supplier'
                ? 'bg-[#eef5f1] border-[#234e3f] shadow-xs'
                : 'bg-[#FAF8F5] border-[#e5dfd7] hover:border-[#234e3f]/40'
            }`}
          >
            <span className="text-3xl">🏢</span>
            <div className="flex-1 min-w-0 pr-6">
              <h3 className="font-extrabold text-sm text-[#1e3f33]">
                {isBm ? 'Pembekal Sisa Fabrik' : 'Fabric Waste Supplier'}
              </h3>
              <p className="text-xs text-[#52796F] mt-1 leading-relaxed">
                {isBm
                  ? 'Untuk kafe, restoran, hotel, kilang, pembekal uniform & kedai jahit.'
                  : 'For cafes, restaurants, hotels, factories, uniform suppliers & tailors.'}
              </p>
            </div>
            {selectedRole === 'supplier' && (
              <div className="absolute right-4 top-5 w-5 h-5 rounded-full bg-[#234e3f] text-white flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('buyer')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition relative flex items-start gap-3.5 cursor-pointer ${
              selectedRole === 'buyer'
                ? 'bg-[#eef5f1] border-[#234e3f] shadow-xs'
                : 'bg-[#FAF8F5] border-[#e5dfd7] hover:border-[#234e3f]/40'
            }`}
          >
            <span className="text-3xl">🛍️</span>
            <div className="flex-1 min-w-0 pr-6">
              <h3 className="font-extrabold text-sm text-[#1e3f33]">
                {isBm ? 'Pembeli Fabrik Terpakai' : 'Reclaimed Fabric Buyer'}
              </h3>
              <p className="text-xs text-[#52796F] mt-1 leading-relaxed">
                {isBm
                  ? 'Beli bahan sisa fabrik yang telah diasingkan untuk kraf, upcycle, atau bengkel.'
                  : 'Source pre-sorted fabric for upcycling, crafts, and commercial use.'}
              </p>
            </div>
            {selectedRole === 'buyer' && (
              <div className="absolute right-4 top-5 w-5 h-5 rounded-full bg-[#234e3f] text-white flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </button>
        </div>

        {/* Action Button */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToAuth(selectedRole);
            }}
            className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
          >
            <span>{isBm ? 'Teruskan Pendaftaran Peranan Ini' : 'Continue With This Role'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onViewHowItWorks();
            }}
            className="w-full py-2.5 text-center text-xs font-bold text-[#52796F] hover:text-[#1e3f33] transition"
          >
            {isBm ? 'Lihat Cara PasarKita Berfungsi' : 'See How PasarKita Works'}
          </button>
        </div>
      </div>
    </div>
  );
};
