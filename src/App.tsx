import React, { useState, useEffect, useMemo } from 'react';
import {
  AppRole,
  AppLanguage,
  Opportunity,
  ActiveCollection,
  Transaction,
  BuyerProduct,
  SupplierListing,
  UserProfile,
  CollectionMethod,
  UserLocation,
  FabricType,
  FabricCondition,
  normalizeRole,
  DiscardedMaterial,
  ClaimedItem,
  BankAccount,
  WithdrawalRecord,
  PaymentOption
} from './types';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { LandingPageView } from './components/LandingPageView';
import { AuthPage } from './components/AuthPage';
import { CollectorPortal, CollectorTab } from './components/CollectorPortal';
import { SupplierPortal, SupplierTab } from './components/SupplierPortal';
import { BuyerPortal, BuyerTab } from './components/BuyerPortal';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { AcceptConfirmationModal } from './components/AcceptConfirmationModal';
import { SortingView } from './components/SortingView';
import { ListingPreviewModal } from './components/ListingPreviewModal';
import { BuyerMatchModal } from './components/BuyerMatchModal';
import { PaymentSuccessModal } from './components/PaymentSuccessModal';
import { HelpModal } from './components/HelpModal';
import { GoalDetailModal } from './components/GoalDetailModal';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { useAppRouter } from './router/useAppRouter';
import { calculateDistanceKm } from './utils/distance';

// Canonical demo profiles strictly associated with each of the 3 roles
export const DEMO_PROFILES: Record<'buyer' | 'supplier' | 'collector', UserProfile> = {
  buyer: {
    name: 'Farah Nadia (EcoCraft Studio)',
    phone: '013-2211998',
    email: 'farah@ecocraft.com.my',
    role: 'pembeli',
    b40Status: 'unverified',
    businessName: 'EcoCraft Studio Sdn Bhd',
    area: 'Petaling Jaya, Selangor'
  },
  supplier: {
    name: 'Encik Razak (Hotel Istana KL)',
    phone: '019-8765432',
    email: 'razak@istana-hotel.com.my',
    role: 'pembekal',
    b40Status: 'unverified',
    businessName: 'Hotel Istana Kuala Lumpur',
    businessType: 'Hotel',
    businessRegNo: '201901034567 (1345678-X)',
    address: 'No. 73, Jalan Raja Chulan, 50200 Kuala Lumpur',
    area: 'Bukit Bintang, Kuala Lumpur'
  },
  collector: {
    name: 'Aqil Bin Roslan',
    phone: '012-3456789',
    email: 'aqil.roslan@pasarkita.my',
    role: 'pengumpul',
    b40Status: 'verified',
    area: 'PPR Pantai Dalam, Kuala Lumpur',
    locationPermissionStatus: 'not_now'
  }
};

// Initial Discarded Materials for the "Fabric Hub" / "Available Materials"
const INITIAL_DISCARDED_MATERIALS: DiscardedMaterial[] = [
  {
    id: 'mat-1',
    name: 'Hotel White Cotton Linen Sheets',
    photoUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    materialType: 'Kapas (Cotton)',
    quantityAvailable: 20,
    description: 'Linen hotel putih bersih bergred sederhana, telah dibasuh rapi. Sangat sesuai dijadikan tote bag, sarung kusyen, atau apron kraftangan.',
    source: 'Hotel Istana Kuala Lumpur (Bukit Bintang)',
    status: 'available',
    datePosted: 'Hari ini',
    weightEstimateKg: 20
  },
  {
    id: 'mat-2',
    name: 'Banquet Crimson Tablecloths & Napkins',
    photoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    materialType: 'Linen & Poliester',
    quantityAvailable: 15,
    description: 'Kain alas meja dewan makan berkualiti tinggi warna merah maroon & cream. Tekstur tebal tahan lasak untuk kraftangan perca.',
    source: 'Restoran & Katering Seri Melayu (KL)',
    status: 'available',
    datePosted: 'Hari ini',
    weightEstimateKg: 15
  },
  {
    id: 'mat-3',
    name: 'Heavyweight Denim Jeans Offcuts',
    photoUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    materialType: 'Denim',
    quantityAvailable: 25,
    description: 'Perca potongan denim indigo tebal pelbagai ukuran dari bengkel tempahan pakaian. Sesuai ditransformasikan menjadi beg jinjing atau dompet kraf.',
    source: 'Bengkel Jahit & Seluar Cheras',
    status: 'available',
    datePosted: 'Semalam',
    weightEstimateKg: 25
  },
  {
    id: 'mat-4',
    name: 'Industrial Cotton Uniform Textiles',
    photoUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    materialType: 'Kapas Korporat',
    quantityAvailable: 30,
    description: 'Lebihan potongan kain kemeja korporat baharu berkualiti tinggi. Warna biru cerah dan kelabu, mudah dijahit dan digayakan.',
    source: 'Uniform Mega Garment Sdn Bhd (Klang)',
    status: 'available',
    datePosted: '2 hari lalu',
    weightEstimateKg: 30
  },
  {
    id: 'mat-5',
    name: 'Heritage Traditional Batik Offcuts',
    photoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    materialType: 'Batik Sutera / Kapas',
    quantityAvailable: 12,
    description: 'Perca kain batik tempatan bercorak flora warna-warni warisan Terengganu. Bernilai tinggi untuk produk kraftangan eksklusif wanita.',
    source: 'Atelier Batik Warisan Pantai Timur',
    status: 'available',
    datePosted: '3 hari lalu',
    weightEstimateKg: 10
  }
];

