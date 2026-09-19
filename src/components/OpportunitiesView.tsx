import React, { useState } from 'react';
import { Opportunity, AppLanguage, FabricWasteType, SupplierType } from '../types';
import { SlidersHorizontal, ChevronRight, X, Sparkles, MapPin, Truck, Gift } from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  language: AppLanguage;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  language,
  onSelectOpportunity
}) => {
  const isBm = language === 'bm';
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [selectedDistance, setSelectedDistance] = useState<number>(20);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<'all' | 'free_only'>('all');

  // Filter opportunities
  const filtered = opportunities.filter((opp) => {
    const matchType =
      selectedType === 'Semua' ||
      opp.title.toLowerCase().includes(selectedType.toLowerCase()) ||
      opp.fabricWasteCategory.toLowerCase().includes(selectedType.toLowerCase());
    const matchDistance = opp.distanceKm <= selectedDistance;
    const matchPrice =
      selectedPriceFilter === 'all' || opp.materialPriceType === 'Percuma';

    return matchType && matchDistance && matchPrice;
  });

  return (
    <div className="space-y-4 pb-12 max-w-xl mx-auto">
      {/* Header & Filter Toggle */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#1e3f33]">
            {isBm ? 'Peluang Kutipan Fabrik' : 'Fabric Opportunities'}
          </h1>
          <p className="text-xs sm:text-sm text-[#40534C] mt-0.5 font-medium">
            {filtered.length} {isBm ? 'peluang sedia untuk diambil' : 'opportunities ready for pickup'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FAF8F5] border border-[#234e3f]/25 text-[#1e3f33] font-extrabold text-xs sm:text-sm shadow-2xs hover:bg-[#eef5f1] transition touch-target"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#234e3f]" />
          <span>{isBm ? 'Tapis' : 'Filter'}</span>
          {(selectedType !== 'Semua' || selectedDistance < 20 || selectedPriceFilter !== 'all') && (
            <span className="w-2 h-2 rounded-full bg-[#60a103]" />
          )}
        </button>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedPriceFilter(selectedPriceFilter === 'free_only' ? 'all' : 'free_only')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border flex items-center gap-1.5 transition ${
            selectedPriceFilter === 'free_only'
              ? 'bg-[#234e3f] text-white border-[#234e3f]'
              : 'bg-white text-[#315f4f] border-[#e5dfd7]'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>{isBm ? 'Bahan Percuma Sahaja' : 'Free Fabrics Only'}</span>
        </button>

        {['Semua', 'Kapas', 'Denim', 'Alas Meja', 'Uniform'].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setSelectedType(chip)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition ${
              selectedType === chip
                ? 'bg-[#234e3f] text-white border-[#234e3f]'
                : 'bg-white text-[#315f4f] border-[#e5dfd7]'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-3xl p-8 text-center border border-[#e5dfd7] space-y-3">
            <p className="text-sm text-[#40534C] font-semibold">
              {isBm ? 'Tiada peluang yang sepadan dengan tapisan ini.' : 'No opportunities matched your filter criteria.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('Semua');
                setSelectedDistance(20);
                setSelectedPriceFilter('all');
              }}
              className="px-4 py-2 bg-[#60a103] text-white font-bold rounded-xl text-xs"
            >
              {isBm ? 'Set Semula Tapisan' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          filtered.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl p-5 shadow-xs border border-[#e5dfd7] hover:border-[#234e3f] transition space-y-3.5"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#234e3f] bg-[#eef5f1] px-2.5 py-0.5 rounded-md">
                      {opp.supplierType}
                    </span>
                    {opp.materialPriceType === 'Percuma' && (
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        <span>{isBm ? 'Bahan Percuma' : 'Free Material'}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-[#1e3f33] mt-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-[#52796F] font-semibold">
                    {opp.supplierName} · {opp.fabricWasteCategory}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-[#52796F] font-bold block">
                    {isBm ? 'Kos Bahan:' : 'Material Cost:'}
                  </span>
                  <span className="font-display font-black text-lg text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 inline-block">
                    {opp.materialPriceType === 'Percuma' ? (isBm ? 'Percuma' : 'Free') : `RM${opp.materialPriceAmount || 0}`}
                  </span>
                </div>
              </div>

              {/* Grid 4 essential items */}
              <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-[#e5dfd7] text-xs font-semibold text-[#315f4f]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#234e3f]" />
                  <span>{opp.distanceKm} km {isBm ? 'dari anda' : 'from you'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>📦</span>
                  <span>{opp.quantityPieces} {isBm ? 'helai (pcs)' : 'pcs'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#234e3f]" />
                  <span>
                    {opp.distanceKm <= 5
                      ? (isBm ? 'Hantar percuma (≤5km)' : 'Free delivery (≤5km)')
                      : (isBm ? 'Penghantaran ikut jarak' : 'Delivery per distance')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>📅</span>
                  <span>{opp.deadline}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectOpportunity(opp)}
                className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer touch-target"
              >
                <span>{isBm ? 'Lihat Perincian & Ambil' : 'View Details & Collect'}</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#e5dfd7] space-y-5">
            <div className="flex items-center justify-between border-b border-[#e5dfd7] pb-3">
              <h3 className="font-display font-extrabold text-xl text-[#1e3f33]">
                {isBm ? 'Tapis Peluang' : 'Filter Opportunities'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 text-[#315f4f] hover:text-[#1e3f33] rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Distance Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider">
                {isBm ? 'Jarak Maksimum' : 'Maximum Distance'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {[5, 10, 20].map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => setSelectedDistance(dist)}
                    className={`py-2.5 rounded-xl border transition ${
                      selectedDistance === dist
                        ? 'bg-[#234e3f] text-white border-[#234e3f]'
                        : 'bg-[#FAF8F5] text-[#315f4f] border-[#e5dfd7]'
                    }`}
                  >
                    {dist} km
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider">
                {isBm ? 'Harga Bahan' : 'Material Price'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedPriceFilter('all')}
                  className={`py-2.5 rounded-xl border transition ${
                    selectedPriceFilter === 'all'
                      ? 'bg-[#234e3f] text-white border-[#234e3f]'
                      : 'bg-[#FAF8F5] text-[#315f4f] border-[#e5dfd7]'
                  }`}
                >
                  {isBm ? 'Semua Harga' : 'All Prices'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPriceFilter('free_only')}
                  className={`py-2.5 rounded-xl border transition ${
                    selectedPriceFilter === 'free_only'
                      ? 'bg-[#234e3f] text-white border-[#234e3f]'
                      : 'bg-[#FAF8F5] text-[#315f4f] border-[#e5dfd7]'
                  }`}
                >
                  🎁 {isBm ? 'Percuma Sahaja' : 'Free Only'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition"
            >
              {isBm ? 'Gunakan Tapisan' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
