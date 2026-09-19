import React, { useState } from 'react';
import { FabricType, FabricCondition, AppLanguage } from '../types';
import { CheckCircle2, ArrowRight, Edit3, Sparkles } from 'lucide-react';

interface ListingPreviewModalProps {
  language: AppLanguage;
  data: {
    fabricType: FabricType;
    condition: FabricCondition;
    quantityPieces: number;
    notes?: string;
    photoUrl: string;
  };
  onEdit: () => void;
  onConfirmListing: () => void;
  onGoToHome: () => void;
}

export const ListingPreviewModal: React.FC<ListingPreviewModalProps> = ({
  language,
  data,
  onEdit,
  onConfirmListing,
  onGoToHome
}) => {
  const isBm = language === 'bm';
  const [isConfirmed, setIsConfirmed] = useState(false);

  const pricePerPiece = data.fabricType === 'Denim' ? 4.5 : data.fabricType === 'Polyester' ? 3.5 : 5.0;
  const totalEst = Math.round(data.quantityPieces * pricePerPiece);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirmListing();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-[#e8dfd5] my-auto">
        {!isConfirmed ? (
          <div className="p-6 sm:p-7 space-y-5">
            <div>
              <span className="text-[11px] font-bold text-[#234e3f] uppercase tracking-wider block">
                {isBm ? 'Langkah 4: Pratonton Senarai' : 'Step 4: Listing Preview'}
              </span>
              <h2 className="font-display font-extrabold text-2xl text-[#1e3f33] mt-0.5">
                Kain {data.fabricType} ({data.quantityPieces} pcs)
              </h2>
              <p className="text-xs text-[#52796F] font-semibold mt-0.5">
                {isBm ? `Keadaan: ${data.condition}` : `Condition: ${data.condition}`}
              </p>
            </div>

            {/* Set Selling Price */}
            <div className="bg-[#FAF8F5] border border-[#234e3f]/20 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block text-[#234e3f]">
                  {isBm ? 'Harga Jualan Pembeli:' : 'Buyer Listing Price:'}
                </span>
                <span className="font-display font-extrabold text-lg text-[#1e3f33]">
                  RM{pricePerPiece.toFixed(2)}/{isBm ? 'helai' : 'pc'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#52796F] font-medium block">
                  {isBm ? 'Jumlah Nilai Jualan' : 'Total Listing Value'}
                </span>
                <span className="font-display font-black text-2xl text-[#234e3f]">
                  RM{totalEst}
                </span>
              </div>
            </div>

            {/* Photo Preview */}
            <div className="h-40 w-full rounded-2xl overflow-hidden border border-[#e5dfd7]">
              <img
                src={data.photoUrl}
                alt="Fabric to list"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-center pt-1">
              <h3 className="font-display font-extrabold text-lg text-[#1e3f33]">
                {isBm ? 'Sahkan Maklumat Senarai Ini?' : 'Confirm This Listing?'}
              </h3>
              <p className="text-xs text-[#40534C] mt-0.5">
                {isBm
                  ? 'Kain akan disenaraikan ke pasaran pembeli PasarKita secara automatik.'
                  : 'Fabric will be listed to the PasarKita buyer marketplace automatically.'}
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full bg-[#60a103] hover:bg-[#528c02] active:scale-[0.99] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
              >
                <span>{isBm ? 'Ya, Senaraikan Sekarang' : 'Yes, List Now'}</span>
                <CheckCircle2 className="w-5 h-5 text-white" />
              </button>

              <button
                type="button"
                onClick={onEdit}
                className="w-full py-2.5 text-center text-xs font-bold text-[#315f4f] hover:text-[#1e3f33] rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isBm ? 'Ubah Semula' : 'Edit Again'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Post-Confirmation Screen */
          <div className="p-7 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#eef5f1] text-[#234e3f] mx-auto flex items-center justify-center shadow-xs border border-[#234e3f]/20">
              <Sparkles className="w-9 h-9 text-[#60a103]" />
            </div>

            <div>
              <h2 className="font-display font-extrabold text-2xl text-[#1e3f33]">
                {isBm ? 'Kain Anda Sudah Disenaraikan! 🎉' : 'Your Fabric is Listed! 🎉'}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#40534C] mt-2 leading-relaxed">
                {isBm
                  ? 'PasarKita akan memadankan senarai ini dengan pembeli kraf berdekatan tanpa anda perlu tawar-menawar.'
                  : 'PasarKita will match this listing with nearby craft buyers without the need for manual negotiations.'}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#e5dfd7] text-left text-xs space-y-1 text-[#315f4f]">
              <p className="font-bold text-[#1e3f33] text-sm">Status:</p>
              <p>✓ Kain sedia di pasaran pembeli PasarKita</p>
              <p>✓ Notifikasi automatik kepada pembeli kraf berdekatan</p>
              <p>✓ Anggaran pendapatan: ~RM{totalEst}</p>
            </div>

            <button
              type="button"
              onClick={onGoToHome}
              className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
            >
              <span>{isBm ? 'Kembali ke Dashboard' : 'Back to Dashboard'}</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