// Initial Claimed Items for Women / Sellers
const INITIAL_CLAIMED_ITEMS: ClaimedItem[] = [
  {
    id: 'claim-1',
    materialId: 'mat-demo-1',
    name: 'Perca Fabrik Denim Indigo Tebal',
    photoUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    materialType: 'Denim',
    quantity: 10,
    description: 'Perca kain jeans tebal dan bersih untuk kraftangan.',
    source: 'Bengkel Jahit & Seluar Cheras',
    claimedAt: '16 Mac 2026',
    status: 'claimed'
  }
];

// Initial Malaysian Bank Accounts
const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-1',
    accountHolderName: 'Aqil Bin Roslan',
    bankName: 'Maybank',
    accountNumber: '1141-8293-7712',
    accountType: 'Akaun Simpanan (Savings)',
    isDefault: true,
    addedDate: '10 Mac 2026'
  },
  {
    id: 'bank-2',
    accountHolderName: 'Aqil Bin Roslan',
    bankName: 'CIMB Bank',
    accountNumber: '7012-3498-1120',
    accountType: 'Akaun Simpanan (Savings)',
    isDefault: false,
    addedDate: '12 Mac 2026'
  }
];

// Initial Withdrawal History
const INITIAL_WITHDRAWAL_HISTORY: WithdrawalRecord[] = [
  {
    id: 'wd-1',
    amount: 80.00,
    bankName: 'Bank BSN',
    accountNumber: '1410-0293-8812',
    accountHolderName: 'Aqil Bin Roslan',
    status: 'Completed',
    date: '12 Mac 2026',
    transactionId: 'TXN-BSN-882190'
  },
  {
    id: 'wd-2',
    amount: 50.00,
    bankName: 'Maybank',
    accountNumber: '1141-8293-7712',
    accountHolderName: 'Aqil Bin Roslan',
    status: 'Completed',
    date: '5 Mac 2026',
    transactionId: 'TXN-MBB-441203'
  }
];

/**
 * Safely reads and validates stored user session from localStorage
 */
function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem('pasarkita_auth_user');
    if (!raw) return DEMO_PROFILES.collector; // Default initial session for immediate dashboard readiness
    const parsed = JSON.parse(raw);
    if (parsed && parsed.role) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return DEMO_PROFILES.collector;
}

