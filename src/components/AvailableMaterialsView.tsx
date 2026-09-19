import React, { useState } from 'react';
import { DiscardedMaterial, AppLanguage } from '../types';
import {
  Layers,
  Search,
  Building2,
  Package,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  Tag
} from 'lucide-react';

interface AvailableMaterialsViewProps {
  language: AppLanguage;
  materials: DiscardedMaterial[];
  onClaimItem: (material: DiscardedMaterial) => void;
  onGoToClaimed: () => void;
  claimedCount: number;
}

export const AvailableMaterialsView: React.FC<AvailableMaterialsViewProps> = ({
  language,
  materials,
  onClaimItem,
  onGoToClaimed,
  claimedCount
}) => {
  const isBm = language === 'bm';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [justClaimedId, setJustClaimedId] = useState<string | null>(null);

  const categories = ['Semua', 'Kapas', 'Denim', 'Linen', 'Polyester', 'Campuran', 'Sutera'];

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materialType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' ||
      item.materialType.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleClaim = (material: DiscardedMaterial) => {
    setJustClaimedId(material.id);
    onClaimItem(material);
    setTimeout(() => {
      setJustClaimedId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#e5dfd7] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#234e3f]/10 text-[#234e3f]">
              <Layers className="w-3.5 h-3.5" />
              <span>{isBm ? 'Hub Fabrik & Bahan Buangan' : 'Fabric Hub & Discarded Materials'}</span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#1e3f33]">
              {isBm ? 'Bahan Tersedia untuk Dituntut' : 'Available Materials to Claim'}
            </h2>
            <p className="text-xs sm:text-sm text-[#52796F] max-w-xl">
              {isBm
                ? 'Tuntut sisa fabrik berkualiti daripada hotel, restoran, dan kilang secara percuma. Anda boleh mentransformasi bahan ini menjadi produk kraf atau menjualnya semula.'
                : 'Claim quality fabric discards from hotels, restaurants, and factories for free. Transform them into handcrafted products or resell them directly.'}
            </p>
          </div>

          {/* Quick link to Claimed Items */}
          <button
            type="button"
            onClick={onGoToClaimed}
            className="flex items-center gap-2 bg-[#234e3f] hover:bg-[#1a3b30] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer touch-target"
          >
            <span>{isBm ? 'Bahan Dituntut Saya' : 'My Claimed Items'}</span>
            <span className="w-5 h-5 rounded-full bg-lime-400 text-[#1e3f33] font-black text-[11px] flex items-center justify-center">
              {claimedCount}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search and category filters */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBm ? 'Cari bahan, sumber hotel, kain...' : 'Search materials, sources, fabrics...'}
              className="w-full bg-white pl-9 pr-4 py-2.5 rounded-xl border border-[#e5dfd7] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#234e3f] text-[#1e3f33]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#234e3f] text-white'
                    : 'bg-white border border-[#e5dfd7] text-[#40534C] hover:bg-[#f2eee9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#52796F] font-bold px-1">
          <span>
            {isBm
              ? `Menunjukkan ${filteredMaterials.length} bahan sedia dituntut`
              : `Showing ${filteredMaterials.length} available materials`}
          </span>
          <span className="text-[#234e3f] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-lime-600" />
            {isBm ? 'Sifar Modal (Percuma)' : 'Zero Capital (Free to Claim)'}
          </span>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#e5dfd7] space-y-3">
            <Package className="w-12 h-12 text-[#52796F] mx-auto opacity-50" />
            <h3 className="font-bold text-sm text-[#1e3f33]">
              {isBm ? 'Tiada bahan ditemui' : 'No materials found'}
            </h3>
            <p className="text-xs text-[#52796F]">
              {isBm ? 'Cuba ubah carian kata kunci atau kategori anda.' : 'Try changing your search terms or category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => {
              const isClaimed = mat.status !== 'available';
              const isJustClaimed = justClaimedId === mat.id;

              return (
                <div
                  key={mat.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e5dfd7] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#234e3f]/40 transition"
                >
                  {/* Item Image & Badges */}
                  <div className="space-y-3">
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-stone-100">
                      <img
                        src={mat.photoUrl}
                        alt={mat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-[#1e3f33]/90 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-1 rounded-lg">
                          {mat.materialType}
                        </span>
                        <span className="bg-lime-400 text-[#1e3f33] text-[11px] font-black px-2.5 py-1 rounded-lg shadow-2xs">
                          {isBm ? 'Percuma' : 'Free'}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                        📦 {mat.quantityAvailable} {mat.unit || 'helai'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-[#1e3f33] leading-snug">
                        {mat.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-[#234e3f] font-bold">
                        <Building2 className="w-3.5 h-3.5 text-[#52796F] shrink-0" />
                        <span className="truncate">{mat.source}</span>
                      </div>

                      <p className="text-xs text-[#40534C] line-clamp-2 leading-relaxed">
                        {mat.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="pt-3 border-t border-[#f0eae1] flex items-center justify-between gap-3">
                    <div className="text-[11px] text-[#52796F]">
                      <span className="font-bold text-[#1e3f33] block">
                        {mat.quantityAvailable} {mat.unit || 'helai'}
                      </span>
                      <span>{isBm ? 'Kuantiti Tersedia' : 'Available Stock'}</span>
                    </div>

                    {isJustClaimed ? (
                      <div className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 animate-in fade-in duration-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>{isBm ? 'Berjaya Dituntut!' : 'Claimed!'}</span>
                      </div>
                    ) : isClaimed ? (
                      <button
                        type="button"
                        onClick={onGoToClaimed}
                        className="bg-[#FAF8F5] text-[#234e3f] border border-[#234e3f]/30 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#234e3f]" />
                        <span>{isBm ? 'Telah Dituntut' : 'Claimed (View)'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleClaim(mat)}
                        className="bg-[#234e3f] hover:bg-[#1a3b30] active:scale-[0.98] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer touch-target"
                      >
                        <span>{isBm ? 'Tuntut Bahan' : 'Claim Item'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
