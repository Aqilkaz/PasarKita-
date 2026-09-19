import React, { useState } from 'react';
import { FabricType, FabricCondition, AppLanguage } from '../types';
import { ArrowLeft, Camera, Minus, Plus, Check } from 'lucide-react';

interface SortingViewProps {
  language: AppLanguage;
  initialType?: FabricType;
  initialQuantity?: number;
  onBack: () => void;
  onComplete: (data: {
    fabricType: FabricType;
    condition: FabricCondition;
    quantityPieces: number;
    notes?: string;
    photoUrl: string;
  }) => void;
}

export const SortingView: React.FC<SortingViewProps> = ({
  language,
  initialType = 'Kapas',
  initialQuantity = 12,
  onBack,
  onComplete
}) => {
  const isBm = language === 'bm';

  const [selectedType, setSelectedType] = useState<FabricType>(initialType);
  const [selectedCondition, setSelectedCondition] = useState<FabricCondition>('Baik');
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [notes, setNotes] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(true);

  const defaultPhoto =
    selectedType === 'Denim'
      ? 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'
      : selectedType === 'Polyester'
      ? 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80';

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < 100) setQuantity(quantity + 1);
  };

  const handleFinish = () => {
    onComplete({
      fabricType: selectedType,
      condition: selectedCondition,
      quantityPieces: quantity,
      notes: notes.trim() || undefined,
      photoUrl: defaultPhoto
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-full bg-[#FAF8F5] border border-[#e5dfd7] text-[#1e3f33] hover:bg-[#eef5f1] transition touch-target"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#1e3f33]">
            {isBm ? 'Langkah 3: Asingkan Kain' : 'Step 3: Sort Fabric'}
          </h1>
          <p className="text-xs sm:text-sm text-[#40534C]">
            {isBm ? 'Asingkan fabrik mengikut jenis dan keadaan sebelum disenaraikan.' : 'Classify collected fabric before listing for buyers.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#e5dfd7] space-y-6">
        {/* 1. Fabric Type */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider">
            {isBm ? '1. Jenis Kain' : '1. Fabric Type'}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {(['Kapas', 'Denim', 'Polyester', 'Campuran', 'Lain-lain'] as FabricType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`py-3.5 px-4 rounded-2xl text-sm font-extrabold border-2 transition flex items-center justify-center gap-2 cursor-pointer touch-target ${
                  selectedType === type
                    ? 'bg-[#234e3f] text-white border-[#234e3f] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#40534C] border-[#e5dfd7] hover:border-[#234e3f]'
                }`}
              >
                <span>{type}</span>
                {selectedType === type && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Condition */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider">
            {isBm ? '2. Keadaan Kain' : '2. Fabric Condition'}
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            {(['Baik', 'Sederhana', 'Kurang baik'] as FabricCondition[]).map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setSelectedCondition(cond)}
                className={`py-3 px-2 rounded-xl border-2 transition cursor-pointer text-center ${
                  selectedCondition === cond
                    ? 'bg-[#234e3f] text-white border-[#234e3f] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#40534C] border-[#e5dfd7]'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Quantity Counter */}
        <div className="space-y-2 bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#e5dfd7]">
          <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider text-center">
            {isBm ? '3. Kuantiti Kain (Helai / Pieces):' : '3. Quantity (Pieces):'}
          </label>
          <div className="flex items-center justify-center gap-6 pt-1">
            <button
              type="button"
              onClick={handleDecrease}
              className="w-12 h-12 rounded-xl bg-white border border-[#e5dfd7] text-[#1e3f33] active:scale-95 flex items-center justify-center font-bold text-xl shadow-2xs cursor-pointer touch-target"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="min-w-[120px] text-center">
              <span className="font-display font-black text-3xl sm:text-4xl text-[#1e3f33]">
                {quantity}
              </span>
              <span className="block text-[11px] font-bold text-[#52796F]">
                {isBm ? 'helai (pcs)' : 'pieces'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleIncrease}
              className="w-12 h-12 rounded-xl bg-[#60a103] text-white active:scale-95 flex items-center justify-center font-bold text-xl shadow-2xs cursor-pointer touch-target"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4. Photo Capture */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider">
            {isBm ? '4. Foto Fabrik' : '4. Fabric Photo'}
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setPhotoCaptured(true)}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-[#234e3f] bg-[#FAF8F5] hover:bg-[#eef5f1] text-[#234e3f] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer touch-target"
            >
              <Camera className="w-5 h-5" />
              <span>{isBm ? '📷 Ambil / Tukar Gambar' : '📷 Take / Replace Photo'}</span>
            </button>

            {photoCaptured && (
              <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-[#e5dfd7]">
                <img
                  src={defaultPhoto}
                  alt="Fabric preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 right-2 bg-[#234e3f]/90 text-white text-[11px] px-2.5 py-0.5 rounded-lg font-bold">
                  ✓ {isBm ? 'Foto sedia' : 'Photo ready'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes (Optional) */}
        <div className="pt-1">
          {!showNoteInput ? (
            <button
              type="button"
              onClick={() => setShowNoteInput(true)}
              className="text-xs font-bold text-[#234e3f] underline"
            >
              + {isBm ? 'Tambah nota keadaan kain (pilihan)' : 'Add fabric note (optional)'}
            </button>
          ) : (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#315f4f]">
                {isBm ? 'Nota Keadaan Kain' : 'Fabric Condition Note'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isBm ? 'Contoh: Kain bersih, sudah dilipat rapi...' : 'e.g. Clean fabric, neatly folded...'}
                className="w-full p-2.5 rounded-xl border border-[#e5dfd7] bg-[#FAF8F5] text-xs text-[#1e3f33]"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Action Button: Selesai & Terus ke Pratonton */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-sm transition touch-target flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isBm ? 'Selesai & Pratonton Senarai' : 'Finish & Preview Listing'}</span>
            <Check className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