export default function App() {
  const [language, setLanguage] = useState<AppLanguage>('bm');

  // Authenticated user state - strictly maintained and verified
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredUser());

  // Delivery rate per km beyond 5 km (Configurable: Starting rate RM0.30/km)
  const [deliveryRatePerKm, setDeliveryRatePerKm] = useState<number>(0.30);

  // Location permission state for B40 collectors
  const [hasPromptedLocation, setHasPromptedLocation] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pasarkita_has_prompted_location') === 'true';
    } catch {
      return false;
    }
  });
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // App router hook with seamless history synchronization
  const { currentPath, navigate } = useAppRouter();

  // Seamless portal navigation handler (used on landing page)
  const handleNavigatePortal = (portal: 'landing' | 'collector' | 'supplier' | 'buyer') => {
    if (portal === 'landing') {
      navigate('/');
    } else if (portal === 'collector') {
      setAuthenticatedUser(DEMO_PROFILES.collector);
      setCollectorTab('opportunities');
      navigate('/collector');
    } else if (portal === 'supplier') {
      setAuthenticatedUser(DEMO_PROFILES.supplier);
      setSupplierTab('upload');
      navigate('/supplier');
    } else if (portal === 'buyer') {
      setAuthenticatedUser(DEMO_PROFILES.buyer);
      setBuyerTab('browse');
      navigate('/buyer');
    }
  };

  // User's normalized active role
  const userRole = currentUser ? normalizeRole(currentUser.role) : null;

  // Active sub-tab state for each role portal
  const [collectorTab, setCollectorTab] = useState<CollectorTab>('materials');
  const [supplierTab, setSupplierTab] = useState<SupplierTab>('upload');
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('browse');

  // Discarded Materials & Claimed Items for Women / Sellers
  const [discardedMaterials, setDiscardedMaterials] = useState<DiscardedMaterial[]>(INITIAL_DISCARDED_MATERIALS);
  const [claimedItems, setClaimedItems] = useState<ClaimedItem[]>(INITIAL_CLAIMED_ITEMS);

  // Bank Accounts & Withdrawal Records
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>(INITIAL_WITHDRAWAL_HISTORY);

  // Real Sales Earnings (Actual Sales Only - NO Estimated Earnings)
  const [availableBalance, setAvailableBalance] = useState<number>(124.50);
  const [pendingBalance, setPendingBalance] = useState<number>(32.00);
  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(130.00);

  // Strict Role Redirection Enforcement:
  // A logged-in user can ONLY access their own role interface.
  // Any attempt to access another role's routes automatically redirects them back to their own portal.
  useEffect(() => {
    if (!currentUser) return;
    const role = normalizeRole(currentUser.role);
    if (role === 'pengumpul') {
      if (
        currentPath.startsWith('/buyer') ||
        currentPath.startsWith('/pembeli') ||
        currentPath.startsWith('/supplier') ||
        currentPath.startsWith('/pembekal')
      ) {
        navigate('/collector');
      }
    } else if (role === 'pembekal') {
      if (
        currentPath.startsWith('/buyer') ||
        currentPath.startsWith('/pembeli') ||
        currentPath.startsWith('/collector') ||
        currentPath.startsWith('/pengumpul') ||
        currentPath.startsWith('/b40')
      ) {
        navigate('/supplier');
      }
    } else if (role === 'pembeli') {
      if (
        currentPath.startsWith('/supplier') ||
        currentPath.startsWith('/pembekal') ||
        currentPath.startsWith('/collector') ||
        currentPath.startsWith('/pengumpul') ||
        currentPath.startsWith('/b40')
      ) {
        navigate('/buyer');
      }
    }
  }, [currentPath, currentUser]);

  // Sync authenticated user to persistent storage
  const setAuthenticatedUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem('pasarkita_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('pasarkita_auth_user');
      }
    } catch {
      // ignore
    }
  };

  // Auth screen mode options
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<'collector' | 'supplier' | 'buyer'>('collector');

  // Opportunities for Collectors
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 'opp-1',
      title: 'Cotton Fabric (Cadar & Tuala)',
      supplierName: 'Hotel Istana Kuala Lumpur',
      supplierType: 'Hotel',
      supplierAddress: 'No. 73, Jalan Raja Chulan, Bukit Bintang, 50200 Kuala Lumpur',
      lat: 3.1512,
      lng: 101.7103,
      distanceKm: 4.2, // Under 5 km = free delivery
      estWeightKg: 20,
      quantityPieces: 20,
      estEarnings: 35,
      materialPriceType: 'Percuma',
      freeConditionNotes: 'Percuma untuk kutipan komuniti B40 (Free for collection)',
      deadline: 'Jumaat, 5:00 PM',
      photoUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      pickupNote: 'Lapor ke Pintu Servis Belakang Hotel (Loading Bay). Beritahu pengawal: Ambil sisa fabrik PasarKita.',
      deliveryAvailable: true,
      fabricWasteCategory: 'Kain cadar / tuala'
    },
    {
      id: 'opp-2',
      title: 'Tablecloths & Banquet Napkins',
      supplierName: 'Restoran & Katering Seri Melayu',
      supplierType: 'Restoran',
      supplierAddress: 'No. 12, Jalan Conlay, 50450 Kuala Lumpur',
      lat: 3.1490,
      lng: 101.7145,
      distanceKm: 3.5,
      estWeightKg: 15,
      quantityPieces: 15,
      estEarnings: 28,
      materialPriceType: 'Percuma',
      freeConditionNotes: 'Percuma jika diambil semua 15 helai',
      deadline: 'Sabtu, 3:00 PM',
      photoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      pickupNote: 'Ambil di bahagian stor belakang restoran antara jam 11 pagi hingga 3 petang.',
      deliveryAvailable: true,
      fabricWasteCategory: 'Alas meja terpakai'
    },
    {
      id: 'opp-3',
      title: 'Denim Fabric Offcuts (Lebihan Potongan)',
      supplierName: 'Bengkel Jahit & Seluar Cheras',
      supplierType: 'Bengkel Jahit',
      supplierAddress: 'Jalan Manis 4, Taman Segar, Cheras, 56100 Kuala Lumpur',
      lat: 3.0880,
      lng: 101.7420,
      distanceKm: 7.8,
      estWeightKg: 25,
      quantityPieces: 25,
      estEarnings: 45,
      materialPriceType: 'Percuma',
      freeConditionNotes: 'Percuma untuk kutipan sendiri, atau guna penghantaran PasarKita',
      deadline: 'Ahad, 12:00 PM',
      photoUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      pickupNote: 'Berjumpa terus dengan Puan Nor di tingkat 1 kedai jahit.',
      deliveryAvailable: true,
      fabricWasteCategory: 'Lebihan potongan tekstil (Offcuts)'
    },
    {
      id: 'opp-4',
      title: 'Corporate Uniform Textiles (Seragam Terpakai)',
      supplierName: 'Uniform Mega Garment Sdn Bhd',
      supplierType: 'Pembekal Uniform',
      supplierAddress: 'Kawasan Perindustrian Bukit Raja, Klang, Selangor',
      lat: 3.0650,
      lng: 101.4600,
      distanceKm: 14.5,
      estWeightKg: 40,
      quantityPieces: 40,
      estEarnings: 60,
      materialPriceType: 'Boleh runding',
      freeConditionNotes: 'Percuma jika kuantiti diambil melebihi 30 helai',
      deadline: 'Isnin depan',
      photoUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
      pickupNote: 'Pintu pagar kilang B, lapor diri di pondok keselamatan.',
      deliveryAvailable: true,
      fabricWasteCategory: 'Pakaian seragam / Uniform terpakai'
    }
  ]);

  // Active collection being processed
  const [activeCollection, setActiveCollection] = useState<ActiveCollection | null>({
    id: 'col-1',
    opportunityId: 'opp-1',
    fabricType: 'Kain Kapas Cadar Hotel',
    supplierName: 'Hotel Istana Kuala Lumpur',
    quantityPieces: 20,
    weightKg: 20,
    status: 'sudah_diambil',
    currentStep: 2,
    estEarnings: 35,
    collectionMethod: 'delivery',
    deliveryFee: 0
  });

  // Supplier listings
  const [supplierListings, setSupplierListings] = useState<SupplierListing[]>([
    {
      id: 'sup-1',
      supplierName: 'Hotel Istana Kuala Lumpur',
      sourceType: 'Hotel',
      fabricType: 'Kain cadar putih & tuala mandi hotel',
      wasteType: 'Kain cadar / tuala',
      description: 'Linen hotel gred sederhana, telah dibasuh dan siap diikat rapi dalam bungkusan 20 helai.',
      quantityPieces: 20,
      condition: 'Baik',
      location: 'Bukit Bintang, Kuala Lumpur',
      dateAvailable: 'Hari ini',
      priceType: 'Percuma',
      freeCondition: 'Percuma untuk kutipan komuniti B40',
      deliveryAvailable: true,
      status: 'Selesai diambil',
      collectorName: 'Pengumpul Komuniti B40'
    },
    {
      id: 'sup-2',
      supplierName: 'Restoran & Katering Seri Melayu',
      sourceType: 'Restoran',
      fabricType: 'Alas meja jamuan & napkin merah maroon',
      wasteType: 'Alas meja terpakai',
      description: 'Alas meja poliester kapas berkualiti dari dewan bankuet.',
      quantityPieces: 15,
      condition: 'Baik',
      location: 'Jalan Conlay, Kuala Lumpur',
      dateAvailable: 'Hari ini',
      priceType: 'Percuma',
      freeCondition: 'Percuma jika ambil kesemua 15 helai sekali gus',
      deliveryAvailable: true,
      status: 'Menunggu pengumpul'
    },
    {
      id: 'sup-3',
      supplierName: 'Bengkel Jahit & Seluar Cheras',
      sourceType: 'Bengkel Jahit',
      fabricType: 'Perca kain denim tebal pelbagai saiz',
      wasteType: 'Lebihan potongan tekstil (Offcuts)',
      description: 'Sangat sesuai untuk pembuatan beg tote, pouch, dan kraf perca.',
      quantityPieces: 25,
      condition: 'Baik',
      location: 'Cheras, Kuala Lumpur',
      dateAvailable: 'Esok',
      priceType: 'Berbayar',
      price: 15.00,
      deliveryAvailable: true,
      status: 'Menunggu pengumpul'
    }
  ]);

  // Buyer products
  const [buyerProducts, setBuyerProducts] = useState<BuyerProduct[]>([
    {
      id: 'bp-1',
      title: 'Pek 12x Helai Kain Kapas Putih Bersih (Hotel Linen)',
      fabricType: 'Kapas',
      wasteCategory: 'Kain cadar / tuala',
      condition: 'Bersih & Boleh Pakai',
      quantityPieces: 12,
      pricePerPiece: 1.50,
      totalPrice: 18.00,
      location: 'PPR Pantai Dalam, Kuala Lumpur',
      distanceKm: 3.2,
      collectorName: 'Pengumpul Komuniti PPR',
      photoUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      description: 'Telah dibasuh, diseterika dan digredkan kualiti oleh pengumpul komuniti PPR.',
      deliveryAvailable: true,
      materialPriceType: 'Berbayar',
      weightKg: 8.5
    },
    {
      id: 'bp-2',
      title: 'Koleksi Potongan Perca Kain Denim (Sedia Kraf)',
      fabricType: 'Denim',
      wasteCategory: 'Lebihan potongan tekstil (Offcuts)',
      condition: 'Bersih',
      quantityPieces: 25,
      pricePerPiece: 1.00,
      totalPrice: 25.00,
      location: 'Lembah Subang, Selangor',
      distanceKm: 6.8,
      collectorName: 'Puan Siti Nor',
      photoUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      description: 'Potongan seragam saiz sederhana, sangat sesuai untuk kraf beg tote dan perhiasan.',
      deliveryAvailable: true,
      materialPriceType: 'Berbayar',
      weightKg: 6.0
    }
  ]);

  // Earnings transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-1',
      date: '16 Mac 2026',
      title: 'Kutipan & Pengasingan Cadar Hotel (Hotel Istana)',
      amount: 35,
      status: 'Selesai',
      recipientOrSource: 'Hotel Istana KL',
      type: 'earned',
      method: 'DuitNow'
    },
    {
      id: 'tx-2',
      date: '14 Mac 2026',
      title: 'Pengasingan Perca Denim Cheras',
      amount: 45,
      status: 'Selesai',
      recipientOrSource: 'Bengkel Jahit Cheras',
      type: 'earned',
      method: 'DuitNow'
    },
    {
      id: 'tx-3',
      date: '12 Mac 2026',
      title: 'Pindahan ke Akaun Bank BSN',
      amount: 80,
      status: 'Dikeluarkan',
      recipientOrSource: 'Bank BSN',
      type: 'withdrawn',
      method: 'Bank BSN'
    }
  ]);

  // Modals state
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<Opportunity | null>(null);
  const [acceptConfirmation, setAcceptConfirmation] = useState<{
    opp: Opportunity;
    method: CollectionMethod;
    fee: number;
  } | null>(null);
  const [isSortingOpen, setIsSortingOpen] = useState(false);
  const [listingPreviewData, setListingPreviewData] = useState<{
    fabricType: FabricType;
    condition: FabricCondition;
    quantityPieces: number;
    notes?: string;
    photoUrl: string;
  } | null>(null);
  const [isBuyerMatchOpen, setIsBuyerMatchOpen] = useState(false);
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Active tab identifier across roles
  const currentActiveRoleTab = useMemo(() => {
    if (!userRole) return '';
    if (userRole === 'pengumpul') return collectorTab;
    if (userRole === 'pembekal') return supplierTab;
    if (userRole === 'pembeli') return buyerTab;
    return '';
  }, [userRole, collectorTab, supplierTab, buyerTab]);

  const handleSelectRoleTab = (tabId: string) => {
    if (!userRole) return;
    if (userRole === 'pengumpul') {
      setCollectorTab(tabId as CollectorTab);
    } else if (userRole === 'pembekal') {
      setSupplierTab(tabId as SupplierTab);
    } else if (userRole === 'pembeli') {
      setBuyerTab(tabId as BuyerTab);
    }
  };

  // Location handler
  const handleAllowLocation = (loc: UserLocation) => {
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        location: loc,
        locationPermissionStatus: 'granted'
      };
      setAuthenticatedUser(updatedUser);
    }
    setHasPromptedLocation(true);
    try {
      localStorage.setItem('pasarkita_has_prompted_location', 'true');
    } catch {
      // ignore
    }

    // Recalculate distance
    setOpportunities((prev) => {
      const updated = prev.map((opp) => {
        if (opp.lat && opp.lng) {
          const d = calculateDistanceKm(loc.lat, loc.lng, opp.lat, opp.lng);
          return { ...opp, distanceKm: d };
        }
        return opp;
      });
      return [...updated].sort((a, b) => a.distanceKm - b.distanceKm);
    });
    setShowLocationModal(false);
  };

  const handleNotNowLocation = () => {
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        locationPermissionStatus: 'not_now'
      };
      setAuthenticatedUser(updatedUser);
    }
    setHasPromptedLocation(true);
    try {
      localStorage.setItem('pasarkita_has_prompted_location', 'true');
    } catch {
      // ignore
    }
    setShowLocationModal(false);
  };

  // Auth submission handler
  const handleAuthenticated = (profile: UserProfile, _targetRole: AppRole) => {
    setAuthenticatedUser(profile);
    const role = normalizeRole(profile.role);
    if (role === 'pembeli') {
      setBuyerTab('browse');
      navigate('/buyer');
    } else if (role === 'pembekal') {
      setSupplierTab('upload');
      navigate('/supplier');
    } else {
      setCollectorTab('opportunities');
      navigate('/collector');
      if (!hasPromptedLocation && !profile.location) {
        setShowLocationModal(true);
      }
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    navigate('/');
  };

  const handleOpenAuth = (role: 'collector' | 'supplier' | 'buyer', mode: 'login' | 'signup' = 'login') => {
    setAuthInitialRole(role);
    setAuthMode(mode);
    navigate(mode === 'login' ? '/login' : '/signup');
  };

  // Collector actions
  const handleAcceptOpportunity = (opp: Opportunity, method: CollectionMethod, fee: number) => {
    setSelectedOppForDetail(null);
    setAcceptConfirmation({ opp, method, fee });
    setActiveCollection({
      id: `col-${Date.now()}`,
      opportunityId: opp.id,
      fabricType: opp.title,
      supplierName: opp.supplierName,
      quantityPieces: opp.quantityPieces,
      status: 'belum_diambil',
      currentStep: 1,
      estEarnings: opp.estEarnings,
      collectionMethod: method,
      deliveryFee: fee
    });
  };

  const handleSortingComplete = (data: {
    fabricType: FabricType;
    condition: FabricCondition;
    quantityPieces: number;
    notes?: string;
    photoUrl: string;
  }) => {
    setIsSortingOpen(false);
    setListingPreviewData(data);
  };

  const handleConfirmListing = () => {
    if (!listingPreviewData) return;
    const pricePerPiece =
      listingPreviewData.fabricType === 'Denim'
        ? 4.5
        : listingPreviewData.fabricType === 'Polyester'
        ? 3.5
        : 5.0;
    const totalPrice = Math.round(listingPreviewData.quantityPieces * pricePerPiece);

    const newProduct: BuyerProduct = {
      id: `bp-${Date.now()}`,
      title: `Pek ${listingPreviewData.quantityPieces}x Helai ${listingPreviewData.fabricType} Siap Asing`,
      fabricType: listingPreviewData.fabricType,
      wasteCategory: 'Lebihan potongan tekstil (Offcuts)',
      condition: listingPreviewData.condition,
      quantityPieces: listingPreviewData.quantityPieces,
      pricePerPiece,
      totalPrice,
      location: currentUser?.area || 'PPR Pantai Dalam, Kuala Lumpur',
      distanceKm: 3.5,
      collectorName: currentUser?.name || 'Pengumpul Komuniti B40',
      photoUrl: listingPreviewData.photoUrl,
      description: listingPreviewData.notes || 'Kain kapas telah siap diasingkan dan dilipat kemas.',
      deliveryAvailable: true,
      materialPriceType: 'Berbayar',
      weightKg: Math.round(listingPreviewData.quantityPieces * 0.4)
    };
    setBuyerProducts((prev) => [newProduct, ...prev]);
    setListingPreviewData(null);
    setActiveCollection(null);
    setIsBuyerMatchOpen(true);
  };

  const handleBuyerMatchAccepted = () => {
    setIsBuyerMatchOpen(false);
    setIsPaymentSuccessOpen(true);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        date: 'Hari ini',
        title: 'Jualan Fabrik Siap Asing kepada Pembeli',
        amount: 18,
        status: 'Selesai',
        recipientOrSource: 'Farah Nadia (EcoCraft Studio)',
        type: 'earned',
        method: 'DuitNow'
      },
      ...prev
    ]);
  };

  // Claim material handler: moves discarded material to "My Claimed Items"
  const handleClaimMaterial = (material: DiscardedMaterial) => {
    setDiscardedMaterials((prev) =>
      prev.map((m) => (m.id === material.id ? { ...m, status: 'claimed' as const } : m))
    );

    const newClaim: ClaimedItem = {
      id: `claim-${Date.now()}`,
      materialId: material.id,
      name: material.name,
      photoUrl: material.photoUrl,
      materialType: material.materialType,
      quantity: material.quantityAvailable,
      description: material.description,
      source: material.source,
      claimedAt: 'Hari ini',
      status: 'claimed'
    };
    setClaimedItems((prev) => [newClaim, ...prev]);
    setCollectorTab('claimed');
  };

  // Transform claimed material into a new product
  const handleTransformProduct = (
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
  ) => {
    const newProductId = `bp-${Date.now()}`;
    const newProduct: BuyerProduct = {
      id: newProductId,
      title: productData.name,
      fabricType: item.materialType,
      wasteCategory: productData.category || 'Kraf Fabrik Transformasi',
      condition: 'Baru Dihasilkan (Artisan Craft)',
      quantityPieces: productData.quantity,
      pricePerPiece: productData.sellingPrice,
      totalPrice: productData.sellingPrice,
      location: currentUser?.area || 'PPR Pantai Dalam, Kuala Lumpur',
      distanceKm: 2.5,
      collectorName: currentUser?.name || 'Puan Usahawan Komuniti',
      photoUrl: productData.photos[0] || item.photoUrl,
      description: productData.description,
      deliveryAvailable: true,
      materialPriceType: 'Berbayar',
      isArtisanProduct: true,
      productCategory: productData.category,
      materialsUsed: productData.materialsUsed
    };

    setBuyerProducts((prev) => [newProduct, ...prev]);
    setClaimedItems((prev) =>
      prev.map((c) =>
        c.id === item.id
          ? {
              ...c,
              status: 'transformed' as const,
              transformedProductId: newProductId,
              transformedProductName: productData.name
            }
          : c
      )
    );
  };

  // Resell claimed item directly
  const handleResellItem = (
    item: ClaimedItem,
    resellData: {
      name: string;
      description: string;
      photos: string[];
      price: number;
      quantity: number;
    }
  ) => {
    const newProductId = `bp-resell-${Date.now()}`;
    const newProduct: BuyerProduct = {
      id: newProductId,
      title: resellData.name,
      fabricType: item.materialType,
      wasteCategory: 'Sisa Fabrik Dituntut (Resell)',
      condition: 'Bersih & Boleh Pakai',
      quantityPieces: resellData.quantity,
      pricePerPiece: resellData.price,
      totalPrice: resellData.price,
      location: currentUser?.area || 'PPR Pantai Dalam, Kuala Lumpur',
      distanceKm: 2.5,
      collectorName: currentUser?.name || 'Puan Usahawan Komuniti',
      photoUrl: resellData.photos[0] || item.photoUrl,
      description: resellData.description,
      deliveryAvailable: true,
      materialPriceType: 'Berbayar',
      isResellMaterial: true
    };

    setBuyerProducts((prev) => [newProduct, ...prev]);
    setClaimedItems((prev) =>
      prev.map((c) =>
        c.id === item.id
          ? {
              ...c,
              status: 'resold' as const,
              resellPrice: resellData.price
            }
          : c
      )
    );
  };

  // Buyer purchase execution -> Adds ACTUAL earnings to seller balance!
  const handleBuyerPurchase = (
    product: BuyerProduct,
    _orderTotal: number,
    method: PaymentOption
  ) => {
    const saleAmount = product.totalPrice;
    setAvailableBalance((prev) => Number((prev + saleAmount).toFixed(2)));
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        date: 'Hari ini',
        title: `Jualan Selesai: ${product.title}`,
        amount: saleAmount,
        status: 'Selesai',
        recipientOrSource: `Pembeli Marketplace (${method})`,
        type: 'earned',
        method: method
      },
      ...prev
    ]);
  };

  // Bank Account Management Handlers
  const handleAddBankAccount = (bank: Omit<BankAccount, 'id'>) => {
    const newAccount: BankAccount = {
      id: `bank-${Date.now()}`,
      ...bank,
      addedDate: 'Hari ini'
    };
    if (newAccount.isDefault) {
      setBankAccounts((prev) => prev.map((b) => ({ ...b, isDefault: false })).concat(newAccount));
    } else {
      setBankAccounts((prev) => [...prev, newAccount]);
    }
  };

  const handleEditBankAccount = (id: string, updated: Partial<BankAccount>) => {
    setBankAccounts((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return { ...b, ...updated };
        }
        if (updated.isDefault) {
          return { ...b, isDefault: false };
        }
        return b;
      })
    );
  };

  const handleDeleteBankAccount = (id: string) => {
    setBankAccounts((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSetDefaultBankAccount = (id: string) => {
    setBankAccounts((prev) =>
      prev.map((b) => ({
        ...b,
        isDefault: b.id === id
      }))
    );
  };

  // Withdrawal Execution: guides seller through real fund transfer
  const handleExecuteWithdrawal = (record: Omit<WithdrawalRecord, 'id'>) => {
    const newWithdrawal: WithdrawalRecord = {
      id: `wd-${Date.now()}`,
      ...record
    };
    setAvailableBalance((prev) => Math.max(0, Number((prev - record.amount).toFixed(2))));
    setTotalWithdrawn((prev) => Number((prev + record.amount).toFixed(2)));
    setWithdrawalHistory((prev) => [newWithdrawal, ...prev]);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        date: 'Hari ini',
        title: `Pengeluaran Wang ke ${record.bankName} (${record.accountNumber})`,
        amount: record.amount,
        status: 'Dikeluarkan',
        recipientOrSource: record.bankName,
        type: 'withdrawn',
        method: record.bankName
      },
      ...prev
    ]);
  };

  const handleWithdrawSuccess = (amount: number) => {
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        date: 'Hari ini',
        title: 'Pindahan ke Akaun Bank',
        amount,
        status: 'Dikeluarkan',
        recipientOrSource: 'Akaun Bank',
        type: 'withdrawn',
        method: 'DuitNow / Bank'
      },
      ...prev
    ]);
  };

  // Determine public route states
  const isAuthRoute = currentPath === '/login' || currentPath === '/signup';
  const isLandingRoute = currentPath === '/';

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#1E2923] flex flex-col font-sans pb-20 sm:pb-0">
      {/* Top Header with Dynamic Role Identity & Controls */}
      <TopBar
        currentUser={currentUser}
        activeTab={currentActiveRoleTab}
        onSelectTab={handleSelectRoleTab}
        language={language}
        setLanguage={setLanguage}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ========================================================================= */}
        {/* ROUTE 1: PUBLIC LANDING PAGE (/) */}
        {/* ========================================================================= */}
        {isLandingRoute && !currentUser && (
          <LandingPageView
            language={language}
            onGoToAuth={handleOpenAuth}
            onGoToCollector={() => handleNavigatePortal('collector')}
            onGoToSupplier={() => handleNavigatePortal('supplier')}
            onGoToBuyer={() => handleNavigatePortal('buyer')}
            onOpenHelpModal={() => setIsHelpModalOpen(true)}
          />
        )}

        {/* ========================================================================= */}
        {/* ROUTE 2: AUTH PAGE (/login, /signup) */}
        {/* ========================================================================= */}
        {isAuthRoute && (
          <AuthPage
            language={language}
            initialMode={currentPath === '/signup' ? 'signup' : authMode}
            initialRole={authInitialRole}
            onAuthenticated={handleAuthenticated}
            onBack={() => navigate('/')}
          />
        )}

        {/* ========================================================================= */}
        {/* UNREGISTERED DIRECT VISITOR FALLBACK */}
        {/* If user is not logged in and not on landing or auth, show landing page */}
        {/* ========================================================================= */}
        {!currentUser && !isLandingRoute && !isAuthRoute && (
          <LandingPageView
            language={language}
            onGoToAuth={handleOpenAuth}
            onGoToCollector={() => handleNavigatePortal('collector')}
            onGoToSupplier={() => handleNavigatePortal('supplier')}
            onGoToBuyer={() => handleNavigatePortal('buyer')}
            onOpenHelpModal={() => setIsHelpModalOpen(true)}
          />
        )}

        {/* ========================================================================= */}
        {/* ROLE 1: PEMBELI (BUYER PORTAL) */}
        {/* Strictly shown ONLY when currentUser.role === 'pembeli' */}
        {/* ========================================================================= */}
        {currentUser && userRole === 'pembeli' && (
          <BuyerPortal
            language={language}
            products={buyerProducts}
            deliveryRatePerKm={deliveryRatePerKm}
            userProfile={currentUser}
            activeSubTab={buyerTab}
            onNavigateSubTab={(tab) => setBuyerTab(tab)}
            onBuyerPurchase={handleBuyerPurchase}
          />
        )}

        {/* ========================================================================= */}
        {/* ROLE 2: PEMBEKAL (SUPPLIER PORTAL) */}
        {/* Strictly shown ONLY when currentUser.role === 'pembekal' */}
        {/* ========================================================================= */}
        {currentUser && userRole === 'pembekal' && (
          <SupplierPortal
            language={language}
            listings={supplierListings}
            deliveryRatePerKm={deliveryRatePerKm}
            setDeliveryRatePerKm={setDeliveryRatePerKm}
            userProfile={currentUser}
            activeSubTab={supplierTab}
            onNavigateSubTab={(tab) => setSupplierTab(tab)}
            onAddListing={(item) => {
              setSupplierListings((prev) => [item, ...prev]);
              // Add to collector opportunities
              const newOpp: Opportunity = {
                id: `opp-${Date.now()}`,
                title: item.fabricType,
                supplierName: item.supplierName || 'Hotel Istana KL',
                supplierType: item.sourceType,
                supplierAddress: item.location,
                distanceKm: 4.8,
                quantityPieces: item.quantityPieces,
                estEarnings: Math.round(item.quantityPieces * 1.8),
                materialPriceType: item.priceType,
                materialPriceAmount: item.price,
                freeConditionNotes: item.freeCondition,
                deadline: item.dateAvailable,
                photoUrl:
                  'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
                pickupNote: 'Penyediaan sedia di kaunter servis.',
                deliveryAvailable: item.deliveryAvailable,
                fabricWasteCategory: item.wasteType
              };
              setOpportunities((prev) => [newOpp, ...prev]);
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* ROLE 3: PENGUMPUL (COLLECTOR PORTAL) */}
        {/* Strictly shown ONLY when currentUser.role === 'pengumpul' */}
        {/* ========================================================================= */}
        {currentUser && userRole === 'pengumpul' && (
          <CollectorPortal
            language={language}
            userProfile={currentUser}
            activeTab={collectorTab}
            onSelectTab={(tab) => setCollectorTab(tab)}
            opportunities={opportunities}
            activeCollection={activeCollection}
            transactions={transactions}
            discardedMaterials={discardedMaterials}
            claimedItems={claimedItems}
            bankAccounts={bankAccounts}
            withdrawalHistory={withdrawalHistory}
            availableBalance={availableBalance}
            pendingBalance={pendingBalance}
            totalWithdrawn={totalWithdrawn}
            onClaimItem={handleClaimMaterial}
            onTransformProduct={handleTransformProduct}
            onResellItem={handleResellItem}
            onAddBankAccount={handleAddBankAccount}
            onEditBankAccount={handleEditBankAccount}
            onDeleteBankAccount={handleDeleteBankAccount}
            onSetDefaultBankAccount={handleSetDefaultBankAccount}
            onExecuteWithdrawal={handleExecuteWithdrawal}
            onViewInMarketplace={() => {
              setAuthenticatedUser(DEMO_PROFILES.buyer);
              setBuyerTab('browse');
              navigate('/buyer');
            }}
            onSelectOpportunity={(opp) => setSelectedOppForDetail(opp)}
            onOpenGoal={() => setIsGoalModalOpen(true)}
            onOpenSorting={() => setIsSortingOpen(true)}
            onOpenBuyerNotification={() => setIsBuyerMatchOpen(true)}
            onOpenPaymentNotification={() => setIsPaymentSuccessOpen(true)}
            onRequestEnableLocation={() => setShowLocationModal(true)}
            onWithdrawSuccess={handleWithdrawSuccess}
            onOpenHelp={() => setIsHelpModalOpen(true)}
            onUpdateCollectionStep={(step) => {
              if (activeCollection) {
                setActiveCollection({ ...activeCollection, currentStep: step });
              }
            }}
          />
        )}
      </main>

      {/* Dynamic Role-Aware Bottom Navigation for Mobile Devices */}
      {currentUser && (
        <BottomNav
          role={currentUser.role}
          activeTab={currentActiveRoleTab}
          onSelectTab={handleSelectRoleTab}
          language={language}
        />
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS */}
      {/* ========================================================================= */}

      {/* 1. Opportunity Detail & Pickup/Delivery Selection */}
      <OpportunityDetailModal
        opportunity={selectedOppForDetail}
        language={language}
        deliveryRatePerKm={deliveryRatePerKm}
        onClose={() => setSelectedOppForDetail(null)}
        onAccept={handleAcceptOpportunity}
      />

      {/* 2. Accept Confirmation & Guide */}
      {acceptConfirmation && (
        <AcceptConfirmationModal
          opportunity={acceptConfirmation.opp}
          language={language}
          collectionMethod={acceptConfirmation.method}
          deliveryFee={acceptConfirmation.fee}
          onCloseToHome={() => {
            setAcceptConfirmation(null);
            navigate('/collector');
          }}
        />
      )}

      {/* 3. Sorting View Modal */}
      {isSortingOpen && (
        <div className="fixed inset-0 z-50 bg-[#fcfaf7] overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
          <SortingView
            language={language}
            initialQuantity={activeCollection?.quantityPieces || 12}
            onBack={() => setIsSortingOpen(false)}
            onComplete={handleSortingComplete}
          />
        </div>
      )}

      {/* 4. Listing Preview Modal */}
      {listingPreviewData && (
        <ListingPreviewModal
          language={language}
          data={listingPreviewData}
          onEdit={() => {
            setListingPreviewData(null);
            setIsSortingOpen(true);
          }}
          onConfirmListing={handleConfirmListing}
          onGoToHome={() => {
            setListingPreviewData(null);
            navigate('/collector');
          }}
        />
      )}

      {/* 5. Buyer Match Modal */}
      {isBuyerMatchOpen && (
        <BuyerMatchModal
          language={language}
          onClose={() => setIsBuyerMatchOpen(false)}
          onAcceptOrder={handleBuyerMatchAccepted}
        />
      )}

      {/* 6. Payment Success Modal */}
      {isPaymentSuccessOpen && (
        <PaymentSuccessModal
          language={language}
          amount={18}
          onClose={() => setIsPaymentSuccessOpen(false)}
          onGoToEarnings={() => {
            setIsPaymentSuccessOpen(false);
            navigate('/collector/earnings');
          }}
        />
      )}

      {/* 7. Goal Detail Modal */}
      {isGoalModalOpen && (
        <GoalDetailModal
          language={language}
          onClose={() => setIsGoalModalOpen(false)}
          onFindOpportunities={() => {
            setIsGoalModalOpen(false);
            navigate('/collector/opportunities');
          }}
        />
      )}

      {/* 8. Help Guidance Modal */}
      {isHelpModalOpen && (
        <HelpModal
          language={language}
          onClose={() => setIsHelpModalOpen(false)}
        />
      )}

      {/* 9. Location Permission Modal for B40 Collectors */}
      {showLocationModal && (
        <LocationPermissionModal
          language={language}
          onAllowLocation={handleAllowLocation}
          onNotNow={handleNotNowLocation}
        />
      )}
    </div>
  );
}
