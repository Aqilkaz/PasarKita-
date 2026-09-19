import React, { useState } from 'react';
import { Opportunity, AppLanguage, CollectionMethod } from '../types';
import { X, MapPin, Calendar, Building2, ArrowRight, Truck, Store, Gift, ShieldAlert, Sparkles } from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  language: AppLanguage;
  deliveryRatePerKm?: number;
  onClose: () => void;
  onAccept: (
    opportunity: Opportunity,
    collectionMethod: CollectionMethod,
    deliveryFee: number
  ) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  language,
  deliveryRatePerKm = 0.30,
  onClose,
  onAccept
}) => {
  if (!opportunity) return null;
  const isBm = language === 'bm';

  const [method, setMethod] = useState<CollectionMethod>('self_pickup');
  const [collectorDistanceKm, setCollectorDistanceKm] = useState<number>(opportunity.distanceKm);

  // Delivery calculation: Under 5 km free, over 5 km RM0.30/km
  const calculateDeliveryFee = (km: number) => {
    if (km <= 5) return 0;
    return Number(((km - 5) * deliveryRatePerKm).toFixed(2));
  };

  const deliveryFee = method === 'delivery' ? calculateDeliveryFee(collectorDistanceKm) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#e8dfd5] my-auto">
        {/* Photo Header with Badge */}
        <div className="relative h-48 sm:h-56 w-full bg-[#f8f4ee]">
          <img
            src={opportunity.photoUrl}
            alt={opportunity.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#234e3f] flex items-center justify-center shadow-md hover:bg-white transition touch-target"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-extrabold bg-[#234e3f]/90 px-3 py-1 rounded-full border border-white/20">
              {opportunity.supplierType}
            </span>
            <span className="text-xs font-extrabold bg-white/25 backdrop-blur-md px-3 py-1 rounded-full">
              {opportunity.fabricWasteCategory}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Title & Core Distinction Info */}
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[#1e3f33]">
              {opportunity.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-semibold text-[#40534C]">
              <span>{opportunity.quantityPieces} {isBm ? 'helai (pcs)' : 'pcs'}</span>
              <span>•</span>
              <span>{opportunity.distanceKm} km {isBm ? 'dari lokasi anda' : 'from your location'}</span>
              <span>•</span>
              <span>{opportunity.supplierName}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* THREE IMPORTANT SEPARATED THINGS MANDATED BY REQUIREMENTS:
              1. Material price (Free / RM amount / Negotiable)
              2. Collection method (Self-pickup / Delivery)
              3. Delivery fee (Free under 5 km / Distance-based fee above 5 km)
          {/* ========================================================================= */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-[#234e3f] uppercase tracking-wider block">
              {isBm ? '1. Harga Bahan Fabrik' : '1. Fabric Material Price'}
            </span>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#e5dfd7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#eef5f1] flex items-center justify-center text-lg">
                  {opportunity.materialPriceType === 'Percuma' ? '🎁' : '🏷️'}
                </div>
                <div>
                  <span className="font-extrabold text-sm text-[#1e3f33] block">
                    {opportunity.materialPriceType === 'Percuma'
                      ? (isBm ? 'Bahan Percuma' : 'Free Material')
                      : opportunity.materialPriceType === 'Boleh runding'
                      ? (isBm ? 'Boleh Runding' : 'Negotiable')
                      : `RM${opportunity.materialPriceAmount?.toFixed(2)}`}
                  </span>
                  <span className="text-xs text-[#52796F]">
                    {opportunity.freeConditionNotes ||
                      (isBm ? 'Diberikan secara percuma oleh pembekal' : 'Given away for free by supplier')}
                  </span>
                </div>
              </div>

              {/* Collector's Estimated Return from Sorting & Selling to Buyer */}
              <div className="text-right">
                <span className="text-[11px] text-[#52796F] block font-bold">
                  {isBm ? 'Anggaran Pendapatan Anda:' : 'Your Est. Earnings:'}
                </span>
                <span className="font-display font-black text-xl text-[#234e3f]">
                  RM{opportunity.estEarnings}
                </span>
              </div>
            </div>

            {/* Reassurance pill */}
            <div className="bg-[#eef5f1] p-2.5 rounded-xl border border-[#234e3f]/20 text-xs text-[#234e3f] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#60a103] shrink-0" />
              <span>
                {isBm
                  ? '“Bahan percuma tidak bermakna penghantaran percuma jika melebihi 5 km.”'
                  : '“Free fabric is separate from delivery fees if beyond 5 km.”'}
              </span>
            </div>
          </div>

          {/* Collection Method Selection */}
          <div className="space-y-2.5">
            <span className="text-xs font-extrabold text-[#234e3f] uppercase tracking-wider block">
              {isBm ? '2. Kaedah Pengambilan' : '2. Collection Method'}
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod('self_pickup')}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col items-start gap-1 cursor-pointer ${
                  method === 'self_pickup'
                    ? 'bg-[#eef5f1] border-[#234e3f] text-[#1e3f33] shadow-xs'
                    : 'bg-white border-[#e5dfd7] text-[#40534C] hover:border-[#234e3f]/40'
                }`}
              >
                <div className="flex items-center gap-1.5 font-extrabold text-sm">
                  <Store className="w-4 h-4 text-[#234e3f]" />
                  <span>{isBm ? 'Ambil Sendiri' : 'Self-Pickup'}</span>
                </div>
                <span className="text-xs text-[#52796F]">
                  {isBm ? 'Pergi ke lokasi pembekal' : 'Go directly to supplier'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('delivery')}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col items-start gap-1 cursor-pointer ${
                  method === 'delivery'
                    ? 'bg-[#eef5f1] border-[#234e3f] text-[#1e3f33] shadow-xs'
                    : 'bg-white border-[#e5dfd7] text-[#40534C] hover:border-[#234e3f]/40'
                }`}
              >
                <div className="flex items-center gap-1.5 font-extrabold text-sm">
                  <Truck className="w-4 h-4 text-[#234e3f]" />
                  <span>{isBm ? 'Minta Penghantaran' : 'Request Delivery'}</span>
                </div>
                <span className="text-xs text-[#52796F]">
                  {isBm ? 'Dihantar ke alamat anda' : 'Delivered to your address'}
                </span>
              </button>
            </div>
          </div>

          {/* Delivery Fee Calculator Breakdown */}
          <div className="space-y-2 bg-[#FAF8F5] p-4 rounded-2xl border border-[#e5dfd7]">
            <div className="flex items-center justify-between text-xs font-bold text-[#315f4f]">
              <span>{isBm ? '3. Caj Penghantaran:' : '3. Delivery Fee:'}</span>
              <span className="text-[#1e3f33] font-black text-sm">
                {method === 'self_pickup'
                  ? (isBm ? 'RM0.00 (Ambil Sendiri)' : 'RM0.00 (Self-Pickup)')
                  : deliveryFee === 0
                  ? (isBm ? 'PERCUMA (≤ 5 km)' : 'FREE (≤ 5 km)')
                  : `RM${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            {method === 'delivery' && (
              <div className="pt-2 border-t border-[#e5dfd7] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#52796F]">
                    {isBm ? 'Jarak ke rumah anda:' : 'Distance to your home:'}
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={collectorDistanceKm}
                      onChange={(e) => setCollectorDistanceKm(Number(e.target.value) || 1)}
                      className="w-16 p-1 text-center bg-white border border-[#e5dfd7] rounded font-bold"
                    />
                    <span className="font-bold">km</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#52796F] leading-tight">
                  {isBm
                    ? `Polisi Penghantaran: Bawah 5 km adalah PERCUMA. Setiap kilometer seterusnya dikenakan kadar permulaan RM${deliveryRatePerKm.toFixed(2)}/km.`
                    : `Delivery Policy: First 5 km is FREE. Subsequent kilometers charged at starting rate of RM${deliveryRatePerKm.toFixed(2)}/km.`}
                </p>
              </div>
            )}
          </div>

          {/* Details & Location */}
          <div className="space-y-2 text-xs text-[#315f4f]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#234e3f] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1e3f33] block text-xs">
                  {isBm ? 'Alamat Pengambilan:' : 'Pickup Address:'}
                </strong>
                <span>{opportunity.supplierAddress}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-[#234e3f] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1e3f33] block text-xs">
                  {isBm ? 'Tarikh Akhir Pengambilan:' : 'Collection Deadline:'}
                </strong>
                <span>{opportunity.deadline}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => onAccept(opportunity, method, deliveryFee)}
              className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-4 px-5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
            >
              <span>{isBm ? 'Saya Nak Ambil Peluang Ini' : 'I Want This Opportunity'}</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-center text-xs sm:text-sm font-semibold text-[#40534C] hover:text-[#1e3f33] transition"
            >
              {isBm ? 'Kembali' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
