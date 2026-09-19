import React from 'react';
import { Opportunity, ActiveCollection, AppLanguage, UserProfile } from '../types';
import { ArrowRight, ChevronRight, CheckCircle2, Sparkles, ShieldCheck, Clock, AlertCircle, MapPin, Navigation } from 'lucide-react';

interface B40HomeViewProps {
  language: AppLanguage;
  userProfile?: UserProfile;
  opportunities: Opportunity[];
  activeCollection: ActiveCollection | null;
  onSelectOpportunity: (opp: Opportunity) => void;
  onGoToOpportunities: () => void;
  onOpenGoal: () => void;
  onOpenSorting: () => void;
  onOpenBuyerNotification: () => void;
  onOpenPaymentNotification: () => void;
  onOpenVerificationModal?: () => void;
  onRequestEnableLocation?: () => void;
}

export const B40HomeView: React.FC<B40HomeViewProps> = ({
  language,
  userProfile,
  opportunities,
  activeCollection,
  onSelectOpportunity,
  onGoToOpportunities,
  onOpenGoal,
  onOpenSorting,
  onOpenBuyerNotification,
  onOpenPaymentNotification,
  onOpenVerificationModal,
  onRequestEnableLocation
}) => {
  const isBm = language === 'bm';
  const nearbySlice = opportunities.slice(0, 2);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'belum_diambil':
        return {
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          text: isBm ? '🟡 Belum diambil' : '🟡 Not collected yet'
        };
      case 'sudah_diambil':
      case 'diasingkan':
      case 'disenaraikan':
        return {
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          text: isBm ? '🔵 Sedang diproses' : '🔵 In progress'
        };
      case 'ada_pembeli':
        return {
          color: 'bg-purple-100 text-purple-900 border-purple-300',
          text: isBm ? '🟣 Ada Pembeli!' : '🟣 Buyer Matched!'
        };
      case 'sudah_dijual':
      case 'selesai':
      default:
        return {
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          text: isBm ? '🟢 Selesai' : '🟢 Completed'
        };
    }
  };

  const currentStatusInfo = activeCollection ? getStatusBadge(activeCollection.status) : null;
  const isVerified = userProfile?.b40Status === 'verified';
  const isLocationEnabled = !!userProfile?.location && userProfile.locationPermissionStatus === 'granted';

  return (
    <div className="space-y-5 pb-12 max-w-xl mx-auto">
      {/* 1. Greeting & Location Status Indicator Bar */}
      <div className="pt-2 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1e3f33] tracking-tight">
              Hello, {userProfile?.name || 'Pengguna'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#40534C] mt-0.5 font-medium">
              {isBm
                ? 'Kumpul fabrik terpakai, asingkan dengan mudah, dan tambah pendapatan.'
                : 'Collect discarded textiles, sort easily at home, and earn extra income.'}
            </p>
          </div>

          {/* Location Status Indicator */}
          <div className="shrink-0 text-right">
            {isLocationEnabled ? (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs"
                title="Location permission is active"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Location enabled</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onRequestEnableLocation}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition cursor-pointer shadow-2xs"
                title="Tap to enable location"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Location not enabled</span>
              </button>
            )}
          </div>
        </div>

        {/* Approximate Location Notice (Protects exact coordinates) */}
        {isLocationEnabled && (
          <div className="flex items-center gap-1.5 text-xs text-[#315f4f] bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#e5dfd7]">
            <MapPin className="w-3.5 h-3.5 text-[#234e3f] shrink-0" />
            <span className="font-semibold text-[#1e3f33]">
              {isBm ? 'Lokasi anggaran anda:' : 'Your approximate location:'}
            </span>
            <span className="text-[#52796F] truncate">
              {userProfile?.location?.approximateArea || userProfile?.area || 'Lembah Pantai / Bangsar South Area'}
            </span>
            <span className="text-[10px] text-[#234e3f] bg-[#eef5f1] px-1.5 py-0.5 rounded font-bold ml-auto shrink-0">
              {isBm ? 'Privasi dilindungi' : 'Privacy secured'}
            </span>
          </div>
        )}

        {/* Small Reminder if Location Not Enabled */}
        {!isLocationEnabled && (
          <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#e5dfd7] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#234e3f] shrink-0" />
              <span className="text-[#40534C] font-medium">
                {isBm
                  ? 'Aktifkan lokasi untuk mengira jarak tepat dan mencari sisa fabrik paling dekat.'
                  : 'Enable location to find fabric waste opportunities near you.'}
              </span>
            </div>
            <button
              type="button"
              onClick={onRequestEnableLocation}
              className="text-xs font-extrabold text-white bg-[#234e3f] hover:bg-[#1b3d31] px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer"
            >
              {isBm ? 'Aktifkan' : 'Enable'}
            </button>
          </div>
        )}
      </div>

      {/* B40 Eligibility Status Alert if not verified */}
      {userProfile && userProfile.b40Status !== 'verified' && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-950">
              {isBm ? 'Status Pengesahan Kelayakan B40' : 'B40 Eligibility Verification'}
            </h4>
            <p className="text-amber-800 mt-0.5">
              {isBm
                ? 'Akaun anda dalam semakan status SARA/STR. Anda boleh terus meneroka peluang sekitar anda.'
                : 'Your account status is in review. You may still browse opportunities nearby.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Goal Card (Sasaran Bulan Ini) */}
      <div
        onClick={onOpenGoal}
        className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border-2 border-[#e5dfd7] hover:border-[#234e3f] transition cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#234e3f]" />
            <h2 className="font-display font-bold text-base sm:text-lg text-[#1e3f33]">
              {isBm ? 'Sasaran Bulan Ini' : 'This Month’s Goal'}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#234e3f] bg-[#eef5f1] px-2.5 py-1 rounded-full border border-[#234e3f]/20">
            {isBm ? 'Perincian' : 'Details'}
          </span>
        </div>

        {/* Large Amount */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl sm:text-4xl font-black text-[#1e3f33] tracking-tight">
            RM62
          </span>
          <span className="text-lg font-bold text-[#40534C]/70">/ RM100</span>
        </div>

        <p className="text-xs sm:text-sm font-bold text-[#234e3f] mt-1">
          {isBm ? 'RM38 lagi untuk capai sasaran anda' : 'RM38 remaining to reach your goal'}
        </p>

        {/* Visual Progress Bar */}
        <div className="mt-3.5 w-full bg-[#FAF8F5] rounded-full h-3 overflow-hidden p-0.5 border border-[#e5dfd7]">
          <div
            className="bg-[#60a103] h-full rounded-full transition-all duration-500"
            style={{ width: '62%' }}
          />
        </div>

        {/* Action Button: Cari Peluang */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onGoToOpportunities();
          }}
          className="mt-5 w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
        >
          <span>{isBm ? 'Cari Peluang Fabrik' : 'Find Fabric Opportunities'}</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 3. Koleksi Saya (Active Collection Pipeline) */}
      {activeCollection && (
        <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 shadow-xs border border-[#e5dfd7] space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#52796F] uppercase tracking-wider">
                {isBm ? 'Koleksi Sedang Berjalan' : 'Active Collection'}
              </span>
              <h3 className="font-display font-extrabold text-lg text-[#1e3f33] mt-0.5">
                {activeCollection.fabricType} · {activeCollection.quantityPieces} {isBm ? 'helai (pcs)' : 'pcs'}
              </h3>
              <p className="text-xs text-[#52796F]">
                {activeCollection.collectionMethod === 'delivery'
                  ? (isBm ? `Penghantaran (${activeCollection.deliveryFee === 0 ? 'Percuma' : `Caj RM${activeCollection.deliveryFee.toFixed(2)}`})` : `Delivery (${activeCollection.deliveryFee === 0 ? 'Free' : `Fee RM${activeCollection.deliveryFee.toFixed(2)}`})`)
                  : (isBm ? 'Ambil Sendiri (Percuma)' : 'Self Pickup (Free)')}
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentStatusInfo?.color}`}>
              {currentStatusInfo?.text}
            </span>
          </div>

          {/* 6-step progress timeline */}
          <div className="pt-2 pb-1">
            <p className="text-xs font-bold text-[#315f4f] mb-2 uppercase tracking-wide">
              {isBm ? 'Perjalanan 6 Langkah Anda:' : 'Your 6-Step Journey:'}
            </p>
            <div className="grid grid-cols-6 gap-1 text-center">
              {[
                { step: 1, label: isBm ? 'Diterima' : 'Accepted' },
                { step: 2, label: isBm ? 'Diambil' : 'Collected' },
                { step: 3, label: isBm ? 'Diasing' : 'Sorted' },
                { step: 4, label: isBm ? 'Disenarai' : 'Listed' },
                { step: 5, label: isBm ? 'Dijual' : 'Sold' },
                { step: 6, label: isBm ? 'Dibayar' : 'Paid' }
              ].map((item) => {
                const isCompleted = activeCollection.currentStep > item.step;
                const isCurrent = activeCollection.currentStep === item.step;

                return (
                  <div key={item.step} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition ${
                        isCompleted
                          ? 'bg-[#234e3f] text-white'
                          : isCurrent
                          ? 'bg-[#60a103] text-white ring-4 ring-lime-100 shadow-sm'
                          : 'bg-white text-[#40534C]/50 border border-[#e5dfd7]'
                      }`}
                    >
                      {isCompleted ? '✓' : item.step}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] mt-1 line-clamp-1 leading-tight ${
                        isCurrent
                          ? 'font-extrabold text-[#234e3f]'
                          : isCompleted
                          ? 'font-bold text-[#1e3f33]'
                          : 'text-[#40534C]/50'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step guidance action card */}
          <div className="bg-white rounded-2xl p-4 border border-[#e5dfd7] space-y-3">
            <div>
              <span className="text-[11px] font-bold text-[#234e3f] uppercase tracking-wider block">
                {isBm ? 'Langkah Tindakan Anda:' : 'Your Action Step:'}
              </span>
              <h4 className="font-display font-extrabold text-base text-[#1e3f33] mt-0.5">
                {activeCollection.currentStep === 1 && (isBm ? '1. Pergi ambil kain di lokasi' : '1. Collect fabric at location')}
                {activeCollection.currentStep === 2 && (isBm ? '2. Bawa pulang kain untuk diasingkan' : '2. Bring fabric home for sorting')}
                {activeCollection.currentStep === 3 && (isBm ? '3. Asingkan kain mengikut kualiti & jenis' : '3. Sort fabric by quality & type')}
                {activeCollection.currentStep === 4 && (isBm ? '4. Kain sedang disenaraikan di pasaran' : '4. Fabric is listed on marketplace')}
                {activeCollection.currentStep === 5 && (isBm ? '5. Ada pembeli kraf berminat!' : '5. Craft buyer matched!')}
                {activeCollection.currentStep === 6 && (isBm ? '6. Bayaran RM18 sedia dikeluarkan' : '6. Payment RM18 ready for payout')}
              </h4>
              <p className="text-xs text-[#40534C] mt-1">
                {activeCollection.currentStep === 3 &&
                  (isBm
                    ? 'Asingkan kain mengikut jenis (kapas/denim) dan keadaan sebelum disenaraikan kepada pembeli.'
                    : 'Sort fabric by type and condition before publishing for buyers.')}
                {activeCollection.currentStep === 4 &&
                  (isBm
                    ? 'Kain anda sedang dipadankan secara automatik dengan pembeli kraf di PasarKita.'
                    : 'Your fabric is actively being matched with ready craft buyers on PasarKita.')}
                {activeCollection.currentStep === 5 &&
                  (isBm
                    ? 'EcoCraft Malaysia sedia membeli kain kapas yang telah anda asingkan.'
                    : 'EcoCraft Malaysia is ready to purchase your pre-sorted cotton fabric.')}
                {activeCollection.currentStep === 6 &&
                  (isBm
                    ? 'Bayaran RM18 telah disahkan dan masuk ke dalam akaun pendapatan anda.'
                    : 'Payment of RM18 is verified and added to your earnings account.')}
              </p>
            </div>

            {/* Direct Action button strictly tailored to step */}
            {activeCollection.currentStep === 3 && (
              <button
                type="button"
                onClick={onOpenSorting}
                className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer touch-target"
              >
                <span>{isBm ? 'Asingkan Kain Sekarang' : 'Sort Fabric Now'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            )}

            {activeCollection.currentStep === 4 && (
              <button
                type="button"
                onClick={onOpenBuyerNotification}
                className="w-full bg-[#234e3f] hover:bg-[#1b3d31] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer touch-target"
              >
                <Sparkles className="w-4 h-4 text-lime-300" />
                <span>{isBm ? 'Simulasi Ada Pembeli Berminat' : 'Simulate Buyer Match'}</span>
              </button>
            )}

            {activeCollection.currentStep === 5 && (
              <button
                type="button"
                onClick={onOpenBuyerNotification}
                className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer touch-target"
              >
                <span>{isBm ? 'Lihat Padanan Pembeli (RM18)' : 'View Buyer Match (RM18)'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            )}

            {activeCollection.currentStep === 6 && (
              <button
                type="button"
                onClick={onOpenPaymentNotification}
                className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer touch-target"
              >
                <span>{isBm ? 'Lihat Bayaran Diterima' : 'View Received Payment'}</span>
                <CheckCircle2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Nearby Fabric Section (Requested Card Layout: "20 kg Cotton Fabric", "5 km from you", "Available from a nearby supplier", "View Details") */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#1e3f33]">
              {isBm ? 'Peluang Fabrik Berdekatan' : 'Nearby Fabric Opportunities'}
            </h2>
            <p className="text-[11px] text-[#52796F]">
              {isLocationEnabled
                ? (isBm ? 'Disusun mengikut jarak paling dekat dengan anda' : 'Sorted by shortest distance from your location')
                : (isBm ? 'Jarak anggaran berdasarkan kawasan PPR Pantai Dalam' : 'Estimated distance based on Pantai Dalam area')}
            </p>
          </div>
          <span className="text-xs font-bold text-[#234e3f] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#e5dfd7] shrink-0">
            {opportunities.length} {isBm ? 'Tersedia' : 'Available'}
          </span>
        </div>

        <div className="space-y-3">
          {nearbySlice.map((opp) => {
            const formattedWeightTitle = opp.estWeightKg
              ? `${opp.estWeightKg} kg ${opp.title}`
              : opp.title;
            const formattedDistance = `${opp.distanceKm} km from you`;

            return (
              <div
                key={opp.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border-2 border-[#e5dfd7] hover:border-[#234e3f] transition space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Requested Card Element 1: "20 kg Cotton Fabric" */}
                    <h3 className="font-display font-black text-xl text-[#1e3f33] leading-snug">
                      {formattedWeightTitle}
                    </h3>

                    {/* Requested Card Element 2: "5 km from you" */}
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#234e3f]">
                      <MapPin className="w-4 h-4 text-[#234e3f] shrink-0" />
                      <span>{formattedDistance}</span>
                      {opp.distanceKm <= 5 && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full ml-1">
                          {isBm ? 'Penghantaran Percuma' : 'Free Delivery'}
                        </span>
                      )}
                    </div>

                    {/* Requested Card Element 3: "Available from a nearby supplier" */}
                    <p className="text-xs text-[#40534C] font-semibold">
                      Available from a nearby supplier
                    </p>

                    <p className="text-[11px] text-[#52796F]">
                      {opp.supplierName} ({opp.supplierType}) · {opp.materialPriceType === 'Percuma' ? (isBm ? 'Bahan Percuma' : 'Free Material') : opp.materialPriceType}
                    </p>
                  </div>

                  {/* Material Cost Badge */}
                  <div className="text-right shrink-0 bg-[#FAF8F5] p-3 rounded-2xl border border-[#e5dfd7] min-w-[90px]">
                    <span className="text-[10px] text-[#52796F] block font-bold uppercase tracking-wider">
                      {isBm ? 'Kos Bahan' : 'Material'}
                    </span>
                    <span className="font-display text-lg font-black text-[#234e3f] block">
                      {opp.materialPriceType === 'Percuma' ? (isBm ? 'Percuma' : 'Free') : `RM${opp.materialPriceAmount || 0}`}
                    </span>
                  </div>
                </div>

                {/* Requested Card Element 4: "View Details" */}
                <button
                  type="button"
                  onClick={() => onSelectOpportunity(opp)}
                  className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-sm sm:text-base py-3 px-4 rounded-2xl shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer touch-target active:scale-[0.99]"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onGoToOpportunities}
          className="w-full py-3 text-center text-xs sm:text-sm font-extrabold text-[#234e3f] hover:bg-[#FAF8F5] rounded-2xl transition border border-[#234e3f]/30 cursor-pointer"
        >
          {isBm ? 'Lihat Semua Peluang' : 'View All Opportunities'} →
        </button>
      </div>
    </div>
  );
};
