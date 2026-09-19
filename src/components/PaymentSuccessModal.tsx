import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface PaymentSuccessModalProps {
  language: AppLanguage;
  amount?: number;
  onClose: () => void;
  onGoToEarnings: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  language,
  amount = 18,
  onClose,
  onGoToEarnings
}) => {
  const isBm = language === 'bm';
  const [isCredited, setIsCredited] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCredited(true);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e8dfd5] my-auto space-y-6 text-center">
        {/* Celebration Icon */}
        <div className="w-16 h-16 rounded-full bg-[#eef5f1] text-[#234e3f] mx-auto flex items-center justify-center shadow-xs border border-[#234e3f]/20">
          <CheckCircle2 className="w-10 h-10 text-[#60a103]" />
        </div>

        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1e3f33]">
            {isBm ? 'Kain Anda Sudah Terjual! 🎉' : 'Your Fabric is Sold! 🎉'}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#40534C] mt-1.5">
            {isBm ? 'Pendapatan yang diterima:' : 'Earnings received:'}
          </p>
          <div className="font-display font-black text-4xl sm:text-5xl text-[#234e3f] mt-1 tracking-tight">
            RM{amount}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="py-1">
          {!isCredited ? (
            <div className="bg-amber-50 text-amber-950 border border-amber-300 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold animate-pulse">
              <span>🟡</span>
              <span>{isBm ? 'Bayaran sedang dimasukkan...' : 'Crediting payment...'}</span>
            </div>
          ) : (
            <div className="bg-[#eef5f1] text-[#234e3f] border border-[#60a103] p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold animate-in zoom-in-95 duration-300">
              <span>🟢</span>
              <span>
                {isBm
                  ? `RM${amount} telah dikreditkan ke dompet anda`
                  : `RM${amount} added to your earnings wallet`}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onGoToEarnings}
            className="w-full bg-[#60a103] hover:bg-[#528c02] active:scale-[0.99] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
          >
            <span>{isBm ? 'Lihat Dompet Pendapatan' : 'View Earnings Wallet'}</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-center text-xs sm:text-sm font-semibold text-[#40534C] hover:text-[#1e3f33] transition"
          >
            {isBm ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
