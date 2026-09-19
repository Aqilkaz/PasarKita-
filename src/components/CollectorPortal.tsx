import React, { useState, useMemo } from 'react';
import {
  Opportunity,
  ActiveCollection,
  Transaction,
  UserProfile,
  AppLanguage,
  DiscardedMaterial,
  ClaimedItem,
  BankAccount,
  WithdrawalRecord
} from '../types';
import {
  Scissors,
  MapPin,
  Package,
  History,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Truck,
  Building2,
  Wallet,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Layers,
  PackageCheck
} from 'lucide-react';
import { OpportunitiesView } from './OpportunitiesView';
import { ProfileView } from './ProfileView';
import { AvailableMaterialsView } from './AvailableMaterialsView';
import { ClaimedItemsView } from './ClaimedItemsView';
import { SellerEarningsView } from './SellerEarningsView';

export type CollectorTab =
  | 'materials'
  | 'claimed'
  | 'earnings'
  | 'opportunities'
  | 'nearby'
  | 'tasks'
  | 'history'
  | 'profile';

interface CollectorPortalProps {
  language: AppLanguage;
  userProfile?: UserProfile;
  activeTab?: CollectorTab;
  onSelectTab: (tab: CollectorTab) => void;
  opportunities: Opportunity[];
  activeCollection: ActiveCollection | null;
  transactions: Transaction[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onOpenGoal: () => void;
  onOpenSorting: () => void;
  onOpenBuyerNotification: () => void;
  onOpenPaymentNotification: () => void;
  onRequestEnableLocation: () => void;
  onWithdrawSuccess: (amount: number) => void;
  onOpenHelp: () => void;
  onUpdateCollectionStep?: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
  // Discarded & Claimed Materials props
  discardedMaterials?: DiscardedMaterial[];
  claimedItems?: ClaimedItem[];
  onClaimItem?: (material: DiscardedMaterial) => void;
  onTransformProduct?: (
    item: ClaimedItem,
    productData: {
      name: string;
      description: string;
      photos: string[];
      category: string;
      sellingPrice: number;
      quantity: number;
      materialsUsed: string;
    }
  ) => void;
  onResellItem?: (
    item: ClaimedItem,
    resellData: {
      name: string;
      description: string;
      photos: string[];
      price: number;
      quantity: number;
    }
  ) => void;
  // Bank and Real Earnings props
  availableBalance?: number;
  pendingBalance?: number;
  totalWithdrawn?: number;
  bankAccounts?: BankAccount[];
  withdrawalHistory?: WithdrawalRecord[];
  onAddBankAccount?: (bank: Omit<BankAccount, 'id'>) => void;
  onEditBankAccount?: (id: string, updated: Partial<BankAccount>) => void;
  onDeleteBankAccount?: (id: string) => void;
  onSetDefaultBankAccount?: (id: string) => void;
  onExecuteWithdrawal?: (record: Omit<WithdrawalRecord, 'id'>) => void;
  onViewInMarketplace?: () => void;
}

export const CollectorPortal: React.FC<CollectorPortalProps> = ({
  language,
  userProfile,
  activeTab = 'materials',
  onSelectTab,
  opportunities,
  activeCollection,
  transactions,
  onSelectOpportunity,
  onOpenGoal,
  onOpenSorting,
  onOpenBuyerNotification,
  onOpenPaymentNotification,
  onRequestEnableLocation,
  onWithdrawSuccess,
  onOpenHelp,
  onUpdateCollectionStep,
  discardedMaterials = [],
  claimedItems = [],
  onClaimItem = () => {},
  onTransformProduct = () => {},
  onResellItem = () => {},
  availableBalance = 124.50,
  pendingBalance = 32.00,
  totalWithdrawn = 130.00,
  bankAccounts = [],
  withdrawalHistory = [],
  onAddBankAccount = () => {},
  onEditBankAccount = () => {},
  onDeleteBankAccount = () => {},
  onSetDefaultBankAccount = () => {},
  onExecuteWithdrawal = () => {},
  onViewInMarketplace
}) => {
  const isBm = language === 'bm';
  const collectorName = userProfile?.name || 'Aqil';
  const isVerified = userProfile?.b40Status === 'verified';
  const isLocationEnabled = !!userProfile?.location && userProfile.locationPermissionStatus === 'granted';

  // State for Nearby Fabric filter
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(10);
  const [nearbyCategory, setNearbyCategory] = useState<string>('Semua');

  // Filtered nearby opportunities
  const nearbyOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        const withinDistance = opp.distanceKm <= maxDistanceKm;
        const matchesCategory =
          nearbyCategory === 'Semua' || opp.fabricWasteCategory.toLowerCase().includes(nearbyCategory.toLowerCase());
        return withinDistance && matchesCategory;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [opportunities, maxDistanceKm, nearbyCategory]);

