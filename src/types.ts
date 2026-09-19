export type AppRole = 'landing' | 'b40' | 'supplier' | 'buyer' | 'auth';

export type AppLanguage = 'bm' | 'en';

export type B40Tab = 'utama' | 'peluang' | 'pendapatan' | 'profil';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'unable_to_verify';

export type SupplierType =
  | 'Kafe'
  | 'Restoran'
  | 'Hotel'
  | 'Kilang'
  | 'Pengeluar Pakaian (Garment)'
  | 'Bengkel Jahit'
  | 'Syarikat Tekstil'
  | 'Pembekal Uniform'
  | 'Dobi Komersial'
  | 'Syarikat Acara / Event'
  | 'Perniagaan Lain';

export type FabricWasteType =
  | 'Cebisan fabrik (Scraps)'
  | 'Fabrik cacat / Defective'
  | 'Alas meja terpakai'
  | 'Langsir terpakai'
  | 'Pakaian seragam / Uniform terpakai'
  | 'Lebihan potongan tekstil (Offcuts)'
  | 'Fabrik rosak'
  | 'Fabrik lebihan / Unused excess'
  | 'Kain cadar / tuala'
  | 'Bahan tekstil lain';

export type ListingPriceType = 'Percuma' | 'Berbayar' | 'Boleh runding';

export type CollectionMethod = 'self_pickup' | 'delivery';

export type PaymentOption =
  // Malaysian Buyers
  | 'FPX Online Banking'
  | 'DuitNow'
  | 'Debit/Credit Card'
  | 'Cash on Delivery (COD)'
  // International Buyers
  | 'Visa'
  | 'Mastercard'
  | 'PayPal'
  // Legacy options
  | 'GrabPay'
  | 'ShopeePay'
  | "Touch 'n Go eWallet"
  | 'FPX'
  | 'SPayLater';

export type FabricType = 'Kapas' | 'Denim' | 'Polyester' | 'Campuran' | 'Lain-lain';

export type FabricCondition = 'Baik' | 'Sederhana' | 'Kurang baik';

export interface UserLocation {
  lat: number;
  lng: number;
  approximateArea?: string;
  isApproximate?: boolean;
}

export interface DiscardedMaterial {
  id: string;
  name: string;
  photoUrl: string;
  materialType: string;
  quantityAvailable: number;
  unit?: string;
  description: string;
  source: string;
  sourceAddress?: string;
  claimedBy?: string;
  claimedAt?: string;
  status: 'available' | 'claimed' | 'transformed' | 'resold';
  datePosted?: string;
  weightEstimateKg?: number;
}

export interface ClaimedItem {
  id: string;
  materialId: string;
  name: string;
  photoUrl: string;
  materialType: string;
  quantity: number;
  unit?: string;
  description: string;
  source: string;
  claimedAt: string;
  decision?: 'transform' | 'resell';
  status: 'claimed' | 'transformed' | 'resold';
  transformedProductId?: string;
  transformedProductName?: string;
  resellPrice?: number;
  transformedProduct?: {
    name: string;
    category: string;
    description: string;
    sellingPrice: number;
    quantity: number;
    materialsUsed: string;
    photos: string[];
    dateListed: string;
  };
  resellProduct?: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    photos: string[];
    dateListed: string;
  };
}

export interface BankAccount {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Akaun Simpanan (Savings)' | 'Akaun Semasa (Current)';
  isDefault: boolean;
  createdAt?: string;
  addedDate?: string;
}

export interface WithdrawalRecord {
  id: string;
  date: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  processingNote?: string;
  transactionId?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  supplierName: string;
  supplierType: SupplierType;
  supplierAddress: string;
  distanceKm: number;
  lat?: number;
  lng?: number;
  quantityPieces: number;
  estWeightKg?: number;
  estEarnings?: number; // Optional legacy
  materialPriceType: ListingPriceType;
  materialPriceAmount?: number;
  freeConditionNotes?: string;
  deadline: string;
  photoUrl: string;
  pickupNote: string;
  deliveryAvailable: boolean;
  fabricWasteCategory: FabricWasteType;
}

export interface ActiveCollection {
  id: string;
  opportunityId: string;
  fabricType: string;
  quantityPieces: number;
  weightKg?: number;
  supplierName?: string;
  status:
    | 'belum_diambil'
    | 'sudah_diambil'
    | 'diasingkan'
    | 'disenaraikan'
    | 'ada_pembeli'
    | 'sudah_dijual'
    | 'selesai';
  currentStep: 1 | 2 | 3 | 4 | 5 | 6; // 1: diterima, 2: diambil, 3: diasing, 4: disenarai, 5: dijual, 6: dibayar
  estEarnings?: number;
  collectionMethod: CollectionMethod;
  deliveryFee: number;
  buyerName?: string;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'Selesai' | 'Dalam Proses' | 'Dikeluarkan' | 'Pending' | 'Completed';
  recipientOrSource: string;
  type?: 'earned' | 'withdrawn';
  method?: string;
  buyerName?: string;
  orderId?: string;
}

export interface BuyerProduct {
  id: string;
  title: string;
  fabricType: string;
  wasteCategory: FabricWasteType | string;
  quantityPieces: number;
  pricePerPiece: number;
  totalPrice: number;
  condition: string;
  location: string;
  distanceKm: number;
  photoUrl: string;
  description: string;
  collectorName: string;
  materialPriceType: ListingPriceType;
  weightKg?: number;
  deliveryAvailable?: boolean;
  isArtisanProduct?: boolean;
  productCategory?: string;
  materialsUsed?: string;
  isResellMaterial?: boolean;
  claimedItemId?: string;
  photos?: string[];
}

export interface SupplierListing {
  id: string;
  supplierName?: string;
  fabricType: string;
  sourceType: SupplierType;
  wasteType: FabricWasteType;
  description?: string;
  quantityPieces: number;
  condition: string;
  location: string;
  dateAvailable: string;
  priceType: ListingPriceType;
  price?: number;
  freeCondition?: string;
  deliveryAvailable: boolean;
  status: 'Menunggu pengumpul' | 'Pengumpul ditemui' | 'Selesai diambil';
  collectorName?: string;
}

export type UserRole = 'pembeli' | 'pembekal' | 'pengumpul' | 'buyer' | 'supplier' | 'collector';

export function normalizeRole(role?: string): 'pembeli' | 'pembekal' | 'pengumpul' {
  if (!role) return 'pengumpul';
  const r = role.toLowerCase();
  if (r === 'pembeli' || r === 'buyer') return 'pembeli';
  if (r === 'pembekal' || r === 'supplier') return 'pembekal';
  return 'pengumpul';
}

export interface UserProfile {
  name: string;
  phone?: string;
  email: string;
  role: UserRole;
  b40Status?: VerificationStatus;
  businessName?: string;
  businessType?: SupplierType;
  businessRegNo?: string;
  address?: string;
  area?: string;
  location?: UserLocation;
  locationPermissionStatus?: 'granted' | 'denied' | 'prompt' | 'not_now';
}
