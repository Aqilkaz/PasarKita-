import React, { useState } from 'react';
import { AppLanguage, UserProfile } from '../types';
import { User, CheckCircle2, ChevronRight, Wallet, CreditCard, Bell, HelpCircle, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';

interface ProfileViewProps {
  language: AppLanguage;
  userProfile?: UserProfile;
  onGoToEarnings: () => void;
  onOpenHelp: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  language,
  userProfile,
  onGoToEarnings,
  onOpenHelp
}) => {
  const isBm = language === 'bm';
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'maklumat',
      title: isBm ? 'Maklumat & Status B40' : 'Information & B40 Status',
      desc: `${userProfile?.name || 'Pengguna'} · ${userProfile?.b40Status === 'verified' ? (isBm ? 'Disahkan' : 'Verified') : (isBm ? 'Menunggu' : 'Pending')}`,
      icon: <ShieldCheck className="w-5 h-5 text-[#234e3f]" />,
      action: () => setActiveModal('maklumat')
    },
    {
      id: 'pendapatan',
      title: isBm ? 'Dompet Pendapatan' : 'Earnings Wallet',
      desc: isBm ? 'Baki RM124.50' : 'Balance RM124.50',
      icon: <Wallet className="w-5 h-5 text-[#234e3f]" />,
      action: onGoToEarnings
    },
    {
      id: 'pembayaran',
      title: isBm ? 'Akaun Bank & DuitNow' : 'Bank & DuitNow Account',
      desc: 'Bank Simpanan Nasional (BSN)',
      icon: <CreditCard className="w-5 h-5 text-[#234e3f]" />,
      action: () => setActiveModal('pembayaran')
    },
    {
      id: 'notifikasi',
      title: isBm ? 'Tetapan Notifikasi' : 'Notification Settings',
      desc: isBm ? 'Pemberitahuan SMS & aplikasi' : 'SMS & app alerts',
      icon: <Bell className="w-5 h-5 text-[#234e3f]" />,
      action: () => setActiveModal('notifikasi')
    },
    {
      id: 'bantuan',
      title: isBm ? 'Bantuan & Sokongan' : 'Help & Support',
      desc: isBm ? 'Panduan dan talian komuniti' : 'Guides & community line',
      icon: <HelpCircle className="w-5 h-5 text-[#234e3f]" />,
      action: onOpenHelp
    }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      <div className="pt-1">
        <h1 className="font-display font-extrabold text-2xl text-[#1e3f33]">
          {isBm ? 'Profil Pengumpul B40' : 'B40 Collector Profile'}
        </h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e5dfd7] flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#eef5f1] text-[#234e3f] font-display font-black text-2xl flex items-center justify-center border-2 border-[#234e3f]/20 shrink-0 shadow-2xs">
          {userProfile?.name?.charAt(0) || 'U'}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#234e3f]">Hello, {userProfile?.name || 'Pengguna'}</p>
          <h2 className="font-display font-black text-2xl text-[#1e3f33] leading-tight">
            {userProfile?.name || 'Pengguna'}
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-[#eef5f1] text-[#234e3f] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#234e3f]/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#60a103]" />
            <span>
              {userProfile?.b40Status === 'verified'
                ? (isBm ? 'Pengumpul B40 Disahkan (SARA/STR)' : 'B40 Verified (SARA/STR)')
                : (isBm ? 'Pengesahan B40 Dalam Proses' : 'B40 Verification in Review')}
            </span>
          </div>
          <p className="text-xs text-[#52796F] flex items-center gap-1 pt-0.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#234e3f]" />
            <span>{userProfile?.area || 'PPR Pantai Dalam, Kuala Lumpur'}</span>
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xs border border-[#e5dfd7] divide-y divide-[#e5dfd7]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.action}
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#FAF8F5] transition text-left touch-target cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#e5dfd7] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <strong className="font-display font-bold text-base text-[#1e3f33] block">
                  {item.title}
                </strong>
                <span className="text-xs text-[#52796F] font-medium">{item.desc}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#52796F]" />
          </button>
        ))}
      </div>

      {/* Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 text-center border border-[#e8dfd5]">
            <h3 className="font-display font-bold text-xl text-[#1e3f33]">
              {activeModal === 'maklumat' && (isBm ? 'Pengesahan Status B40' : 'B40 Verification Status')}
              {activeModal === 'pembayaran' && (isBm ? 'Akaun Pembayaran' : 'Payout Account')}
              {activeModal === 'notifikasi' && (isBm ? 'Tetapan Notifikasi' : 'Notification Settings')}
            </h3>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl text-left text-xs sm:text-sm text-[#40534C] space-y-2 border border-[#e5dfd7]">
              {activeModal === 'maklumat' && (
                <>
                  <p><strong>{isBm ? 'Nama:' : 'Name:'}</strong> {userProfile?.name || 'Pengguna'}</p>
                  <p><strong>{isBm ? 'Telefon:' : 'Phone:'}</strong> {userProfile?.phone || '+6012-345 6789'}</p>
                  <p><strong>{isBm ? 'Status SARA:' : 'SARA Status:'}</strong> 🟢 {isBm ? 'Disahkan Layak' : 'Verified Eligible'}</p>
                  <p className="text-[11px] text-[#52796F]">
                    {isBm
                      ? 'Pautan semakan rasmi: MyKasih SARA Status Check'
                      : 'Official check: MyKasih SARA Status Check'}
                  </p>
                  <a
                    href="https://checkstatus.mykasih.net/sara2/checkstatus"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#234e3f] underline mt-1"
                  >
                    <span>{isBm ? 'Buka Laman MyKasih' : 'Open MyKasih Site'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
              {activeModal === 'pembayaran' && (
                <>
                  <p><strong>{isBm ? 'Bank:' : 'Bank:'}</strong> Bank Simpanan Nasional (BSN)</p>
                  <p><strong>{isBm ? 'No. Akaun:' : 'Account No:'}</strong> 1410-0293-8812</p>
                  <p><strong>{isBm ? 'Status Payout:' : 'Payout Status:'}</strong> Aktif</p>
                </>
              )}
              {activeModal === 'notifikasi' && (
                <>
                  <p>✓ <strong>Peluang Baru:</strong> SMS & WhatsApp Diaktifkan</p>
                  <p>✓ <strong>Padanan Pembeli:</strong> Segera</p>
                  <p>✓ <strong>Bayaran Masuk:</strong> SMS Bank</p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-[#60a103] hover:bg-[#528c02] text-white font-bold rounded-xl text-sm"
            >
              {isBm ? 'Tutup' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
