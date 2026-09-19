import React, { useState } from 'react';
import { Transaction, AppLanguage } from '../types';
import { ArrowDownLeft, CheckCircle2, X, Wallet, Building2, CreditCard } from 'lucide-react';

interface EarningsViewProps {
  language: AppLanguage;
  transactions: Transaction[];
  onWithdrawSuccess: (amount: number) => void;
  userProfile?: import('../types').UserProfile;
}

export const EarningsView: React.FC<EarningsViewProps> = ({
  language,
  transactions,
  onWithdrawSuccess,
  userProfile
}) => {
  const isBm = language === 'bm';
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState('Bank Simpanan Nasional (BSN)');
  const [accountNumber, setAccountNumber] = useState('1410-0293-8812');
  const [isSuccess, setIsSuccess] = useState(false);

  const availableBalance = 124.50;
  const thisMonth = 124.50;
  const pending = 32.00;
  const totalEarned = 386.50;

  const handleConfirmWithdraw = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onWithdrawSuccess(availableBalance);
      setIsWithdrawOpen(false);
      setIsSuccess(false);
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      <div className="pt-1">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1e3f33]">
          {isBm ? 'Pendapatan Saya' : 'My Earnings'}
        </h1>
        <p className="text-xs sm:text-sm text-[#40534C] mt-0.5">
          {isBm ? 'Dompet sifar modal anda di PasarKita.' : 'Your zero-capital earnings wallet on PasarKita.'}
        </p>
      </div>

      {/* Wallet Card */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 shadow-xs border border-[#e5dfd7] space-y-5">
        <div>
          <span className="text-xs font-bold text-[#234e3f] uppercase tracking-wider block">
            {isBm ? 'Boleh Dikeluarkan' : 'Available for Withdrawal'}
          </span>
          <div className="font-display font-black text-4xl sm:text-5xl text-[#1e3f33] mt-1 tracking-tight">
            RM{availableBalance.toFixed(2)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsWithdrawOpen(true)}
          className="w-full bg-[#60a103] hover:bg-[#528c02] active:scale-[0.99] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
        >
          <ArrowDownLeft className="w-5 h-5 text-white" />
          <span>{isBm ? 'Keluarkan Wang ke Akaun Bank' : 'Withdraw to Bank Account'}</span>
        </button>

        {/* 3 Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e5dfd7] text-center">
          <div className="bg-white p-3 rounded-2xl border border-[#e5dfd7]">
            <span className="text-[11px] text-[#52796F] font-bold block">
              {isBm ? 'Bulan Ini' : 'This Month'}
            </span>
            <span className="font-display font-black text-base text-[#1e3f33] mt-0.5 block">
              RM{thisMonth.toFixed(2)}
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#e5dfd7]">
            <span className="text-[11px] text-[#52796F] font-bold block">
              {isBm ? 'Sedang Diproses' : 'Pending'}
            </span>
            <span className="font-display font-black text-base text-[#234e3f] mt-0.5 block">
              RM{pending.toFixed(0)}
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#e5dfd7]">
            <span className="text-[11px] text-[#52796F] font-bold block">
              {isBm ? 'Jumlah Terkumpul' : 'Total Earned'}
            </span>
            <span className="font-display font-black text-base text-[#1e3f33] mt-0.5 block">
              RM{totalEarned.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-3 pt-1">
        <h2 className="font-display font-extrabold text-lg text-[#1e3f33]">
          {isBm ? 'Riwayat Bayaran Masuk' : 'Earnings History'}
        </h2>

        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-[#e5dfd7] flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#1e3f33]">
                  {tx.title}
                </h3>
                <p className="text-xs text-[#52796F]">
                  {tx.date} · <span className="text-[#234e3f] font-bold">{tx.status}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-lg text-[#234e3f]">
                  + RM{tx.amount.toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Dialog */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e8dfd5] space-y-5">
            {!isSuccess ? (
              <>
                <div className="flex items-center justify-between border-b border-[#e8dfd5] pb-3">
                  <h3 className="font-display font-extrabold text-xl text-[#1e3f33]">
                    {isBm ? 'Keluarkan Wang Pendapatan' : 'Withdraw Earnings'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsWithdrawOpen(false)}
                    className="p-1.5 text-[#315f4f] hover:text-[#1e3f33] rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-[#FAF8F5] border border-[#234e3f]/20 p-4 rounded-2xl text-center">
                  <span className="text-xs font-bold text-[#234e3f] uppercase tracking-wider block">
                    {isBm ? 'Jumlah Pengeluaran' : 'Withdrawal Amount'}
                  </span>
                  <div className="font-display font-black text-3xl text-[#1e3f33] mt-0.5">
                    RM{availableBalance.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-bold text-[#315f4f] mb-1">
                      {isBm ? 'Pilih Bank / E-Dompet:' : 'Select Bank / E-Wallet:'}
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#FAF8F5] font-semibold text-[#1e3f33] focus:border-[#234e3f] focus:outline-none"
                    >
                      <option value="Bank Simpanan Nasional (BSN)">Bank Simpanan Nasional (BSN)</option>
                      <option value="Maybank (Malayan Banking)">Maybank</option>
                      <option value="CIMB Bank">CIMB Bank</option>
                      <option value="Touch 'n Go eWallet">Touch 'n Go eWallet (DuitNow)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#315f4f] mb-1">
                      {isBm ? 'Nombor Akaun Penerima:' : 'Recipient Account Number:'}
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#FAF8F5] font-semibold text-[#1e3f33] focus:border-[#234e3f] focus:outline-none"
                    />
                    <span className="text-[11px] text-[#52796F] mt-1 block">
                      {isBm ? `Nama akaun berdaftar: ${userProfile?.name || 'Pengguna'} (Disahkan Komuniti)` : `Registered name: ${userProfile?.name || 'User'} (Verified Community)`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmWithdraw}
                  className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition cursor-pointer touch-target"
                >
                  {isBm ? 'Sahkan Pengeluaran Segera' : 'Confirm Instant Withdrawal'}
                </button>
              </>
            ) : (
              <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#eef5f1] text-[#234e3f] mx-auto flex items-center justify-center border border-[#234e3f]/20">
                  <CheckCircle2 className="w-10 h-10 text-[#60a103]" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#1e3f33]">
                  {isBm ? 'Permohonan Berjaya Dihantar!' : 'Withdrawal Successful!'}
                </h3>
                <p className="text-xs sm:text-sm text-[#40534C]">
                  {isBm
                    ? `RM${availableBalance.toFixed(2)} sedang dipindahkan ke ${selectedBank}.`
                    : `RM${availableBalance.toFixed(2)} is being transferred to ${selectedBank}.`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
