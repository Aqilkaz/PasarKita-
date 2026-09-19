import React, { useState } from 'react';
import { Opportunity, AppLanguage, CollectionMethod } from '../types';
import { CheckCircle2, Navigation, Truck, Store, Calendar, MapPin, X } from 'lucide-react';

interface AcceptConfirmationModalProps {
  opportunity: Opportunity;
  language: AppLanguage;
  collectionMethod: CollectionMethod;
  deliveryFee: number;
  onCloseToHome: () => void;
}

export const AcceptConfirmationModal: React.FC<AcceptConfirmationModalProps> = ({
  opportunity,
  language,
  collectionMethod,
  deliveryFee,
  onCloseToHome
}) => {
  const isBm = language === 'bm';
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e8dfd5] my-auto space-y-6 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#eef5f1] text-[#234e3f] mx-auto flex items-center justify-center shadow-xs border border-[#234e3f]/20">
          <CheckCircle2 className="w-10 h-10 text-[#60a103]" />
        </div>

        {/* Title & Collection Notice */}
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[#1e3f33]">
            {isBm ? 'Peluang Ini Sudah Disimpan!' : 'Opportunity Successfully Saved!'}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#234e3f] mt-1.5">
            {collectionMethod === 'delivery'
              ? (isBm
                ? `Permintaan penghantaran telah dihantar. Dijangka tiba sebelum ${opportunity.deadline}.`
                : `Delivery request submitted. Expected before ${opportunity.deadline}.`)
              : (isBm
                ? `Sila ambil kain di lokasi sebelum ${opportunity.deadline}.`
                : `Please collect the fabric at location before ${opportunity.deadline}.`)}
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#e5dfd7] text-left space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5 text-[#315f4f]">
            <MapPin className="w-4 h-4 text-[#234e3f] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[#1e3f33]">
                {isBm ? 'Lokasi Pengambilan:' : 'Pickup Location:'}
              </span>
              <span className="text-xs text-[#40534C]">{opportunity.supplierAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[#315f4f]">
            <Calendar className="w-4 h-4 text-[#234e3f] shrink-0" />
            <div>
              <span className="font-bold text-[#1e3f33]">{isBm ? 'Tarikh:' : 'Date'}: </span>
              <span className="text-[#40534C]">{opportunity.deadline}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[#315f4f]">
            {collectionMethod === 'delivery' ? (
              <Truck className="w-4 h-4 text-[#234e3f] shrink-0" />
            ) : (
              <Store className="w-4 h-4 text-[#234e3f] shrink-0" />
            )}
            <div>
              <span className="font-bold text-[#1e3f33]">{isBm ? 'Kaedah:' : 'Method'}: </span>
              <span className="text-[#40534C]">
                {collectionMethod === 'delivery'
                  ? (isBm ? `Penghantaran (${deliveryFee === 0 ? 'Percuma' : `Caj RM${deliveryFee.toFixed(2)}`})` : `Delivery (${deliveryFee === 0 ? 'Free' : `Fee RM${deliveryFee.toFixed(2)}`})`)
                  : (isBm ? 'Ambil Sendiri (Percuma)' : 'Self-Pickup (Free)')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[#234e3f] bg-white border border-[#234e3f]/20 p-2.5 rounded-xl">
            <span className="text-base">✨</span>
            <div>
              <span className="font-bold">{isBm ? 'Kos Bahan Fabrik' : 'Material Cost'}: </span>
              <strong className="text-sm text-[#1e3f33]">{opportunity.materialPriceType === 'Percuma' ? (isBm ? 'Percuma (Sifar Modal)' : 'Free (Zero Capital)') : `RM${opportunity.materialPriceAmount || 0}`}</strong>
            </div>
          </div>
        </div>

        {/* Pickup Guide Accordion */}
        {showGuide && (
          <div className="bg-[#eef5f1] p-4 rounded-2xl border border-[#234e3f]/30 text-left space-y-2 animate-in fade-in duration-200 text-xs text-[#315f4f]">
            <h4 className="font-bold text-xs text-[#1e3f33] flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#234e3f]" />
              <span>{isBm ? 'Panduan Pengambilan Fabrik:' : 'Fabric Pickup Guidelines:'}</span>
            </h4>
            <p className="leading-relaxed text-[#40534C]">
              {opportunity.pickupNote}
            </p>
            <div className="pt-1">
              <span className="font-bold text-[#1e3f33] block">
                {isBm ? 'Waktu Pengambilan:' : 'Pickup Hours:'}
              </span>
              <span className="text-[#40534C]">10:00 AM – 4:30 PM (Isnin - Sabtu)</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
          >
            <Navigation className="w-4 h-4 text-white" />
            <span>
              {showGuide
                ? (isBm ? 'Tutup Panduan Ambil' : 'Hide Pickup Guide')
                : (isBm ? 'Lihat Cara Ambil' : 'View How to Collect')}
            </span>
          </button>

          <button
            type="button"
            onClick={onCloseToHome}
            className="w-full py-3 text-center text-xs sm:text-sm font-bold text-[#315f4f] hover:text-[#1e3f33] rounded-xl hover:bg-[#FAF8F5] transition"
          >
            {isBm ? 'Kembali ke Dashboard Utama' : 'Back to Main Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};
