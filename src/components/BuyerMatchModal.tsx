import React from 'react';
import { AppLanguage } from '../types';
import { Sparkles, ArrowRight, X, ShieldCheck } from 'lucide-react';

interface BuyerMatchModalProps {
  language: AppLanguage;
  onClose: () => void;
  onAcceptOrder: () => void;
}

export const BuyerMatchModal: React.FC<BuyerMatchModalProps> = ({
  language,
  onClose,
  onAcceptOrder
}) => {
  const isBm = language === 'bm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e8dfd5] my-auto space-y-5">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 bg-[#eef5f1] text-[#234e3f] px-3 py-1 rounded-full text-xs font-extrabold border border-[#234e3f]/20">
            <Sparkles className="w-4 h-4 text-[#60a103]" />
            <span>{isBm ? 'Berita Baik Untuk Anda!' : 'Great News For You!'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#315f4f] hover:text-[#1e3f33] rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[#1e3f33]">
            {isBm ? 'Ada Pembeli Berminat!' : 'You Have a Buyer Match!'}
          </h2>
          <p className="text-sm font-bold text-[#234e3f] mt-1">
            {isBm ? '“EcoCraft Studio mahu membeli kain anda.”' : '“EcoCraft Studio wants to purchase your fabric.”'}
          </p>
        </div>

        {/* Breakdown Card */}
        <div className="bg-[#FAF8F5] p-4.5 rounded-2xl border border-[#e5dfd7] space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between items-baseline border-b border-[#e5dfd7] pb-2">
            <span className="text-[#52796F] font-medium">{isBm ? 'Pembeli Memerlukan:' : 'Buyer Needs:'}</span>
            <strong className="text-[#1e3f33] font-bold">12 {isBm ? 'helai (pcs) kain kapas' : 'pcs cotton fabric'}</strong>
          </div>

          <div className="flex justify-between items-baseline border-b border-[#e5dfd7] pb-2">
            <span className="text-[#52796F] font-medium">{isBm ? 'Koleksi Anda:' : 'Your Collection:'}</span>
            <strong className="text-[#1e3f33] font-bold">12 {isBm ? 'helai (pcs) siap diasing' : 'pcs pre-sorted'}</strong>
          </div>

          <div className="flex justify-between items-baseline border-b border-[#e5dfd7] pb-2">
            <span className="text-[#52796F] font-medium">{isBm ? 'Nilai pesanan pembeli:' : 'Buyer Order Value:'}</span>
            <span className="text-[#40534C] font-semibold">RM60.00</span>
          </div>

          <div className="bg-white p-3 rounded-xl flex items-baseline justify-between border border-[#234e3f]/20">
            <span className="text-xs font-bold text-[#234e3f] uppercase tracking-wider">
              {isBm ? 'Pendapatan Bersih Anda:' : 'Your Net Earnings:'}
            </span>
            <span className="font-display font-black text-2xl text-[#1e3f33]">
              RM18.00
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#52796F] text-center font-medium">
          {isBm
            ? 'Tiada tawar-menawar diperlukan. PasarKita menjamin kadar bayaran tepat untuk kerja anda.'
            : 'No negotiations needed. PasarKita guarantees accurate pay for your sorting work.'}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onAcceptOrder}
          className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
        >
          <span>{isBm ? 'Sahkan Pesanan Pembeli (RM18)' : 'Confirm Buyer Order (RM18)'}</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
