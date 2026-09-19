import React, { useState } from 'react';
import { SupplierListing, AppLanguage, ListingPriceType, SupplierType, FabricWasteType, UserProfile } from '../types';
import {
  Building2,
  Plus,
  CheckCircle2,
  Camera,
  X,
  Truck,
  Gift,
  Coins,
  Store,
  Sliders,
  Settings2,
  Info,
  ShieldCheck,
  ListFilter,
  UserCheck,
  MapPin,
  FileText,
  Phone,
  Mail,
  Award,
  UploadCloud,
  Layers,
  History
} from 'lucide-react';

export type SupplierTab = 'upload' | 'listings' | 'available' | 'history' | 'profile' | 'overview';

interface SupplierPortalProps {
  language: AppLanguage;
  listings: SupplierListing[];
  deliveryRatePerKm: number;
  setDeliveryRatePerKm: (rate: number) => void;
  onAddListing: (newListing: SupplierListing) => void;
  userProfile?: UserProfile;
  activeSubTab?: SupplierTab;
  onNavigateSubTab?: (tab: SupplierTab) => void;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  language,
  listings,
  deliveryRatePerKm,
  setDeliveryRatePerKm,
  onAddListing,
  userProfile,
  activeSubTab = 'overview',
  onNavigateSubTab
}) => {
  const isBm = language === 'bm';
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfigSettings, setShowConfigSettings] = useState(false);

  React.useEffect(() => {
    if (activeSubTab === 'upload') {
      setIsFormOpen(true);
    }
  }, [activeSubTab]);

  // Form states
  const [sourceType, setSourceType] = useState<SupplierType>(userProfile?.businessType || 'Hotel');
  const [fabricType, setFabricType] = useState('Kain cadar & tuala hotel');
  const [wasteType, setWasteType] = useState<FabricWasteType>('Kain cadar / tuala');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(25);
  const [condition, setCondition] = useState('Baik');
  const [location, setLocation] = useState(userProfile?.area || 'Bukit Bintang, Kuala Lumpur');
  const [priceType, setPriceType] = useState<ListingPriceType>('Percuma');
  const [price, setPrice] = useState<number>(0);
  const [freeCondition, setFreeCondition] = useState('Perlu ambil sendiri atau tanggung kurier');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  const supplierName = userProfile?.name || 'Encik Razak (Hotel Istana KL)';
  const businessName = userProfile?.businessName || 'Hotel Istana Kuala Lumpur';
  const businessType = userProfile?.businessType || 'Hotel';
  const businessReg = userProfile?.businessRegNo || '201901034567 (1345678-X)';
  const businessAddress = userProfile?.address || 'No. 73, Jalan Raja Chulan, 50200 Kuala Lumpur';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: SupplierListing = {
      id: `SUP-${Date.now()}`,
      supplierName: businessName,
      sourceType,
      fabricType,
      wasteType,
      description: description || (isBm ? 'Sisa tekstil bersih dan siap diikat rapi.' : 'Clean textiles sorted and bundled.'),
      quantityPieces: quantity,
      condition,
      location,
      dateAvailable: isBm ? 'Hari ini' : 'Today',
      priceType,
      price: priceType === 'Berbayar' ? Number(price) : 0,
      freeCondition: priceType === 'Percuma' ? freeCondition : undefined,
      deliveryAvailable,
      status: 'Menunggu pengumpul'
    };

    onAddListing(newListing);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsFormOpen(false);
      // Reset form
      setDescription('');
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      {/* Supplier Identity Banner */}
      <div className="bg-[#18392e] text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-extrabold text-white">
            <Building2 className="w-4 h-4 text-lime-300" />
            <span>{isBm ? 'Portal Pembekal Fabrik' : 'Supplier Fabric Portal'}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-teal-950/80 px-2.5 py-1 rounded-xl text-teal-200 border border-teal-400/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>{isBm ? 'Pembekal Sah' : 'Verified Supplier'}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigSettings(!showConfigSettings)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold transition cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{isBm ? 'Kadar Penghantaran' : 'Delivery Rate'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
            Hello, {supplierName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-medium">
            🏢 {businessName} ({businessType}) · 📍 {businessAddress}
          </p>
        </div>

        {/* Delivery Rate Setting Expansion */}
        {showConfigSettings && (
          <div className="bg-black/30 p-4 rounded-2xl border border-white/20 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-lime-300">
                {isBm ? 'Tetapan Kadar Penghantaran Fleksibel' : 'Configurable Delivery Pricing'}
              </span>
              <span className="text-xs font-mono font-bold bg-white/15 px-2 py-0.5 rounded">
                RM{deliveryRatePerKm.toFixed(2)} / km
              </span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              {isBm
                ? 'Peraturan kadar: Di bawah 5 km adalah PERCUMA. Di atas 5 km, caj dikira mengikut kadar per-km yang boleh diubah suai ini (cadangan RM0.30/km).'
                : 'Delivery pricing: Under 5 km is FREE. Over 5 km, charged at configurable rate per km (proposed RM0.30/km).'}
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.10"
                max="1.50"
                step="0.05"
                value={deliveryRatePerKm}
                onChange={(e) => setDeliveryRatePerKm(Number(e.target.value))}
                className="w-full accent-lime-400"
              />
              <span className="font-mono text-xs font-extrabold text-white shrink-0">
                RM{deliveryRatePerKm.toFixed(2)}/km
              </span>
            </div>
          </div>
        )}

        {/* Sub-Navigation Bar for Supplier Only */}
        <div className="pt-2 flex items-center gap-2 border-t border-white/15 overflow-x-auto">
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('upload')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'upload'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isBm ? 'Muat Naik Sisa' : 'Upload Fabric Waste'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('listings')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'listings'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{isBm ? 'Senarai Saya' : 'My Listings'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('available')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'available'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isBm ? 'Bahan Tersedia' : 'Available Materials'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('history')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isBm ? 'Sejarah Pembekal' : 'Supplier History'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('profile')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'profile'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isBm ? 'Profil Pembekal' : 'My Profile'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: SUPPLIER PROFILE (/supplier/profile) */}
      {/* ========================================================================= */}
      {activeSubTab === 'profile' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-[#e5dfd7] shadow-xs space-y-5">
            <div className="flex items-center gap-4 border-b border-[#e5dfd7] pb-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 font-display font-black text-2xl flex items-center justify-center border-2 border-teal-300">
                🏢
              </div>
              <div className="space-y-0.5">
                <h2 className="font-display font-black text-xl text-[#1e3f33]">
                  {businessName}
                </h2>
                <p className="text-xs font-bold text-teal-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isBm ? 'Perniagaan Pembekal Disahkan (SSM Verified)' : 'SSM Verified Supplier'}</span>
                </p>
                <p className="text-xs text-[#40534C]">{isBm ? 'Wakil Syarikat:' : 'Representative:'} {supplierName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] space-y-1">
                <span className="text-[#40534C] font-semibold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#234e3f]" />
                  <span>{isBm ? 'No. Pendaftaran SSM:' : 'SSM Reg No:'}</span>
                </span>
                <span className="font-bold text-[#1e3f33] text-sm block">
                  {businessReg}
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] space-y-1">
                <span className="text-[#40534C] font-semibold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#234e3f]" />
                  <span>{isBm ? 'Jenis Perniagaan:' : 'Business Type:'}</span>
                </span>
                <span className="font-bold text-[#1e3f33] text-sm block">
                  {businessType} (Hospitaliti / Hotel)
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] space-y-1">
                <span className="text-[#40534C] font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#234e3f]" />
                  <span>{isBm ? 'E-mel Rasmi:' : 'Official Email:'}</span>
                </span>
                <span className="font-bold text-[#1e3f33] text-sm block">
                  {userProfile?.email || 'razak@istana-hotel.com.my'}
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] space-y-1">
                <span className="text-[#40534C] font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#234e3f]" />
                  <span>{isBm ? 'No. Telefon Khidmat Sisa:' : 'Phone:'}</span>
                </span>
                <span className="font-bold text-[#1e3f33] text-sm block">
                  {userProfile?.phone || '019-8765432'}
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] space-y-1 sm:col-span-2">
                <span className="text-[#40534C] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#234e3f]" />
                  <span>{isBm ? 'Alamat Pusat Pengumpulan Fabrik:' : 'Textile Pickup Address:'}</span>
                </span>
                <span className="font-bold text-[#1e3f33] text-sm block">
                  {businessAddress}
                </span>
              </div>
            </div>

            {/* ESG Metrics */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-sm">
                <Award className="w-4 h-4 text-teal-700" />
                <span>{isBm ? 'Impak Alam Sekitar & Komuniti B40 (ESG)' : 'Environmental & B40 Impact (ESG)'}</span>
              </span>
              <p>
                {isBm
                  ? 'Perniagaan anda telah mengalihkan sebanyak 230 kg sisa tekstil daripada tapak pelupusan sampah dan menjana RM420 pendapatan untuk 4 wanita B40 komuniti PPR.'
                  : 'Your business has diverted 230 kg of textile waste from landfills and generated RM420 in direct earnings for 4 PPR B40 women.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">🔒 {isBm ? 'Dasar Akses Peranan (RBAC)' : 'Role Access Policy (RBAC)'}</span>
              <p>
                {isBm
                  ? 'Akaun anda didaftarkan dengan peranan Pembekal. Anda mempunyai akses eksklusif ke Portal Pembekal, Senarai Muat Naik Sisa, dan Profil Pembekal.'
                  : 'Your account is registered as a Supplier. You have exclusive access to the Supplier Portal, Waste Uploads, and Supplier Profile.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: MY LISTINGS & AVAILABLE MATERIALS */}
      {/* ========================================================================= */}
      {(activeSubTab === 'listings' || activeSubTab === 'available') && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-[#1e3f33] flex items-center gap-2">
              {activeSubTab === 'available' ? (
                <>
                  <Layers className="w-5 h-5 text-[#234e3f]" />
                  <span>{isBm ? 'Bahan Tersedia Untuk Kutipan' : 'Available Materials for Pickup'}</span>
                </>
              ) : (
                <>
                  <ListFilter className="w-5 h-5 text-[#234e3f]" />
                  <span>{isBm ? 'Semua Senarai Fabrik Anda' : 'Your Fabric Listings'}</span>
                </>
              )}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="px-3.5 py-1.5 bg-[#234e3f] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 hover:bg-[#1b3d31] transition cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBm ? 'Muat Naik Sisa' : 'Upload Waste'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {listings
              .filter((item) => (activeSubTab === 'available' ? item.status === 'Menunggu pengumpul' : true))
              .map((item) => (
              <div
                key={item.id}
                className="p-5 bg-white rounded-2xl border border-[#e5dfd7] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-[#234e3f] bg-[#eef5f1] px-2 py-0.5 rounded border border-[#e5dfd7]">
                        {item.sourceType}
                      </span>
                      <span className="text-[#52796F] font-semibold">{item.wasteType}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-[#1e3f33] mt-1">
                      {item.fabricType}
                    </h3>
                    <p className="text-xs text-[#40534C] mt-0.5">
                      {item.quantityPieces} {isBm ? 'helai (pcs)' : 'pcs'} · {item.condition} · {item.location}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                        item.status === 'Menunggu pengumpul'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#e5dfd7] text-xs">
                  <span className="font-bold text-[#1e3f33] flex items-center gap-1">
                    {item.priceType === 'Percuma' ? <Gift className="w-3.5 h-3.5 text-[#60a103]" /> : null}
                    <span>
                      {item.priceType}
                      {item.priceType === 'Berbayar' && item.price ? ` (RM${item.price.toFixed(2)})` : ''}
                    </span>
                  </span>
                  {item.deliveryAvailable && (
                    <span className="text-[#234e3f] bg-[#eef5f1] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isBm ? 'Penghantaran disediakan' : 'Delivery available'}</span>
                    </span>
                  )}
                </div>

                {item.collectorName && (
                  <div className="bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      {isBm
                        ? `Dipadankan dengan Pengumpul: ${item.collectorName}`
                        : `Matched with Collector: ${item.collectorName}`}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SUPPLIER HISTORY & ESG LOGS */}
      {/* ========================================================================= */}
      {activeSubTab === 'history' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-[#1e3f33] flex items-center gap-2">
              <History className="w-5 h-5 text-[#234e3f]" />
              <span>{isBm ? 'Sejarah Kutipan & Impak ESG' : 'Collection History & ESG Impact'}</span>
            </h2>
            <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-lg">
              {isBm ? 'Sijil Kelestarian Aktif' : 'Active Sustainability Record'}
            </span>
          </div>

          {/* ESG Impact Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-[#1e3f33] text-white p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{isBm ? 'Pencapaian Pekeliling Sisa Tekstil' : 'Textile Circularity Achievement'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-white/70 block">{isBm ? 'Sisa Dialihkan' : 'Waste Diverted'}</span>
                <span className="font-display font-black text-2xl text-lime-300">230 kg</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-white/70 block">{isBm ? 'Pendapatan B40 Dijana' : 'B40 Income Generated'}</span>
                <span className="font-display font-black text-2xl text-emerald-300">RM 420.00</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-white/70 block">{isBm ? 'Pengurangan Karbon CO2e' : 'CO2e Avoided'}</span>
                <span className="font-display font-black text-2xl text-sky-300">~690 kg</span>
              </div>
            </div>
          </div>

          {/* Completed Records */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5dfd7] shadow-xs space-y-3">
            <h3 className="font-display font-bold text-base text-[#1e3f33]">
              {isBm ? 'Log Transaksi Kutipan Selesai:' : 'Completed Pickup Logs:'}
            </h3>
            {listings
              .filter((l) => l.status === 'Selesai diambil')
              .map((item) => (
                <div key={item.id} className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <h4 className="font-bold text-[#1e3f33] text-sm">{item.fabricType}</h4>
                    <p className="text-[#52796F]">
                      {item.quantityPieces} helai · {item.collectorName || 'Pengumpul Komuniti B40'} · 📍 {item.location}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isBm ? 'Berjaya Disalurkan' : 'Successfully Channeled'}</span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: OVERVIEW (/supplier) */}
      {/* ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action to add Listing */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e5dfd7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-display font-extrabold text-lg text-[#1e3f33]">
                {isBm ? 'Ada sisa fabrik baharu untuk disalurkan?' : 'Have excess fabric to channel?'}
              </h2>
              <p className="text-xs text-[#40534C]">
                {isBm
                  ? 'Muat naik senarai dalam 1 minit. Pengumpul B40 terdekat akan mengambilnya.'
                  : 'Post a listing in 1 minute. Nearby verified B40 collectors will take it.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-sm py-3 px-5 rounded-2xl transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0 touch-target"
            >
              <Plus className="w-5 h-5" />
              <span>{isBm ? 'Muat Naik Sisa Fabrik' : 'Upload Fabric Waste'}</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-[#e5dfd7] shadow-2xs">
              <span className="text-[#40534C] block">{isBm ? 'Jumlah Senarai' : 'Total Listings'}</span>
              <span className="font-display font-black text-xl text-[#1e3f33] mt-0.5 block">{listings.length}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#e5dfd7] shadow-2xs">
              <span className="text-[#40534C] block">{isBm ? 'Selesai Diambil' : 'Collected'}</span>
              <span className="font-display font-black text-xl text-emerald-700 mt-0.5 block">
                {listings.filter((l) => l.status === 'Selesai diambil').length}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#e5dfd7] shadow-2xs">
              <span className="text-[#40534C] block">{isBm ? 'Sedang Menunggu' : 'Awaiting'}</span>
              <span className="font-display font-black text-xl text-amber-700 mt-0.5 block">
                {listings.filter((l) => l.status === 'Menunggu pengumpul').length}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#e5dfd7] shadow-2xs">
              <span className="text-[#40534C] block">{isBm ? 'Kadar Penghantaran' : 'Delivery Rate'}</span>
              <span className="font-display font-black text-xl text-[#234e3f] mt-0.5 block">
                RM{deliveryRatePerKm.toFixed(2)}/km
              </span>
            </div>
          </div>

          {/* Recent Listings Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-[#1e3f33]">
                {isBm ? 'Senarai Terkini Perniagaan Anda' : 'Recent Business Listings'}
              </h3>
              <button
                type="button"
                onClick={() => onNavigateSubTab?.('listings')}
                className="text-xs font-bold text-[#234e3f] hover:underline"
              >
                {isBm ? 'Lihat Semua Senarai →' : 'View All Listings →'}
              </button>
            </div>

            <div className="space-y-3">
              {listings.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-[#e5dfd7] shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-bold text-[#234e3f] bg-[#eef5f1] px-2 py-0.5 rounded border border-[#e5dfd7]">
                          {item.sourceType}
                        </span>
                        <span className="text-[#52796F] font-semibold">{item.wasteType}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-[#1e3f33] mt-1">
                        {item.fabricType}
                      </h4>
                      <p className="text-xs text-[#40534C] mt-0.5">
                        {item.quantityPieces} {isBm ? 'helai' : 'pcs'} · {item.condition} · {item.location}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        item.status === 'Menunggu pengumpul'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD FABRIC WASTE MODAL (SUPPLIER FORM) */}
      {/* ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e5dfd7] my-auto space-y-5">
            {!isSuccess ? (
              <>
                <div className="flex items-center justify-between border-b border-[#e5dfd7] pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#234e3f] uppercase tracking-wider block">
                      {isBm ? 'Muat Naik Sisa Fabrik' : 'Upload Fabric Waste'}
                    </span>
                    <h3 className="font-display font-extrabold text-xl text-[#1e3f33]">
                      {isBm ? 'Daftar Sisa Tekstil' : 'Register Textile Batch'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="p-1.5 text-[#315f4f] hover:text-[#1e3f33] rounded-full hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* 1. Source Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#315f4f] mb-1">
                      {isBm ? 'Jenis Perniagaan / Punca Sisa' : 'Business Type / Waste Source'}
                    </label>
                    <select
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value as SupplierType)}
                      className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#FAF8F5] font-semibold text-[#1e3f33]"
                    >
                      <option value="Hotel">Hotel / Homestay</option>
                      <option value="Kafe/Restoran">Kafe / Restoran (Alas meja, kain lap)</option>
                      <option value="Kedai Jahit/Tailor">Kedai Jahit / Tailor (Perca, potongan kain)</option>
                      <option value="Kilang Pakaian">Kilang Pakaian / Konfeksi</option>
                      <option value="Dobi Komersial">Dobi Komersial</option>
                      <option value="Lain-lain">Lain-lain Perniagaan</option>
                    </select>
                  </div>

                  {/* 2. Fabric Title / Category */}
                  <div>
                    <label className="block text-xs font-bold text-[#315f4f] mb-1">
                      {isBm ? 'Nama Bahan / Jenis Fabrik' : 'Fabric Title / Type'}
                    </label>
                    <input
                      type="text"
                      value={fabricType}
                      onChange={(e) => setFabricType(e.target.value)}
                      placeholder="Contoh: 30 helai cadar putih & sarung bantal"
                      className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#FAF8F5] font-semibold text-[#1e3f33]"
                      required
                    />
                  </div>

                  {/* 3. Location */}
                  <div>
                    <label className="block text-xs font-bold text-[#315f4f] mb-1">
                      {isBm ? 'Lokasi Pengambilan' : 'Pickup Location'}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Contoh: Hotel Istana, Jalan Raja Chulan, KL"
                      className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#FAF8F5] font-medium text-[#1e3f33]"
                      required
                    />
                  </div>

                  {/* 4. Quantity & Condition */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#315f4f] mb-1">
                        {isBm ? 'Kuantiti (helai / pcs)' : 'Quantity (pieces / pcs)'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#FAF8F5] font-semibold text-[#1e3f33]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#315f4f] mb-1">
                        {isBm ? 'Keadaan' : 'Condition'}
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#FAF8F5] font-semibold text-[#1e3f33]"
                      >
                        <option value="Baik">{isBm ? 'Baik' : 'Good'}</option>
                        <option value="Sederhana">{isBm ? 'Sederhana' : 'Fair'}</option>
                        <option value="Kurang baik">{isBm ? 'Kurang baik' : 'Scraps only'}</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Free / Paid / Negotiable Option */}
                  <div className="space-y-2 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#e5dfd7]">
                    <label className="block text-xs font-bold text-[#315f4f]">
                      {isBm ? 'Pilihan Harga Bahan' : 'Material Pricing Option'}
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      {(['Percuma', 'Berbayar', 'Boleh runding'] as ListingPriceType[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriceType(p)}
                          className={`py-2 px-2 rounded-xl border transition cursor-pointer ${
                            priceType === p
                              ? 'bg-[#234e3f] text-white border-[#234e3f]'
                              : 'bg-white text-[#315f4f] border-[#e5dfd7]'
                          }`}
                        >
                          {p === 'Percuma' ? `🎁 ${p}` : p}
                        </button>
                      ))}
                    </div>

                    {priceType === 'Berbayar' && (
                      <div className="pt-2">
                        <label className="block text-xs text-[#52796F] mb-1">
                          {isBm ? 'Harga yang dicadangkan (RM):' : 'Proposed price (RM):'}
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          placeholder="RM 25.00"
                          className="w-full p-2.5 rounded-xl border border-[#e5dfd7] bg-white font-bold"
                        />
                      </div>
                    )}
                  </div>

                  {/* 6. Delivery Availability */}
                  <div className="flex items-center pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#315f4f] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliveryAvailable}
                        onChange={(e) => setDeliveryAvailable(e.target.checked)}
                        className="rounded text-[#234e3f]"
                      />
                      <span>{isBm ? 'Sedia untuk khidmat penghantaran' : 'Offer delivery service'}</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition cursor-pointer touch-target"
                  >
                    {isBm ? 'Hantar Senarai Fabrik' : 'Publish Fabric Listing'}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#eef5f1] text-[#234e3f] mx-auto flex items-center justify-center border border-[#234e3f]/20">
                  <CheckCircle2 className="w-10 h-10 text-[#60a103]" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#1e3f33]">
                  {isBm ? 'Fabrik Anda Telah Disenaraikan!' : 'Your Fabric is Listed!'}
                </h3>
                <p className="text-xs sm:text-sm text-[#40534C]">
                  {isBm
                    ? 'Pengumpul komuniti B40 berdekatan akan menerima pemberitahuan peluang ini.'
                    : 'Nearby B40 community collectors will be notified of this opportunity.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