  // Completed sales transactions (only earned type)
  const completedSales = useMemo(() => {
    return transactions.filter((t) => t.type !== 'withdrawn');
  }, [transactions]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Role Portal Header */}
      <div className="bg-gradient-to-br from-[#1e3f33] to-[#2a5948] rounded-3xl p-5 sm:p-7 text-white shadow-md border border-[#3b6d5b] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase text-white shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-lime-300" />
            <span>{isBm ? 'Portal Wanita & Usahawan Tekstil' : 'Women & Artisan Seller Portal'}</span>
          </div>

          <div className="flex items-center gap-2">
            {isLocationEnabled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isBm ? 'GPS Aktif' : 'GPS Active'}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onRequestEnableLocation}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30 hover:bg-amber-400/30 transition cursor-pointer"
              >
                <span>📍</span>
                <span>{isBm ? 'Aktifkan GPS' : 'Enable GPS'}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded-xl text-emerald-200 border border-emerald-400/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-300" />
              <span>{isBm ? 'Pengumpul Disahkan' : 'Verified Seller'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Greeting */}
        <div className="space-y-1">
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
            Hello, {collectorName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-medium">
            📍 {userProfile?.area || 'PPR Pantai Dalam, Kuala Lumpur'} · {isBm ? 'Tuntut bahan sisa percuma, hasilkan produk, dan jana pendapatan sebenar.' : 'Claim free discarded materials, transform or resell, and receive real sales earnings.'}
          </p>
        </div>

        {/* Navigation Tabs Bar for Women / Sellers */}
        <div className="pt-2 flex items-center gap-2 border-t border-white/15 overflow-x-auto">
          {/* TAB 1: FABRIC HUB / AVAILABLE MATERIALS */}
          <button
            type="button"
            onClick={() => onSelectTab('materials')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'materials'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-lime-400" />
            <span>{isBm ? 'Hub Fabrik (Bahan Tersedia)' : 'Fabric Hub (Available Materials)'}</span>
            <span className="w-4 h-4 rounded-full bg-lime-400 text-[#1e3f33] text-[10px] font-black flex items-center justify-center">
              {discardedMaterials.length}
            </span>
          </button>

          {/* TAB 2: MY CLAIMED ITEMS */}
          <button
            type="button"
            onClick={() => onSelectTab('claimed')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'claimed'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>{isBm ? 'Bahan Dituntut Saya' : 'My Claimed Items'}</span>
            {claimedItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-amber-950 text-[10px] font-black">
                {claimedItems.length}
              </span>
            )}
          </button>

          {/* TAB 3: EARNINGS & BANK ACCOUNT */}
          <button
            type="button"
            onClick={() => onSelectTab('earnings')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'earnings' || activeTab === 'history'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-lime-400" />
            <span>{isBm ? 'Pendapatan & Bank' : 'Earnings & Bank'}</span>
            <span className="bg-lime-400/20 text-lime-200 border border-lime-400/40 px-1.5 py-0.2 rounded-md text-[10px] font-bold">
              RM{availableBalance.toFixed(0)}
            </span>
          </button>

          {/* TAB 4: COLLECTION OPPORTUNITIES */}
          <button
            type="button"
            onClick={() => onSelectTab('opportunities')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'opportunities'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>{isBm ? 'Peluang Kutipan' : 'Opportunities'}</span>
          </button>

          {/* TAB 5: MY TASKS */}
          <button
            type="button"
            onClick={() => onSelectTab('tasks')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{isBm ? 'Tugasan Saya' : 'My Tasks'}</span>
            {activeCollection && (
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            )}
          </button>

          {/* TAB 6: PROFILE */}
          <button
            type="button"
            onClick={() => onSelectTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isBm ? 'Profil Saya' : 'My Profile'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: AVAILABLE MATERIALS / FABRIC HUB */}
      {/* ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <AvailableMaterialsView
            language={language}
            materials={discardedMaterials}
            onClaimItem={onClaimItem}
            onGoToClaimed={() => onSelectTab('claimed')}
            claimedCount={claimedItems.length}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: MY CLAIMED ITEMS (TRANSFORM / RESELL) */}
      {/* ========================================================================= */}
      {activeTab === 'claimed' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <ClaimedItemsView
            language={language}
            claimedItems={claimedItems}
            onTransformProduct={onTransformProduct}
            onResellItem={onResellItem}
            onGoToFabricHub={() => onSelectTab('materials')}
            onViewInMarketplace={onViewInMarketplace}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SELLER EARNINGS & BANK ACCOUNTS (ACTUAL SALES ONLY) */}
      {/* ========================================================================= */}
      {(activeTab === 'earnings' || activeTab === 'history') && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <SellerEarningsView
            language={language}
            availableBalance={availableBalance}
            pendingBalance={pendingBalance}
            totalWithdrawn={totalWithdrawn}
            completedSales={completedSales}
            bankAccounts={bankAccounts}
            withdrawalHistory={withdrawalHistory}
            onAddBankAccount={onAddBankAccount}
            onEditBankAccount={onEditBankAccount}
            onDeleteBankAccount={onDeleteBankAccount}
            onSetDefaultBankAccount={onSetDefaultBankAccount}
            onExecuteWithdrawal={onExecuteWithdrawal}
            userProfile={userProfile}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: COLLECTION OPPORTUNITIES */}
      {/* ========================================================================= */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <OpportunitiesView
            opportunities={opportunities}
            language={language}
            onSelectOpportunity={onSelectOpportunity}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: NEARBY FABRIC MAP & LIST */}
      {/* ========================================================================= */}
      {activeTab === 'nearby' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#e5dfd7] shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-black text-xl text-[#1e3f33]">
                  {isBm ? 'Peta Fabrik Berdekatan' : 'Nearby Fabric Map'}
                </h2>
                <p className="text-xs text-[#52796F]">
                  {isBm
                    ? 'Lihat sisa tekstil yang tersedia dalam lingkungan jarak anda.'
                    : 'Locate available textile discards within your travel perimeter.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1e3f33]">
                  {isBm ? 'Jarak Maksimum:' : 'Max Distance:'} {maxDistanceKm} km
                </span>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="accent-[#234e3f] w-28 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-3xl p-5 border border-[#e5dfd7] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#234e3f]/40 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#234e3f] bg-[#eef5f1] px-2.5 py-0.5 rounded-md">
                        {opp.supplierType}
                      </span>
                      <h3 className="font-display font-bold text-base text-[#1e3f33] mt-1">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-[#52796F] font-semibold">{opp.supplierName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#234e3f] flex items-center gap-1 justify-end">
                        <MapPin className="w-3.5 h-3.5 text-[#234e3f]" />
                        <span>{opp.distanceKm} km</span>
                      </span>
                      {opp.distanceKm <= 5 && (
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {isBm ? 'Penghantaran Percuma' : 'Free Delivery'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#40534C] pt-1 border-t border-[#f0eae1]">
                    <div>
                      <span className="text-[#52796F] block">{isBm ? 'Kuantiti:' : 'Quantity:'}</span>
                      <strong className="text-[#1e3f33]">{opp.quantityPieces} helai ({opp.estWeightKg} kg)</strong>
                    </div>
                    <div>
                      <span className="text-[#52796F] block">{isBm ? 'Kos Bahan:' : 'Material Cost:'}</span>
                      <strong className="text-emerald-700 font-bold">{opp.materialPriceType}</strong>
                    </div>
                    <div>
                      <span className="text-[#52796F] block">{isBm ? 'Tarikh Had:' : 'Deadline:'}</span>
                      <strong className="text-[#1e3f33]">{opp.deadline}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#e5dfd7] flex items-center justify-between gap-3">
                  <span className="text-xs text-[#52796F] truncate max-w-[200px]">
                    📍 {opp.supplierAddress}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectOpportunity(opp)}
                    className="px-4 py-2 bg-[#234e3f] hover:bg-[#1a3d31] text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{isBm ? 'Ambil Peluang' : 'Claim Job'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: MY COLLECTION TASKS & STEP PROGRESSION */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {activeCollection ? (
            <div className="bg-white rounded-3xl p-6 border border-[#e5dfd7] shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5dfd7] pb-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {isBm ? 'Tugasan Aktif Sedang Berjalan' : 'Active Collection Task in Progress'}
                  </span>
                  <h2 className="font-display font-black text-xl text-[#1e3f33] mt-1.5">
                    {activeCollection.fabricType}
                  </h2>
                  <p className="text-xs text-[#52796F] font-semibold">
                    🏢 {activeCollection.supplierName || 'Hotel Istana Kuala Lumpur'} · 📦 {activeCollection.quantityPieces} helai (~{activeCollection.weightKg} kg)
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#52796F] block">{isBm ? 'Status Kos:' : 'Cost Status:'}</span>
                  <span className="font-display font-black text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                    {isBm ? 'Sifar Modal (Percuma)' : 'Zero Capital (Free)'}
                  </span>
                </div>
              </div>

              {/* 6-Step Visual Progression */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm text-[#1e3f33]">
                  {isBm ? 'Status Kemajuan Pengurusan Fabrik:' : 'Textile Management Steps:'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                  {[
                    { step: 1, label: isBm ? '1. Diterima' : '1. Accepted' },
                    { step: 2, label: isBm ? '2. Diambil' : '2. Collected' },
                    { step: 3, label: isBm ? '3. Diasingkan' : '3. Sorted' },
                    { step: 4, label: isBm ? '4. Disenarai' : '4. Listed' },
                    { step: 5, label: isBm ? '5. Dijual' : '5. Matched' },
                    { step: 6, label: isBm ? '6. Selesai' : '6. Paid' }
                  ].map((s) => {
                    const isDone = activeCollection.currentStep >= s.step;
                    const isCurrent = activeCollection.currentStep === s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => onUpdateCollectionStep?.(s.step as 1 | 2 | 3 | 4 | 5 | 6)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer text-left sm:text-center ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-[#FAF8F5] border-[#e5dfd7] text-[#40534C]'
                        } ${isCurrent ? 'ring-2 ring-emerald-500 font-black' : ''}`}
                      >
                        <div className="flex items-center justify-between sm:justify-center gap-1">
                          <span>{s.label}</span>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons for Tasks */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenSorting}
                  className="flex-1 py-3 px-4 bg-[#234e3f] hover:bg-[#1a3d31] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <Scissors className="w-4 h-4 text-lime-400" />
                  <span>{isBm ? 'Asingkan & Senaraikan Kain' : 'Sort & List Fabric'}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenBuyerNotification}
                  className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-sm rounded-2xl flex items-center gap-2 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{isBm ? 'Padanan Pembeli' : 'Check Buyer Match'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-[#e5dfd7] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-lg text-[#1e3f33]">
                  {isBm ? 'Tiada Tugasan Aktif Buat Masa Ini' : 'No Active Collection Tasks'}
                </h3>
                <p className="text-xs text-[#52796F] max-w-md mx-auto">
                  {isBm
                    ? 'Sila buka tab Hub Fabrik atau Peluang Kutipan untuk menuntut bahan baharu.'
                    : 'Open the Fabric Hub or Opportunities tab to claim materials.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('materials')}
                className="px-5 py-2.5 bg-[#234e3f] hover:bg-[#1a3d31] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-2xs"
              >
                {isBm ? 'Buka Hub Fabrik' : 'Open Fabric Hub'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: COLLECTOR PROFILE & B40 STATUS */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <ProfileView
            language={language}
            userProfile={userProfile}
            onGoToEarnings={() => onSelectTab('earnings')}
            onOpenHelp={onOpenHelp}
          />
        </div>
      )}
    </div>
  );
};
