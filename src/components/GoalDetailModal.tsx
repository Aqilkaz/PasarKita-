import React from 'react';
import { AppLanguage } from '../types';
import { X, ArrowRight } from 'lucide-react';

interface GoalDetailModalProps {
  language: AppLanguage;
  onClose: () => void;
  onFindOpportunities: () => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  language,
  onClose,
  onFindOpportunities
}) => {
  const isBm = language === 'bm';

  const completedContributions = [
    { title: 'Kain Kapas', amount: '+RM18', place: 'Hotel Istana' },
    { title: 'Denim & Jins', amount: '+RM24', place: 'Kilang Cheras' },
    { title: 'Alas Meja', amount: '+RM20', place: 'Restoran Seri Pacific' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e8dfd5] my-auto space-y-6">
        <div className="flex items-center justify-between border-b border-[#e8dfd5] pb-3">
          <h2 className="font-display font-extrabold text-2xl text-[#1e3f33]">
            {isBm ? 'Sasaran Bulanan RM100' : 'Monthly Goal RM100'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#315f4f] hover:text-[#1e3f33] rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Display */}
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#e5dfd7] space-y-3 text-center">
          <div className="font-display font-black text-3xl sm:text-4xl text-[#1e3f33] tracking-tight">
            RM62 <span className="text-xl font-bold text-[#52796F]">/ RM100</span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#234e3f]">
            {isBm ? 'RM38 lagi untuk capai sasaran' : 'RM38 remaining to achieve goal'}
          </p>

          <div className="w-full bg-white rounded-full h-3 overflow-hidden p-0.5 border border-[#e5dfd7]">
            <div
              className="bg-[#60a103] h-full rounded-full transition-all duration-500"
              style={{ width: '62%' }}
            />
          </div>

          <p className="text-xs text-[#52796F] pt-1">
            {isBm
              ? '“Setiap kain yang diasingkan membantu mengurangkan sisa sambil menambah pendapatan.”'
              : '“Every sorted textile prevents landfill waste and increases your household income.”'}
          </p>
        </div>

        {/* Completed list */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-xs text-[#1e3f33] uppercase tracking-wider">
            {isBm ? 'Sumbangan Tugasan Siap:' : 'Completed Task Contributions:'}
          </h3>

          <div className="space-y-2 text-xs sm:text-sm">
            {completedContributions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#eef5f1] text-[#234e3f] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <strong className="text-[#1e3f33] block font-bold">{item.title}</strong>
                    <span className="text-[11px] text-[#52796F]">{item.place}</span>
                  </div>
                </div>
                <span className="font-black text-[#234e3f]">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onFindOpportunities();
          }}
          className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
        >
          <span>{isBm ? 'Cari Peluang Tambahan' : 'Find More Opportunities'}</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
