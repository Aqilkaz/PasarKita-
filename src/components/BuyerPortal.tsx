import React, { useState } from 'react';
import { BuyerProduct, AppLanguage, PaymentOption, CollectionMethod, UserProfile } from '../types';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  ArrowRight,
  X,
  Truck,
  Store,
  CreditCard,
  SlidersHorizontal,
  Info,
  ShieldCheck,
  PackageCheck,
  UserCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Building2,
  Receipt,
  Bookmark,
  Heart
} from 'lucide-react';

export type BuyerTab = 'browse' | 'search' | 'orders' | 'saved' | 'profile' | 'marketplace';

interface BuyerPortalProps {
  language: AppLanguage;
  products: BuyerProduct[];
  deliveryRatePerKm?: number;
  userProfile?: UserProfile;
  activeSubTab?: BuyerTab;
  onNavigateSubTab?: (tab: BuyerTab) => void;
  onBuyerPurchase?: (product: BuyerProduct, orderTotal: number, method: PaymentOption) => void;
}

export const BuyerPortal: React.FC<BuyerPortalProps> = ({
  language,
  products,
  deliveryRatePerKm = 0.30,
  userProfile,
  activeSubTab = 'browse',
  onNavigateSubTab,
  onBuyerPurchase
}) => {
  const isBm = language === 'bm';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFabricType, setSelectedFabricType] = useState('Semua');
  const [selectedCondition, setSelectedCondition] = useState('Semua');
  const [maxDistance, setMaxDistance] = useState(25);
  const [selectedProduct, setSelectedProduct] = useState<BuyerProduct | null>(null);
  const [isPurchaseSuccess, setIsPurchaseSuccess] = useState(false);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(['bp-1']);

  const toggleSaveProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Sample orders placed by this buyer
  const [buyerOrders, setBuyerOrders] = useState([
    {
      id: 'ORD-8821',
      date: '17 Mac 2026',
      title: '50x Helai Cadar & Linen Hotel Siap Cuci',
      supplier: 'Hotel Istana Kuala Lumpur',
      collector: 'Aqil (Komuniti PPR Lembah Pantai)',
      weightKg: 25,
      materialTotal: 30.00,
      deliveryMethod: 'Penghantaran (Delivery - 8 km)',
      deliveryFee: 0.90,
      totalPaid: 30.90,
      paymentMethod: "Touch 'n Go eWallet",
      status: 'Sedang Dihantar (In Transit)',
      eta: 'Hari ini, 4:30 PM'
    },
    {
      id: 'ORD-8790',
      date: '12 Mac 2026',
      title: '30x Lebihan Kain Denim Jeans Craft',
      supplier: 'Kedai Jahit & Tailor Sentosa',
      collector: 'Faridah (Lembah Subang)',
      weightKg: 12,
      materialTotal: 18.00,
      deliveryMethod: 'Ambil Sendiri (Self-Pickup - Percuma)',
      deliveryFee: 0.00,
      totalPaid: 18.00,
      paymentMethod: 'GrabPay',
      status: 'Selesai Diterima (Completed)',
      eta: '12 Mac 2026'
    }
  ]);

  // Checkout modal states
  const [collectionMethod, setCollectionMethod] = useState<CollectionMethod>('delivery');
  const [buyerDistanceKm, setBuyerDistanceKm] = useState<number>(4);
  const [paymentCategory, setPaymentCategory] = useState<'malaysia' | 'international'>('malaysia');
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('FPX Online Banking');
  const [customerNotes, setCustomerNotes] = useState('');

  // Delivery Fee calculation: Under 5 km free, over 5 km RM0.30/km
  const calculateDeliveryFee = (km: number) => {
    if (km <= 5) return 0;
    return Number(((km - 5) * deliveryRatePerKm).toFixed(2));
  };

  const deliveryFee = collectionMethod === 'delivery' ? calculateDeliveryFee(buyerDistanceKm) : 0;
  const materialPriceTotal = selectedProduct ? selectedProduct.totalPrice : 0;
  const finalOrderTotal = Number((materialPriceTotal + deliveryFee).toFixed(2));

  // Filter products
  const filtered = products.filter((p) => {
    const matchQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.wasteCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedFabricType === 'Semua' || p.fabricType === selectedFabricType;
    const matchCond = selectedCondition === 'Semua' || p.condition === selectedCondition;
    const matchDist = p.distanceKm <= maxDistance;

    return matchQuery && matchType && matchCond && matchDist;
  });

  // 🇲🇾 Malaysian Buyers payment options
  const malaysianPaymentMethods: { id: PaymentOption; name: string; icon: string; sub?: string }[] = [
    { id: 'FPX Online Banking', name: 'FPX Online Banking', icon: '🏦', sub: 'Maybank2u, CIMB, Bank Islam, etc.' },
    { id: 'DuitNow', name: 'DuitNow', icon: '⚡', sub: 'QR & DuitNow Transfer' },
    { id: 'Debit/Credit Card', name: 'Debit/Credit Card', icon: '💳', sub: 'Visa & Mastercard (MYR)' },
    { id: 'Cash on Delivery (COD)', name: 'Cash on Delivery (COD)', icon: '💵', sub: 'Bayar tunai semasa serahan' }
  ];

  // 🌎 International Buyers payment options
  const internationalPaymentMethods: { id: PaymentOption; name: string; icon: string; sub?: string }[] = [
    { id: 'Visa', name: 'Visa', icon: '💳', sub: 'Worldwide Visa Cards' },
    { id: 'Mastercard', name: 'Mastercard', icon: '💳', sub: 'Worldwide Mastercard' },
    { id: 'PayPal', name: 'PayPal', icon: '🌐', sub: 'Global PayPal Balance & Cards' }
  ];

  const handleExecutePurchase = () => {
    if (selectedProduct) {
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: 'Hari ini',
        title: selectedProduct.title,
        supplier: 'Pembekal Tempatan',
        collector: selectedProduct.collectorName || 'Pengumpul B40',
        weightKg: selectedProduct.weightKg || 5,
        materialTotal: materialPriceTotal,
        deliveryMethod: collectionMethod === 'delivery' ? `Penghantaran (${buyerDistanceKm} km)` : 'Ambil Sendiri',
        deliveryFee: deliveryFee,
        totalPaid: finalOrderTotal,
        paymentMethod: paymentMethod,
        status: 'Tempahan Diterima (Processing)',
        eta: 'Esok'
      };
      setBuyerOrders([newOrder, ...buyerOrders]);
      onBuyerPurchase?.(selectedProduct, finalOrderTotal, paymentMethod);
    }

    setIsPurchaseSuccess(true);
    setTimeout(() => {
      setIsPurchaseSuccess(false);
      setSelectedProduct(null);
    }, 2000);
  };

  const buyerName = userProfile?.name || 'Farah Nadia (EcoCraft Studio)';
  const buyerBusiness = userProfile?.businessName || 'EcoCraft Studio Sdn Bhd';
  const buyerArea = userProfile?.area || 'Petaling Jaya, Selangor';

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      {/* Buyer Banner with Identity */}
      <div className="bg-[#18392e] text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-extrabold text-white">
            <ShoppingBag className="w-4 h-4 text-lime-300" />
            <span>{isBm ? 'Pasaran Pembeli Fabrik' : 'Fabric Buyer Marketplace'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-sky-950/80 px-2.5 py-1 rounded-xl text-sky-200 border border-sky-400/30 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            <span>{isBm ? 'Akaun Pembeli Sah' : 'Verified Buyer'}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
            Hello, {buyerName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-medium">
            🏢 {buyerBusiness} · 📍 {buyerArea}
          </p>
        </div>

        {/* Sub Navigation Bar for Buyer Only */}
        <div className="pt-2 flex items-center gap-2 border-t border-white/15 overflow-x-auto">
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('browse')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'browse' || activeSubTab === 'marketplace'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isBm ? 'Teroka Bahan' : 'Browse Materials'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('search')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'search'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isBm ? 'Cari Fabrik' : 'Search'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('orders')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'orders'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>{isBm ? 'Pesanan Saya' : 'My Orders'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSubTab?.('saved')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'saved'
                ? 'bg-white text-[#18392e] shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isBm ? 'Item Disimpan' : 'Saved Items'}</span>
            {savedProductIds.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-lime-400 text-black text-[10px] font-black rounded-full">
                {savedProductIds.length}
              </span>
            )}
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
            <span>{isBm ? 'Profil Pembeli' : 'My Profile'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: MY ORDERS (/buyer/orders) */}
      {/* ========================================================================= */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-[#1e3f33] flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#234e3f]" />
              <span>{isBm ? 'Pesanan & Tempahan Fabrik Anda' : 'Your Fabric Orders'}</span>
            </h2>
            <span className="text-xs text-[#40534C] font-semibold bg-[#eef5f1] px-2.5 py-1 rounded-lg">
              {buyerOrders.length} {isBm ? 'Pesanan' : 'Orders'}
            </span>
          </div>

          <div className="space-y-3">
            {buyerOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-5 border border-[#e5dfd7] shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5dfd7]/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-[#234e3f] bg-[#eef5f1] px-2 py-0.5 rounded">
                      {ord.id}
                    </span>
                    <span className="text-xs text-[#40534C]">{ord.date}</span>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {ord.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-base text-[#1e3f33]">
                    {ord.title}
                  </h3>
                  <p className="text-xs text-[#40534C] mt-0.5">
                    {isBm ? 'Disediakan oleh Pengumpul:' : 'Prepared by Collector:'} <strong>{ord.collector}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#e5dfd7]">
                  <div>
                    <span className="text-[#40534C]/70 block">{isBm ? 'Kaedah:' : 'Method:'}</span>
                    <span className="font-bold text-[#1e3f33]">{ord.deliveryMethod}</span>
                  </div>
                  <div>
                    <span className="text-[#40534C]/70 block">{isBm ? 'Kaedah Bayaran:' : 'Payment:'}</span>
                    <span className="font-bold text-[#1e3f33]">{ord.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[#40534C]/70 block">{isBm ? 'Jumlah Dibayar:' : 'Total Paid:'}</span>
                    <span className="font-extrabold text-[#234e3f] text-sm">RM{ord.totalPaid.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: BUYER PROFILE (/buyer/profile) */}
      {/* ========================================================================= */}
      {activeSubTab === 'profile' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-[#e5dfd7] shadow-xs space-y-5">
            <div className="flex items-center gap-4 border-b border-[#e5dfd7] pb-5">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-800 font-display font-black text-2xl flex items-center justify-center border-2 border-sky-300">
                {buyerName.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <h2 className="font-display font-black text-xl text-[#1e3f33]">
                  {buyerName}
                </h2>
                <p className="text-xs font-bold text-sky-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isBm ? 'Akaun Pembeli Sah (Verified Buyer)' : 'Verified Buyer Account'}</span>
                </p>
                <p className="text-xs text-[#40534C]">{buyerBusiness}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] space-y-1">
                <span className="text-[#40534C] font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#234e3f]" />
                  <span>{isBm ? 'E-mel Akaun:' : 'Account Email:'}</span>
                </span>
                <span className="font-bold text-[#1e3f33] text-sm block">
                  {userProfile?.email || 'farah@ecocraft.com.my'}
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] space-y-1">
                <span className="text-[#40534C] font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#234e3f]" />
                  <span>{isBm ? 'Nombor Telefon:' : 'Phone Number:'}</span>
                </span>
                <span className="font-bold text-[#1e3f33] text-sm block">
                  {userProfile?.phone || '013-2211998'}
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] space-y-1 sm:col-span-2">
                <span className="text-[#40534C] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#234e3f]" />
                  <span>{isBm ? 'Alamat Penghantaran Utama:' : 'Primary Shipping Address:'}</span>
                </span>
                <span className="font-bold text-[#1e3f33] text-sm block">
                  EcoCraft Studio, No. 12, Jalan SS2/72, 47300 Petaling Jaya, Selangor
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">🔒 {isBm ? 'Dasar Akses Peranan (RBAC)' : 'Role Access Policy (RBAC)'}</span>
              <p>
                {isBm
                  ? 'Akaun anda didaftarkan dengan peranan Pembeli. Anda mempunyai akses eksklusif ke Pasaran Fabrik, Pesanan Pembeli, dan Profil Pembeli.'
                  : 'Your account is registered as a Buyer. You have exclusive access to the Fabric Marketplace, Buyer Orders, and Buyer Profile.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SAVED ITEMS (/buyer/saved) */}
      {/* ========================================================================= */}
      {activeSubTab === 'saved' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-[#1e3f33] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#234e3f]" />
              <span>{isBm ? 'Item Fabrik Disimpan' : 'Saved Fabric Items'}</span>
            </h2>
            <span className="text-xs text-[#40534C] font-semibold bg-[#eef5f1] px-2.5 py-1 rounded-lg">
              {products.filter((p) => savedProductIds.includes(p.id)).length} {isBm ? 'Item' : 'Items'}
            </span>
          </div>

          {products.filter((p) => savedProductIds.includes(p.id)).length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#e5dfd7] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1e3f33]">
                {isBm ? 'Tiada Fabrik Disimpan Lagi' : 'No Saved Fabric Items Yet'}
              </h3>
              <p className="text-xs text-[#52796F] max-w-sm mx-auto">
                {isBm
                  ? 'Tekan ikon tanda buku pada mana-mana fabrik dalam pasaran untuk menyimpannya di sini.'
                  : 'Click the bookmark icon on any fabric listing to save it here for fast access.'}
              </p>
              <button
                type="button"
                onClick={() => onNavigateSubTab?.('browse')}
                className="px-4 py-2 bg-[#234e3f] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#1a3d31] transition"
              >
                {isBm ? 'Teroka Pasaran Fabrik' : 'Browse Fabric Marketplace'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products
                .filter((p) => savedProductIds.includes(p.id))
                .map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#e5dfd7] shadow-2xs hover:border-[#234e3f] transition flex flex-col justify-between"
                  >
                    <div className="relative h-44 bg-neutral-100">
                      <img
                        src={product.photoUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => toggleSaveProduct(product.id, e)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 shadow-xs hover:bg-white transition cursor-pointer"
                      >
                        <Bookmark className="w-4 h-4 fill-rose-600" />
                      </button>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-display font-bold text-sm text-[#1e3f33] line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-xs text-[#52796F]">
                        {product.quantityPieces} helai · {product.condition}
                      </p>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#f0eae1]">
                        <span className="font-display font-black text-base text-emerald-700">
                          RM{product.totalPrice.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(product);
                            setBuyerDistanceKm(product.distanceKm);
                          }}
                          className="px-3.5 py-1.5 bg-[#234e3f] hover:bg-[#1a3d31] text-white rounded-xl text-xs font-extrabold cursor-pointer"
                        >
                          {isBm ? 'Beli Sekarang' : 'Buy Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: MARKETPLACE / BROWSE / SEARCH */}
      {/* ========================================================================= */}
      {(activeSubTab === 'marketplace' || activeSubTab === 'browse' || activeSubTab === 'search') && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 text-[#40534C]/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBm ? 'Cari kain kapas, denim, alas meja, langsir...' : 'Search cotton, denim, tablecloths, curtains...'}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#e5dfd7] text-sm text-[#1e3f33] font-semibold shadow-2xs focus:border-[#234e3f] focus:outline-none"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {['Semua', 'Kapas', 'Denim', 'Alas Meja', 'Uniform'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedFabricType(type)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap border transition ${
                    selectedFabricType === type
                      ? 'bg-[#234e3f] text-white border-[#234e3f]'
                      : 'bg-white text-[#315f4f] border-[#e5dfd7]'
                  }`}
                >
                  {type}
                </button>
              ))}

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-3 py-1.5 rounded-xl font-bold bg-white text-[#315f4f] border border-[#e5dfd7] outline-none"
              >
                <option value="Semua">{isBm ? 'Semua Keadaan' : 'All Conditions'}</option>
                <option value="Bersih">{isBm ? 'Bersih & Boleh Pakai' : 'Clean'}</option>
                <option value="Koyak sedikit">{isBm ? 'Koyak sedikit' : 'Minor tears'}</option>
                <option value="Perlu dibersihkan">{isBm ? 'Perlu dibersihkan' : 'Needs cleaning'}</option>
              </select>
            </div>

            {/* Distance Slider */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#e5dfd7] flex items-center justify-between text-xs gap-3">
              <span className="font-semibold text-[#40534C] whitespace-nowrap">
                {isBm ? 'Jarak Maksimum:' : 'Max Distance:'} <strong className="text-[#234e3f]">{maxDistance} km</strong>
              </span>
              <input
                type="range"
                min="2"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full max-w-xs accent-[#234e3f]"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e5dfd7] shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-3"
              >
                <div className="space-y-2">
                  <div className="relative">
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-44 object-cover rounded-2xl border border-[#e5dfd7]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#1e3f33] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                      📍 {item.distanceKm} km
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-[#234e3f] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md">
                      {item.wasteCategory}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-extrabold text-base text-[#1e3f33] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#40534C] font-medium mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-[#315f4f]">
                    <span className="bg-[#FAF8F5] border border-[#e5dfd7] px-2 py-0.5 rounded-lg">
                      {item.quantityPieces} {isBm ? 'helai' : 'pcs'}
                    </span>
                    <span className="bg-[#FAF8F5] border border-[#e5dfd7] px-2 py-0.5 rounded-lg">
                      {item.weightKg} kg
                    </span>
                    <span className="bg-[#FAF8F5] border border-[#e5dfd7] px-2 py-0.5 rounded-lg">
                      {item.condition}
                    </span>
                  </div>

                  <div className="pt-1 text-xs text-[#40534C] flex items-center justify-between">
                    <span>{isBm ? 'Pengumpul:' : 'Collector:'} <strong>{item.collectorName}</strong></span>
                    <span className="font-display font-black text-base text-[#234e3f]">
                      RM{item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(item);
                    setBuyerDistanceKm(item.distanceKm);
                  }}
                  className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-sm py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer touch-target shadow-xs"
                >
                  <span>{isBm ? 'Lihat Bahan & Tempah' : 'View Material & Order'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHECKOUT & ORDER MODAL */}
      {/* ========================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e5dfd7] my-auto space-y-5">
            {!isPurchaseSuccess ? (
              <>
                <div className="flex items-center justify-between border-b border-[#e5dfd7] pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#234e3f] uppercase tracking-wider block">
                      {isBm ? 'Tempahan Fabrik' : 'Fabric Order'}
                    </span>
                    <h3 className="font-display font-extrabold text-xl text-[#1e3f33]">
                      {selectedProduct.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="p-1.5 text-[#315f4f] hover:text-[#1e3f33] rounded-full hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Summary */}
                <div className="flex gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#e5dfd7]">
                  <img
                    src={selectedProduct.photoUrl}
                    alt={selectedProduct.title}
                    className="w-16 h-16 rounded-xl object-cover border border-[#e5dfd7]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs text-[#315f4f] space-y-0.5">
                    <p className="font-bold text-[#1e3f33] text-sm">{selectedProduct.fabricType}</p>
                    <p>{selectedProduct.quantityPieces} {isBm ? 'helai (pcs)' : 'pcs'} · {selectedProduct.condition}</p>
                    <p>{isBm ? 'Disediakan oleh:' : 'Prepared by:'} <strong>{selectedProduct.collectorName}</strong></p>
                  </div>
                </div>

                {/* 1. Material Price */}
                <div className="bg-white p-3 rounded-xl border border-[#e5dfd7] flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-[#1e3f33]">
                    1. {isBm ? 'Harga Bahan Fabrik:' : 'Fabric Material Price:'}
                  </span>
                  <span className="font-display font-black text-base text-[#1e3f33]">
                    RM{materialPriceTotal.toFixed(2)}
                  </span>
                </div>

                {/* 2. Collection Method */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider">
                    2. {isBm ? 'Kaedah Pengambilan' : 'Collection Method'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setCollectionMethod('delivery')}
                      className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition cursor-pointer ${
                        collectionMethod === 'delivery'
                          ? 'bg-[#eef5f1] border-[#234e3f] text-[#1e3f33]'
                          : 'bg-white border-[#e5dfd7] text-[#40534C]'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-[#234e3f]" />
                      <span>{isBm ? 'Penghantaran' : 'Delivery Service'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCollectionMethod('self_pickup')}
                      className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition cursor-pointer ${
                        collectionMethod === 'self_pickup'
                          ? 'bg-[#eef5f1] border-[#234e3f] text-[#1e3f33]'
                          : 'bg-white border-[#e5dfd7] text-[#40534C]'
                      }`}
                    >
                      <Store className="w-4 h-4 text-[#234e3f]" />
                      <span>{isBm ? 'Ambil Sendiri' : 'Self-Collect (Free)'}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Delivery Fee (if delivery chosen) */}
                {collectionMethod === 'delivery' ? (
                  <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#e5dfd7] space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#1e3f33]">
                      <span>3. {isBm ? 'Caj Penghantaran (Kadar Fleksibel):' : 'Delivery Fee (Configurable):'}</span>
                      <span className="font-display font-black text-sm text-[#234e3f]">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                            {isBm ? 'PERCUMA (≤5 km)' : 'FREE (≤5 km)'}
                          </span>
                        ) : (
                          `RM${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {/* Adjustable distance for simulation */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-[#40534C]">
                        <span>{isBm ? 'Anggaran Jarak ke Lokasi Anda:' : 'Estimated Distance to You:'}</span>
                        <strong>{buyerDistanceKm} km</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="35"
                        value={buyerDistanceKm}
                        onChange={(e) => setBuyerDistanceKm(Number(e.target.value))}
                        className="w-full accent-[#234e3f]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                    {isBm
                      ? 'Ambil sendiri di pusat komuniti PPR. Tiada sebarang caj penghantaran dikenakan.'
                      : 'Self-collect at community hub. No delivery charge applied.'}
                  </div>
                )}

                {/* 4. Payment Method Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider">
                      4. {isBm ? 'Pilihan Kaedah Bayaran' : 'Payment Method'}
                    </label>
                    <span className="text-[11px] font-semibold text-[#234e3f] bg-[#eef5f1] px-2.5 py-0.5 rounded-full border border-[#234e3f]/20">
                      {paymentCategory === 'malaysia' ? '🇲🇾 Malaysia' : '🌎 International'}
                    </span>
                  </div>

                  {/* Payment Region Switcher Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7]">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentCategory('malaysia');
                        if (['Visa', 'Mastercard', 'PayPal'].includes(paymentMethod)) {
                          setPaymentMethod('FPX Online Banking');
                        }
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentCategory === 'malaysia'
                          ? 'bg-white text-[#1e3f33] shadow-xs border border-[#e5dfd7]'
                          : 'text-[#40534C] hover:text-[#1e3f33]'
                      }`}
                    >
                      <span>🇲🇾</span>
                      <span>{isBm ? 'Pembeli Malaysia' : 'Malaysian Buyers'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentCategory('international');
                        if (!['Visa', 'Mastercard', 'PayPal'].includes(paymentMethod)) {
                          setPaymentMethod('Visa');
                        }
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentCategory === 'international'
                          ? 'bg-white text-[#1e3f33] shadow-xs border border-[#e5dfd7]'
                          : 'text-[#40534C] hover:text-[#1e3f33]'
                      }`}
                    >
                      <span>🌎</span>
                      <span>{isBm ? 'Pembeli Antarabangsa' : 'International Buyers'}</span>
                    </button>
                  </div>

                  {/* Payment Methods Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(paymentCategory === 'malaysia' ? malaysianPaymentMethods : internationalPaymentMethods).map((pm) => {
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#eef5f1] border-[#234e3f] shadow-xs ring-1 ring-[#234e3f]'
                              : 'bg-white border-[#e5dfd7] hover:border-[#234e3f]/40 text-[#40534C]'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">{pm.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs truncate ${isSelected ? 'font-bold text-[#1e3f33]' : 'font-medium text-[#1e3f33]'}`}>
                              {pm.name}
                            </p>
                            {pm.sub && (
                              <p className="text-[10px] text-[#52796F] truncate">
                                {pm.sub}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[#234e3f] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Cash on Delivery Note */}
                  {paymentMethod === 'Cash on Delivery (COD)' && (
                    <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in duration-200">
                      <span className="text-xl leading-none mt-0.5">💵</span>
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-amber-950">
                          {isBm ? 'Bayar Tunai Semasa Serahan (Cash on Delivery)' : 'Cash on Delivery (COD)'}
                        </p>
                        <p className="text-amber-900 font-bold">
                          “Pay in cash when your order is delivered.”
                        </p>
                        <p className="text-amber-800 text-[11px]">
                          {isBm
                            ? `Sila sediakan wang tunai sebanyak RM${finalOrderTotal.toFixed(2)} semasa pesanan anda dihantar.`
                            : `Please prepare RM${finalOrderTotal.toFixed(2)} in cash when your order is delivered.`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Total */}
                <div className="bg-[#1e3f33] text-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-white/80 block">{isBm ? 'Jumlah Keseluruhan:' : 'Grand Total:'}</span>
                    <span className="font-display font-black text-2xl text-white">
                      RM{finalOrderTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleExecutePurchase}
                    className="bg-lime-400 hover:bg-lime-500 text-[#1e3f33] font-black text-sm px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer touch-target"
                  >
                    {paymentMethod === 'Cash on Delivery (COD)'
                      ? (isBm ? 'Sahkan Pesanan COD' : 'Confirm COD Order')
                      : (isBm ? 'Sahkan & Bayar' : 'Confirm & Pay')}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-display font-black text-xl text-[#1e3f33]">
                  {isBm ? 'Tempahan Berjaya!' : 'Order Placed Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-[#40534C] max-w-xs mx-auto">
                  {paymentMethod === 'Cash on Delivery (COD)'
                    ? (isBm
                        ? `Tempahan COD direkodkan. Sila bayar secara tunai (RM${finalOrderTotal.toFixed(2)}) apabila pesanan anda dihantar.`
                        : `COD order placed. Pay in cash (RM${finalOrderTotal.toFixed(2)}) when your order is delivered.`)
                    : (isBm
                        ? `Resit dan butiran tempahan telah direkodkan. Pengumpul dan pihak kurier akan dimaklumkan segera.`
                        : `Your order has been recorded. Collector and courier have been notified.`)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
