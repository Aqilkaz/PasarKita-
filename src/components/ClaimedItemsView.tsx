import React, { useState } from 'react';
import { ClaimedItem, AppLanguage, BuyerProduct } from '../types';
import {
  PackageCheck,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  X,
  Layers,
  Tag,
  Building2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';

interface ClaimedItemsViewProps {
  language: AppLanguage;
  claimedItems: ClaimedItem[];
  onTransformProduct: (
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
  onResellItem: (
    item: ClaimedItem,
    resellData: {
      name: string;
      description: string;
      photos: string[];
      price: number;
      quantity: number;
    }
  ) => void;
  onGoToFabricHub: () => void;
  onViewInMarketplace?: () => void;
}

export const ClaimedItemsView: React.FC<ClaimedItemsViewProps> = ({
  language,
  claimedItems,
  onTransformProduct,
  onResellItem,
  onGoToFabricHub,
  onViewInMarketplace
}) => {
  const isBm = language === 'bm';

  // Modals state
  const [transformingItem, setTransformingItem] = useState<ClaimedItem | null>(null);
  const [resellingItem, setResellingItem] = useState<ClaimedItem | null>(null);
  const [successToast, setSuccessToast] = useState<{ title: string; desc: string } | null>(null);

  // Transform form state
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('Beg & Tote Bag');
  const [sellingPrice, setSellingPrice] = useState<number | string>(28);
  const [productQuantity, setProductQuantity] = useState<number | string>(5);
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [productPhotoUrl, setProductPhotoUrl] = useState('');

  // Resell form state
  const [resellName, setResellName] = useState('');
  const [resellDescription, setResellDescription] = useState('');
  const [resellPrice, setResellPrice] = useState<number | string>(18);
  const [resellQuantity, setResellQuantity] = useState<number | string>(15);
  const [resellPhotoUrl, setResellPhotoUrl] = useState('');

  const sampleCraftPhotos = [
    {
      label: isBm ? 'Beg Tote Denim Upcycle' : 'Denim Upcycled Tote',
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
    },
    {
      label: isBm ? 'Sarung Kusyen Kapas Hotel' : 'Hotel Cotton Cushion',
      url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'
    },
    {
      label: isBm ? 'Pouch Kraf Fabrik Perca' : 'Fabric Patchwork Pouch',
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80'
    },
    {
      label: isBm ? 'Apron Dapur Tekstil' : 'Kitchen Textile Apron',
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Open Transform Modal
  const handleOpenTransform = (item: ClaimedItem) => {
    setTransformingItem(item);
    setProductName(isBm ? `Beg Kraf ${item.materialType} Upcycled` : `${item.materialType} Upcycled Craft Bag`);
    setProductDescription(
      isBm
        ? `Produk kraf buatan tangan berkualiti tinggi menggunakan bahan sisa ${item.name.toLowerCase()} daripada ${item.source}. Telah dibersihkan, dijahit teliti dan mesra alam.`
        : `High quality handcrafted upcycled item made with repurposed ${item.materialType.toLowerCase()} from ${item.source}. Cleaned, durable, and eco-friendly.`
    );
    setProductCategory('Beg & Tote Bag');
    setSellingPrice(25.0);
    setProductQuantity(Math.min(item.quantity, 5));
    setMaterialsUsed(`${item.name} (${item.materialType}) - ${item.source}`);
    setProductPhotoUrl(
      item.materialType.toLowerCase().includes('denim')
        ? sampleCraftPhotos[0].url
        : sampleCraftPhotos[1].url
    );
  };

  // Open Resell Modal
  const handleOpenResell = (item: ClaimedItem) => {
    setResellingItem(item);
    setResellName(isBm ? `Pek Sedia Guna: ${item.name}` : `Ready-to-use Pack: ${item.name}`);
    setResellDescription(
      isBm
        ? `Kain sisa terpakai bersih & berkualiti dari ${item.source}. Sangat sesuai untuk pembuat kraf, pereka fesyen, atau perniagaan jahitan.`
        : `Clean and sorted quality fabric discards from ${item.source}. Ideal for crafters, fashion designers, and workshops.`
    );
    setResellPrice(18.0);
    setResellQuantity(item.quantity);
    setResellPhotoUrl(item.photoUrl);
  };

  // Submit Transform
  const handleSubmitTransform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transformingItem) return;

    const priceNum = typeof sellingPrice === 'string' ? parseFloat(sellingPrice) || 20 : sellingPrice;
    const qtyNum = typeof productQuantity === 'string' ? parseInt(productQuantity) || 1 : productQuantity;

    onTransformProduct(transformingItem, {
      name: productName,
      description: productDescription,
      photos: [productPhotoUrl || transformingItem.photoUrl],
      category: productCategory,
      sellingPrice: priceNum,
      quantity: qtyNum,
      materialsUsed: materialsUsed || transformingItem.name
    });

    setSuccessToast({
      title: isBm ? 'Produk Kraf Berjaya Dicipta & Diterbitkan!' : 'Product Successfully Created & Listed!',
      desc: isBm
        ? `"${productName}" kini aktif di pasaran pembeli pada harga RM${priceNum.toFixed(2)}.`
        : `"${productName}" is now active in the buyer marketplace at RM${priceNum.toFixed(2)}.`
    });

    setTransformingItem(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Submit Resell
  const handleSubmitResell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resellingItem) return;

    const priceNum = typeof resellPrice === 'string' ? parseFloat(resellPrice) || 15 : resellPrice;
    const qtyNum = typeof resellQuantity === 'string' ? parseInt(resellQuantity) || 1 : resellQuantity;

    onResellItem(resellingItem, {
      name: resellName,
      description: resellDescription,
      photos: [resellPhotoUrl || resellingItem.photoUrl],
      price: priceNum,
      quantity: qtyNum
    });

    setSuccessToast({
      title: isBm ? 'Bahan Berjaya Disenaraikan untuk Dijual Semula!' : 'Material Listed for Resale!',
      desc: isBm
        ? `"${resellName}" kini boleh dibeli oleh pembeli di pasaran pada harga RM${priceNum.toFixed(2)}.`
        : `"${resellName}" is now available to buyers at RM${priceNum.toFixed(2)}.`
    });

    setResellingItem(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <p className="font-extrabold text-emerald-950">{successToast.title}</p>
              <p className="text-emerald-800">{successToast.desc}</p>
            </div>
          </div>
          {onViewInMarketplace && (
            <button
              type="button"
              onClick={onViewInMarketplace}
              className="text-xs font-black text-emerald-900 underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>{isBm ? 'Lihat di Pasaran' : 'View in Market'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#e5dfd7] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#234e3f]/10 text-[#234e3f]">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>{isBm ? 'Bahan Dituntut Saya' : 'My Claimed Materials'}</span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#1e3f33]">
              {isBm ? 'Pusat Kreativiti & Nilai Tambah' : 'My Value Creation Hub'}
            </h2>
            <p className="text-xs sm:text-sm text-[#52796F] max-w-xl">
              {isBm
                ? 'Untuk setiap bahan yang anda tuntut, tentukan cara menjana pendapatan: cipta produk baharu (Transform into Product) atau jual bahan secara terus (Resell Item).'
                : 'For every material you claimed, decide how to create value: transform into a new finished product, or resell the material directly.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToFabricHub}
            className="flex items-center gap-2 bg-[#234e3f] hover:bg-[#1a3b30] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer touch-target"
          >
            <Plus className="w-4 h-4" />
            <span>{isBm ? 'Tuntut Bahan Lagi' : 'Claim More Materials'}</span>
          </button>
        </div>
      </div>

      {/* Claimed Items List */}
      <div className="space-y-4">
        {claimedItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#e5dfd7] space-y-4">
            <Layers className="w-12 h-12 text-[#52796F] mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#1e3f33]">
                {isBm ? 'Anda belum menuntut sebarang bahan lagi' : 'You have not claimed any materials yet'}
              </h3>
              <p className="text-xs text-[#52796F] max-w-md mx-auto">
                {isBm
                  ? 'Layari Hub Fabrik untuk melihat pelbagai sisa tekstil hotel & kilang percuma yang sedia dituntut.'
                  : 'Browse the Fabric Hub to discover free discarded fabrics and textiles ready to claim.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onGoToFabricHub}
              className="bg-[#234e3f] hover:bg-[#1a3b30] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <span>{isBm ? 'Tuntut Bahan Percuma Sekarang' : 'Claim Free Materials Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claimedItems.map((item) => {
              const isTransformed = item.status === 'transformed';
              const isResold = item.status === 'resold';
              const hasDecided = isTransformed || isResold;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-[#e5dfd7] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#234e3f]/40 transition"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-stone-100">
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-[#1e3f33]/90 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-1 rounded-lg">
                          {item.materialType}
                        </span>
                        {hasDecided ? (
                          <span className="bg-lime-400 text-[#1e3f33] text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xs">
                            {isTransformed
                              ? (isBm ? '✓ Produk Siap Dicipta' : '✓ Transformed')
                              : (isBm ? '✓ Disenarai Jual' : '✓ Listed to Resell')}
                          </span>
                        ) : (
                          <span className="bg-amber-400 text-amber-950 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xs">
                            {isBm ? 'Sedia untuk Ditentukan' : 'Ready to Decide'}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                        📦 {item.quantity} {item.unit || 'helai'}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-black text-base sm:text-lg text-[#1e3f33] leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#234e3f] font-bold">
                        <Building2 className="w-3.5 h-3.5 text-[#52796F] shrink-0" />
                        <span className="truncate">{isBm ? 'Sumber:' : 'Source:'} {item.source}</span>
                      </div>

                      <p className="text-xs text-[#40534C] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Transformed / Resold Outcome Info */}
                      {isTransformed && item.transformedProduct && (
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#1e3f33]">
                              🎨 {item.transformedProduct.name}
                            </span>
                            <span className="font-black text-[#234e3f]">
                              RM{item.transformedProduct.sellingPrice.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#52796F]">
                            {item.transformedProduct.category} · {item.transformedProduct.quantity} unit di pasaran
                          </p>
                        </div>
                      )}

                      {isResold && item.resellProduct && (
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#1e3f33]">
                              🏷️ {item.resellProduct.name}
                            </span>
                            <span className="font-black text-[#234e3f]">
                              RM{item.resellProduct.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#52796F]">
                            {item.resellProduct.quantity} helai sedia dibeli di pasaran
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decision Actions */}
                  <div className="pt-3 border-t border-[#f0eae1] space-y-2">
                    <p className="text-[11px] font-bold text-[#52796F]">
                      {hasDecided
                        ? (isBm ? 'Pilihan tindakan telah dibuat:' : 'Action taken:')
                        : (isBm ? 'Pilih tindakan untuk bahan ini:' : 'Choose what to do with this material:')}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenTransform(item)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer touch-target ${
                          isTransformed
                            ? 'bg-lime-100 text-[#1e3f33] border border-lime-300'
                            : 'bg-white hover:bg-[#eef5f1] text-[#234e3f] border border-[#234e3f]/30 hover:border-[#234e3f]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span className="truncate">
                          {isTransformed
                            ? (isBm ? 'Kemas Kini Produk' : 'Edit Product')
                            : (isBm ? 'Cipta Produk' : 'Transform into Product')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenResell(item)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer touch-target ${
                          isResold
                            ? 'bg-sky-100 text-sky-950 border border-sky-300'
                            : 'bg-white hover:bg-stone-50 text-[#40534C] border border-[#e5dfd7] hover:border-[#234e3f]/40'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-sky-700" />
                        <span className="truncate">
                          {isResold
                            ? (isBm ? 'Kemas Kini Jualan' : 'Edit Resale')
                            : (isBm ? 'Jual Semula' : 'Resell Item')}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TRANSFORM INTO PRODUCT */}
      {/* ========================================================================= */}
      {transformingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#e5dfd7] shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-[#1e3f33]">
                    {isBm ? 'Cipta Produk Baharu' : 'Transform into Product'}
                  </h3>
                  <p className="text-xs text-[#52796F]">
                    {isBm ? 'Tukar bahan sisa kepada produk kraf bernilai tinggi' : 'Turn discarded material into handcrafted products'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTransformingItem(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTransform} className="space-y-4 text-xs">
              {/* Material Info Badge */}
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#e5dfd7] flex items-center gap-3">
                <img
                  src={transformingItem.photoUrl}
                  alt={transformingItem.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] text-[#52796F] uppercase font-extrabold block">
                    {isBm ? 'Bahan Digunakan' : 'Source Material'}
                  </span>
                  <p className="font-extrabold text-[#1e3f33]">{transformingItem.name}</p>
                  <p className="text-[11px] text-[#234e3f]">{transformingItem.source} · {transformingItem.quantity} helai</p>
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-1">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Nama Produk' : 'Product Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={isBm ? 'cth: Beg Tote Denim Upcycled' : 'e.g., Upcycled Denim Tote Bag'}
                  className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] text-xs font-semibold text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                />
              </div>

              {/* Product Description */}
              <div className="space-y-1">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Penerangan Produk' : 'Product Description'} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder={isBm ? 'Ceritakan keunikan produk kraf ini...' : 'Describe the handcrafted product...'}
                  className="w-full bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#e5dfd7] text-xs text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                />
              </div>

              {/* Category & Materials Used */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1e3f33] block">
                    {isBm ? 'Kategori Produk' : 'Product Category'} *
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] px-3 py-2 rounded-xl border border-[#e5dfd7] text-xs font-semibold text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                  >
                    <option>Beg & Tote Bag</option>
                    <option>Sarung Kusyen & Hiasan</option>
                    <option>Kraf & Aksesori</option>
                    <option>Pakaian & Apron</option>
                    <option>Alas Meja & Napkin</option>
                    <option>Lain-lain</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1e3f33] block">
                    {isBm ? 'Bahan yang Digunakan' : 'Materials Used'}
                  </label>
                  <input
                    type="text"
                    value={materialsUsed}
                    onChange={(e) => setMaterialsUsed(e.target.value)}
                    placeholder="cth: Kain Cadar Kapas Hotel"
                    className="w-full bg-[#FAF8F5] px-3 py-2 rounded-xl border border-[#e5dfd7] text-xs text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                  />
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1e3f33] block">
                    {isBm ? 'Harga Jualan (RM)' : 'Selling Price (RM)'} *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] text-xs font-black text-[#234e3f] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1e3f33] block">
                    {isBm ? 'Kuantiti Dihasilkan' : 'Quantity Produced'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] text-xs font-black text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                  />
                </div>
              </div>

              {/* Photo selection */}
              <div className="space-y-2">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Foto Produk (Pilih Contoh atau Muat Naik)' : 'Product Photo'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {sampleCraftPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProductPhotoUrl(photo.url)}
                      className={`h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer relative ${
                        productPhotoUrl === photo.url
                          ? 'border-[#234e3f] ring-2 ring-[#234e3f]/30'
                          : 'border-[#e5dfd7] hover:border-[#234e3f]'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                      />
                      {productPhotoUrl === photo.url && (
                        <div className="absolute inset-0 bg-[#234e3f]/30 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f0eae1]">
                <button
                  type="button"
                  onClick={() => setTransformingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#e5dfd7] font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  {isBm ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-[#234e3f] hover:bg-[#1a3b30] text-white font-extrabold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer touch-target"
                >
                  <Sparkles className="w-4 h-4 text-lime-300" />
                  <span>{isBm ? 'Terbitkan ke Pasaran' : 'Publish to Marketplace'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RESELL ITEM */}
      {/* ========================================================================= */}
      {resellingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#e5dfd7] shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-[#1e3f33]">
                    {isBm ? 'Jual Semula Bahan' : 'Resell Item Directly'}
                  </h3>
                  <p className="text-xs text-[#52796F]">
                    {isBm ? 'Senaraikan bahan tekstil ini terus kepada pembeli sedia ada' : 'List this material directly for buyers in marketplace'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResellingItem(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResell} className="space-y-4 text-xs">
              {/* Item Name */}
              <div className="space-y-1">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Nama Bahan / Pakej Jualan' : 'Item Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={resellName}
                  onChange={(e) => setResellName(e.target.value)}
                  placeholder={isBm ? 'cth: Perca Denim Cheras Bersih' : 'e.g., Clean Denim Scrap Pack'}
                  className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] text-xs font-semibold text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Penerangan Bahan' : 'Description'} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={resellDescription}
                  onChange={(e) => setResellDescription(e.target.value)}
                  placeholder={isBm ? 'Kondisi, warna, saiz potongan...' : 'Condition, color, size of offcuts...'}
                  className="w-full bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#e5dfd7] text-xs text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                />
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1e3f33] block">
                    {isBm ? 'Harga Jualan (RM)' : 'Price (RM)'} *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={resellPrice}
                    onChange={(e) => setResellPrice(e.target.value)}
                    className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] text-xs font-black text-[#234e3f] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1e3f33] block">
                    {isBm ? 'Kuantiti (helai)' : 'Quantity (pieces)'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={resellQuantity}
                    onChange={(e) => setResellQuantity(e.target.value)}
                    className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] text-xs font-black text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                  />
                </div>
              </div>

              {/* Current photo preview */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Foto Bahan' : 'Photos'}
                </label>
                <div className="h-32 rounded-2xl overflow-hidden border border-[#e5dfd7]">
                  <img
                    src={resellPhotoUrl || resellingItem.photoUrl}
                    alt={resellName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f0eae1]">
                <button
                  type="button"
                  onClick={() => setResellingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#e5dfd7] font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  {isBm ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-[#234e3f] hover:bg-[#1a3b30] text-white font-extrabold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer touch-target"
                >
                  <ShoppingBag className="w-4 h-4 text-lime-300" />
                  <span>{isBm ? 'Senarai untuk Dijual' : 'List for Resale'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
