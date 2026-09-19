import React, { useState } from 'react';
import { AppLanguage, AppRole, SupplierType, UserProfile, VerificationStatus } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ExternalLink,
  LockKeyhole,
  ShieldCheck,
  User,
  ShoppingBag,
  Clock,
  AlertCircle
} from 'lucide-react';

interface AuthPageProps {
  language: AppLanguage;
  initialMode?: 'login' | 'signup';
  initialRole?: 'collector' | 'supplier' | 'buyer';
  onAuthenticated: (profile: UserProfile, targetRole: AppRole) => void;
  onBack: () => void;
}

type SignupRole = 'collector' | 'supplier' | 'buyer';

export const AuthPage: React.FC<AuthPageProps> = ({
  language,
  initialMode = 'signup',
  initialRole = 'collector',
  onAuthenticated,
  onBack
}) => {
  const isBm = language === 'bm';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<SignupRole>(initialRole);
  const [step, setStep] = useState<number>(1);

  // Common credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Selangor');

  // Supplier specific
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<SupplierType>('Hotel');
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [supplierAgreed, setSupplierAgreed] = useState(false);

  // B40 verification state
  const [b40CheckedSara, setB40CheckedSara] = useState(false);
  const [saraResult, setSaraResult] = useState<'verified' | 'pending' | 'unable_to_verify'>('verified');

  // Error handling
  const [errorMessage, setErrorMessage] = useState('');

  // Quick fill preset for easy evaluation
  const handleQuickFill = (targetRole: SignupRole) => {
    setRole(targetRole);
    if (targetRole === 'collector') {
      setName('Aqil');
      setPhone('012-3456789');
      setEmail('aqil@example.com');
      setPassword('pasarkita123');
      setArea('PPR Pantai Dalam, Kuala Lumpur');
    } else if (targetRole === 'supplier') {
      setName('Encik Razak');
      setPhone('019-8765432');
      setEmail('razak@istana-hotel.com.my');
      setPassword('hotelwaste2026');
      setBusinessName('Hotel Istana Kuala Lumpur');
      setBusinessType('Hotel');
      setBusinessAddress('No. 73, Jalan Raja Chulan, 50200 Kuala Lumpur');
      setSupplierAgreed(true);
    } else {
      setName('Farah');
      setPhone('013-2211998');
      setEmail('farah@ecocraft.com.my');
      setPassword('ecocraft2026');
      setArea('Petaling Jaya, Selangor');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage(
        isBm
          ? 'Sila masukkan alamat e-mel dan kata laluan.'
          : 'Please enter your email and password.'
      );
      return;
    }

    const mappedRole = role === 'collector' ? 'pengumpul' : role === 'supplier' ? 'pembekal' : 'pembeli';

    // Return logged in profile with user's inputted or chosen name
    const profile: UserProfile = {
      name: name.trim() || (mappedRole === 'pengumpul' ? 'Aqil' : mappedRole === 'pembekal' ? 'Encik Razak' : 'Farah'),
      phone: phone || '012-3456789',
      email: email.trim(),
      role: mappedRole,
      b40Status: mappedRole === 'pengumpul' ? 'verified' : 'unverified',
      businessName: mappedRole === 'pembekal' ? (businessName || 'Hotel Istana Kuala Lumpur') : (mappedRole === 'pembeli' ? 'EcoCraft Studio' : undefined),
      businessType: mappedRole === 'pembekal' ? businessType : undefined,
      area: area || 'Kuala Lumpur'
    };

    onAuthenticated(profile, mappedRole === 'pengumpul' ? 'b40' : mappedRole === 'pembekal' ? 'supplier' : 'buyer');
  };

  const handleSignupNext = () => {
    setErrorMessage('');

    if (step === 1) {
      if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
        setErrorMessage(
          isBm
            ? 'Sila lengkapkan nama, nombor telefon, e-mel dan kata laluan.'
            : 'Please fill in your name, phone number, email and password.'
        );
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (role === 'collector') {
        if (!b40CheckedSara) {
          setErrorMessage(
            isBm
              ? 'Sila semak status SARA di MyKasih dan tandakan pengesahan kelayakan anda.'
              : 'Please check your SARA status on MyKasih and confirm your eligibility.'
          );
          return;
        }
      } else if (role === 'supplier') {
        if (!businessName.trim() || !businessAddress.trim() || !supplierAgreed) {
          setErrorMessage(
            isBm
              ? 'Sila lengkapkan maklumat perniagaan dan sahkan ketepatan sumber fabrik.'
              : 'Please complete the business details and confirm fabric source validity.'
          );
          return;
        }
      }
      setStep(3);
    }
  };

  const handleFinishSignup = () => {
    const mappedRole = role === 'collector' ? 'pengumpul' : role === 'supplier' ? 'pembekal' : 'pembeli';
    const profile: UserProfile = {
      name: name.trim() || (mappedRole === 'pengumpul' ? 'Aqil' : mappedRole === 'pembekal' ? 'Encik Razak' : 'Farah'),
      phone: phone.trim() || '012-3456789',
      email: email.trim() || `${mappedRole}@example.com`,
      role: mappedRole,
      b40Status: mappedRole === 'pengumpul' ? saraResult : 'unverified',
      businessName: mappedRole === 'pembekal' ? businessName : (mappedRole === 'pembeli' ? 'EcoCraft Studio' : undefined),
      businessType: mappedRole === 'pembekal' ? businessType : undefined,
      businessRegNo: mappedRole === 'pembekal' ? businessRegNo : undefined,
      address: mappedRole === 'pembekal' ? businessAddress : undefined,
      area
    };

    onAuthenticated(profile, mappedRole === 'pengumpul' ? 'b40' : mappedRole === 'pembekal' ? 'supplier' : 'buyer');
  };

  const supplierTypes: SupplierType[] = [
    'Kafe',
    'Restoran',
    'Hotel',
    'Kilang',
    'Pengeluar Pakaian (Garment)',
    'Bengkel Jahit',
    'Syarikat Tekstil',
    'Pembekal Uniform',
    'Dobi Komersial',
    'Syarikat Acara / Event',
    'Perniagaan Lain'
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-6 px-3 sm:px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#e5dfd7] shadow-lg p-6 sm:p-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-[#e5dfd7] pb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#315f4f] hover:text-[#2b5b4b] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBm ? 'Kembali ke Laman Utama' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-1 bg-[#f8f4ee] p-1 rounded-xl border border-[#e5dfd7] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                mode === 'login'
                  ? 'bg-[#234e3f] text-white shadow-2xs'
                  : 'text-[#315f4f] hover:text-[#234e3f]'
              }`}
            >
              {isBm ? 'Log Masuk' : 'Log In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setStep(1);
                setErrorMessage('');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                mode === 'signup'
                  ? 'bg-[#234e3f] text-white shadow-2xs'
                  : 'text-[#315f4f] hover:text-[#234e3f]'
              }`}
            >
              {isBm ? 'Daftar Akaun' : 'Sign Up'}
            </button>
          </div>
        </div>

        {/* Brand & Introduction */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#f8f4ee] text-[#234e3f] flex items-center justify-center mx-auto border border-[#234e3f]/20 shadow-2xs">
            <LockKeyhole className="w-6 h-6 text-[#234e3f]" />
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1e3f33]">
            {mode === 'login'
              ? (isBm ? 'Log Masuk ke PASAR KITA' : 'Log in to PASAR KITA')
              : (isBm ? 'Pendaftaran Akaun PASAR KITA' : 'PASAR KITA Account Registration')}
          </h1>
          <p className="text-sm text-[#40534C] max-w-lg mx-auto">
            {isBm
              ? 'Pilih peranan anda untuk memastikan platform kekal telus, teratur, dan memberi manfaat tepat kepada komuniti yang disasarkan.'
              : 'Select your role to ensure PASAR KITA maintains verified, purposeful access for collectors, suppliers, and buyers.'}
          </p>
        </div>

        {/* Quick Demo Autofill Helper */}
        <div className="bg-[#f8f4ee] p-3 rounded-2xl border border-[#e5dfd7] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#234e3f]">
            ⚡ {isBm ? 'Isi Contoh Segera:' : 'Quick Demo Fill:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('collector')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-300 font-extrabold"
            >
              👩 {isBm ? 'Pengumpul B40' : 'B40 Collector'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('supplier')}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 text-teal-800 rounded-lg border border-teal-300 font-extrabold"
            >
              🏢 {isBm ? 'Pembekal (Hotel)' : 'Supplier (Hotel)'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('buyer')}
              className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-800 rounded-lg border border-sky-300 font-extrabold"
            >
              🛍️ {isBm ? 'Pembeli Fabrik' : 'Fabric Buyer'}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LOGIN FORM */}
        {/* ========================================================================= */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Role switch in login */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider">
                {isBm ? 'Peranan Akaun Anda' : 'Your Account Role'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('collector')}
                  className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1 ${
                    role === 'collector'
                      ? 'border-[#234e3f] bg-[#eef5f1] text-[#1e3f33] shadow-xs font-black'
                      : 'border-[#e5dfd7] bg-white text-[#40534C] hover:border-[#234e3f]/40 font-bold'
                  }`}
                >
                  <span className="text-xl">👩</span>
                  <span className="text-xs">{isBm ? 'Pengumpul B40' : 'B40 Collector'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('supplier')}
                  className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1 ${
                    role === 'supplier'
                      ? 'border-[#234e3f] bg-[#eef5f1] text-[#1e3f33] shadow-xs font-black'
                      : 'border-[#e5dfd7] bg-white text-[#40534C] hover:border-[#234e3f]/40 font-bold'
                  }`}
                >
                  <span className="text-xl">🏢</span>
                  <span className="text-xs">{isBm ? 'Pembekal' : 'Supplier'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1 ${
                    role === 'buyer'
                      ? 'border-[#234e3f] bg-[#eef5f1] text-[#1e3f33] shadow-xs font-black'
                      : 'border-[#e5dfd7] bg-white text-[#40534C] hover:border-[#234e3f]/40 font-bold'
                  }`}
                >
                  <span className="text-xl">🛍️</span>
                  <span className="text-xs">{isBm ? 'Pembeli' : 'Buyer'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#315f4f] mb-1">
                  {isBm ? 'Alamat E-mel' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@contoh.com"
                  className="w-full p-3.5 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33] focus:border-[#234e3f] focus:bg-white focus:outline-none transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#315f4f] mb-1">
                  {isBm ? 'Kata Laluan' : 'Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3.5 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33] focus:border-[#234e3f] focus:bg-white focus:outline-none transition text-sm"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
            >
              <span>{isBm ? 'Log Masuk Sekarang' : 'Log In Now'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setStep(1);
                }}
                className="text-xs sm:text-sm font-bold text-[#234e3f] underline hover:text-[#1e3f33]"
              >
                {isBm ? 'Belum ada akaun? Daftar peranan baharu' : 'No account yet? Register a new role'}
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================================= */
          /* SIGNUP MULTI-STEP */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Steps indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-[#234e3f]' : 'bg-[#e5dfd7]'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Role Selection & Basic Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#315f4f] uppercase tracking-wider mb-2">
                    {isBm ? '1. Pilih Peranan Pendaftaran' : '1. Select Registration Role'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('collector')}
                      className={`p-4 rounded-2xl border-2 text-left transition relative ${
                        role === 'collector'
                          ? 'border-[#234e3f] bg-[#eef5f1] shadow-xs'
                          : 'border-[#e5dfd7] bg-white hover:border-[#234e3f]/40'
                      }`}
                    >
                      <span className="text-2xl block mb-1">👩</span>
                      <h3 className="font-extrabold text-sm text-[#1e3f33]">
                        {isBm ? 'Pengumpul B40' : 'B40 Collector'}
                      </h3>
                      <p className="text-[11px] text-[#40534C] mt-1">
                        {isBm ? 'Kumpul fabrik & jana pendapatan.' : 'Collect fabrics & earn income.'}
                      </p>
                      {role === 'collector' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#234e3f] text-white flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('supplier')}
                      className={`p-4 rounded-2xl border-2 text-left transition relative ${
                        role === 'supplier'
                          ? 'border-[#234e3f] bg-[#eef5f1] shadow-xs'
                          : 'border-[#e5dfd7] bg-white hover:border-[#234e3f]/40'
                      }`}
                    >
                      <span className="text-2xl block mb-1">🏢</span>
                      <h3 className="font-extrabold text-sm text-[#1e3f33]">
                        {isBm ? 'Pembekal' : 'Supplier'}
                      </h3>
                      <p className="text-[11px] text-[#40534C] mt-1">
                        {isBm ? 'Kafe, hotel, kilang, dobi, kedai jahit.' : 'Café, hotel, factory, tailor, laundry.'}
                      </p>
                      {role === 'supplier' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#234e3f] text-white flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-4 rounded-2xl border-2 text-left transition relative ${
                        role === 'buyer'
                          ? 'border-[#234e3f] bg-[#eef5f1] shadow-xs'
                          : 'border-[#e5dfd7] bg-white hover:border-[#234e3f]/40'
                      }`}
                    >
                      <span className="text-2xl block mb-1">🛍️</span>
                      <h3 className="font-extrabold text-sm text-[#1e3f33]">
                        {isBm ? 'Pembeli' : 'Buyer'}
                      </h3>
                      <p className="text-[11px] text-[#40534C] mt-1">
                        {isBm ? 'Beli bahan sisa fabrik untuk kraf/produk.' : 'Purchase reclaimed fabric materials.'}
                      </p>
                      {role === 'buyer' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#234e3f] text-white flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#315f4f] mb-1">
                      {isBm ? 'Nama Penuh / Nama Wakil' : 'Full Name / Representative'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isBm ? 'Contoh: Aqil bin Roslan' : 'e.g. Aqil Roslan'}
                      className="w-full p-3.5 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33] text-sm focus:border-[#234e3f] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#315f4f] mb-1">
                        {isBm ? 'Nombor Telefon' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01X-XXXXXXX"
                        className="w-full p-3.5 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33] text-sm focus:border-[#234e3f] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#315f4f] mb-1">
                        {isBm ? 'Kawasan / Negeri' : 'Area / State'}
                      </label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Kuala Lumpur / Selangor"
                        className="w-full p-3.5 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33] text-sm focus:border-[#234e3f] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#315f4f] mb-1">
                        {isBm ? 'Alamat E-mel' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@pasarkita.my"
                        className="w-full p-3.5 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33] text-sm focus:border-[#234e3f] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#315f4f] mb-1">
                        {isBm ? 'Cipta Kata Laluan' : 'Create Password'}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3.5 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33] text-sm focus:border-[#234e3f] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Verification Flow */}
            {step === 2 && (
              <div className="space-y-5">
                {/* 1. B40 Collector Verification */}
                {role === 'collector' && (
                  <div className="space-y-4">
                    <div className="bg-[#eef5f1] p-5 rounded-3xl border border-[#234e3f]/20 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-6 h-6 text-[#234e3f]" />
                        <h2 className="font-display font-extrabold text-xl text-[#1e3f33]">
                          {isBm ? 'Sahkan Kelayakan B40 Anda' : 'Verify Your B40 Eligibility'}
                        </h2>
                      </div>
                      <p className="text-sm text-[#40534C] leading-relaxed">
                        {isBm
                          ? 'Untuk memastikan PASAR KITA kekal memfokuskan peluang pengumpulan kepada penerima B40 yang layak, anda perlu mengesahkan kelayakan sebelum mengakses peluang kutipan fabrik.'
                          : 'To keep PASAR KITA focused on eligible B40 users, you need to verify your eligibility before accessing collection opportunities.'}
                      </p>

                      {/* Important UX constraint: Avoid MyKad upload */}
                      <div className="bg-white p-3 rounded-2xl border border-[#234e3f]/15 text-xs text-[#234e3f] font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#60a103] shrink-0" />
                        <span>
                          {isBm
                            ? 'Privasi Terpelihara: Anda tidak perlu memuat naik kad MyKad ke PASAR KITA.'
                            : 'Privacy Protected: No MyKad document upload required on PASAR KITA.'}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Verification instructions */}
                    <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-3xl border border-[#e5dfd7]">
                      <div className="space-y-2 text-sm text-[#315f4f]">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#234e3f] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            1
                          </span>
                          <div>
                            <strong className="text-[#1e3f33] block">
                              {isBm ? 'Langkah 1:' : 'Step 1:'}
                            </strong>
                            <span>
                              {isBm
                                ? 'Semak status SARA anda di laman web rasmi MyKasih.'
                                : 'Check your SARA status on the official MyKasih website.'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#234e3f] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            2
                          </span>
                          <div>
                            <strong className="text-[#1e3f33] block">
                              {isBm ? 'Langkah 2:' : 'Step 2:'}
                            </strong>
                            <span>
                              {isBm
                                ? 'Kembali ke PASAR KITA dan sahkan kelayakan anda.'
                                : 'Return to PASAR KITA and confirm your eligibility.'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#234e3f] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            3
                          </span>
                          <div>
                            <strong className="text-[#1e3f33] block">
                              {isBm ? 'Langkah 3:' : 'Step 3:'}
                            </strong>
                            <span>
                              {isBm
                                ? 'Lengkapkan profil PASAR KITA dan mulakan tugasan.'
                                : 'Complete your PASAR KITA profile and begin.'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Official Link Button: Check SARA Status */}
                      <div className="pt-2">
                        <a
                          href="https://checkstatus.mykasih.net/sara2/checkstatus"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-[#234e3f] hover:bg-[#1b3d31] text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
                        >
                          <span>{isBm ? 'Semak Status SARA di MyKasih' : 'Check SARA Status on MyKasih'}</span>
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                      </div>

                      {/* User confirmation status selection */}
                      <div className="pt-2 space-y-2 border-t border-[#e5dfd7]">
                        <label className="block text-xs font-bold text-[#315f4f]">
                          {isBm ? 'Keputusan Semakan MyKasih / SARA Anda:' : 'Your MyKasih / SARA Check Result:'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setSaraResult('verified');
                              setB40CheckedSara(true);
                            }}
                            className={`p-3 rounded-xl border-2 font-bold text-center transition ${
                              saraResult === 'verified' && b40CheckedSara
                                ? 'bg-[#eef5f1] border-[#234e3f] text-[#1e3f33]'
                                : 'bg-white border-[#e5dfd7] text-[#40534C]'
                            }`}
                          >
                            🟢 {isBm ? 'Layak SARA / STR' : 'Eligible SARA / STR'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSaraResult('pending');
                              setB40CheckedSara(true);
                            }}
                            className={`p-3 rounded-xl border-2 font-bold text-center transition ${
                              saraResult === 'pending' && b40CheckedSara
                                ? 'bg-amber-50 border-amber-600 text-amber-950'
                                : 'bg-white border-[#e5dfd7] text-[#40534C]'
                            }`}
                          >
                            🟡 {isBm ? 'Dalam Semakan' : 'Verification Pending'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSaraResult('unable_to_verify');
                              setB40CheckedSara(true);
                            }}
                            className={`p-3 rounded-xl border-2 font-bold text-center transition ${
                              saraResult === 'unable_to_verify' && b40CheckedSara
                                ? 'bg-rose-50 border-rose-600 text-rose-950'
                                : 'bg-white border-[#e5dfd7] text-[#40534C]'
                            }`}
                          >
                            🔴 {isBm ? 'Belum Disahkan' : 'Unable to Verify'}
                          </button>
                        </div>

                        <label className="flex items-start gap-2.5 p-3.5 bg-white rounded-xl border border-[#e5dfd7] text-xs font-semibold text-[#315f4f] cursor-pointer mt-2">
                          <input
                            type="checkbox"
                            checked={b40CheckedSara}
                            onChange={(e) => setB40CheckedSara(e.target.checked)}
                            className="mt-0.5 rounded text-[#234e3f]"
                          />
                          <span>
                            {isBm
                              ? 'Saya mengesahkan saya telah menyemak status saya dan bersedia menyertai PASAR KITA sebagai Pengumpul Komuniti B40.'
                              : 'I confirm I have checked my status and am ready to join PASAR KITA as an eligible B40 Community Collector.'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Supplier Verification Details */}
                {role === 'supplier' && (
                  <div className="space-y-4">
                    <div className="bg-[#eef5f1] p-5 rounded-3xl border border-[#234e3f]/20 space-y-2">
                      <div className="flex items-center gap-2 text-[#234e3f]">
                        <Building2 className="w-5 h-5" />
                        <h2 className="font-display font-extrabold text-lg text-[#1e3f33]">
                          {isBm ? 'Maklumat & Pengesahan Perniagaan' : 'Business Information & Verification'}
                        </h2>
                      </div>
                      <p className="text-xs text-[#40534C]">
                        {isBm
                          ? 'Suppliers tidak terhad kepada kilang besar. Kafe, restoran, hotel, kedai jahit dan syarikat uniform dialu-alukan.'
                          : 'Suppliers include hotels, restaurants, cafés, garment makers, tailors, laundries, and textile firms.'}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="block text-xs font-bold text-[#315f4f] mb-1">
                          {isBm ? 'Nama Perniagaan / Organisasi' : 'Business / Organization Name'}
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Contoh: Hotel Istana KL / Restoran Seri Melayu"
                          className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#315f4f] mb-1">
                            {isBm ? 'Kategori Perniagaan' : 'Business Category'}
                          </label>
                          <select
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value as SupplierType)}
                            className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-semibold text-[#1e3f33]"
                          >
                            {supplierTypes.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#315f4f] mb-1">
                            {isBm ? 'No. Pendaftaran Perniagaan (SSM / Lesen) - Pilihan' : 'Business Reg No (SSM/License) - Optional'}
                          </label>
                          <input
                            type="text"
                            value={businessRegNo}
                            onChange={(e) => setBusinessRegNo(e.target.value)}
                            placeholder="202401019282"
                            className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#315f4f] mb-1">
                          {isBm ? 'Alamat Lokasi Kutipan Fabrik' : 'Pickup Location Address'}
                        </label>
                        <input
                          type="text"
                          value={businessAddress}
                          onChange={(e) => setBusinessAddress(e.target.value)}
                          placeholder="Jalan Raja Chulan, 50200 Kuala Lumpur"
                          className="w-full p-3 rounded-xl border border-[#e5dfd7] bg-[#f8f4ee] font-medium text-[#1e3f33]"
                        />
                      </div>

                      <label className="flex items-start gap-2.5 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] text-xs font-semibold text-[#315f4f] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={supplierAgreed}
                          onChange={(e) => setSupplierAgreed(e.target.checked)}
                          className="mt-0.5 rounded text-[#234e3f]"
                        />
                        <span>
                          {isBm
                            ? 'Saya mengesahkan maklumat perniagaan ini benar dan bahan sisa fabrik yang dibekalkan adalah bersih dan selamat untuk pengendalian komuniti.'
                            : 'I confirm these business details are accurate and supplied fabric materials are clean and safe for community sorting.'}
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 3. Buyer Details */}
                {role === 'buyer' && (
                  <div className="space-y-4">
                    <div className="bg-[#eef5f1] p-5 rounded-3xl border border-[#234e3f]/20 space-y-2">
                      <div className="flex items-center gap-2 text-[#234e3f]">
                        <ShoppingBag className="w-5 h-5" />
                        <h2 className="font-display font-extrabold text-lg text-[#1e3f33]">
                          {isBm ? 'Profil Pembeli Fabrik' : 'Fabric Buyer Profile'}
                        </h2>
                      </div>
                      <p className="text-xs text-[#40534C]">
                        {isBm
                          ? 'Dapatkan sisa tekstil terpakai yang telah diasingkan dan dibersihkan oleh pengumpul B40 dengan harga yang berpatutan.'
                          : 'Source pre-sorted and categorized textiles directly from B40 collectors with clear delivery and pickup terms.'}
                      </p>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#e5dfd7] space-y-2 text-xs text-[#315f4f]">
                      <p className="font-bold text-[#1e3f33]">✓ {isBm ? 'Pelbagai kaedah pembayaran:' : 'Flexible payment methods:'}</p>
                      <p>GrabPay, ShopeePay, Touch ’n Go eWallet, FPX, dan Tunai semasa Penghantaran (COD).</p>
                      <p className="font-bold text-[#1e3f33] pt-1">✓ {isBm ? 'Pilihan kutipan & penghantaran:' : 'Collection & delivery options:'}</p>
                      <p>{isBm ? 'Ambil sendiri (percuma) atau penghantaran (percuma bawah 5 km, RM0.30/km melebihi 5 km).' : 'Self pickup (free) or delivery service (free under 5 km, RM0.30/km above 5 km).'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirmation Summary */}
            {step === 3 && (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-[#eef5f1] text-[#234e3f] flex items-center justify-center mx-auto border border-[#234e3f]/20 shadow-xs">
                  <CheckCircle2 className="w-9 h-9 text-[#60a103]" />
                </div>

                <div className="space-y-1">
                  <h2 className="font-display font-extrabold text-2xl text-[#1e3f33]">
                    {isBm ? 'Akaun Anda Sedia Digunakan!' : 'Your Account is Ready!'}
                  </h2>
                  <p className="text-sm text-[#40534C]">
                    {role === 'collector' && (isBm ? 'Status Kelayakan: Disahkan' : 'Eligibility Status: Verified')}
                    {role === 'supplier' && (isBm ? 'Status Perniagaan: Aktif' : 'Business Status: Active')}
                    {role === 'buyer' && (isBm ? 'Status Pembeli: Sedia Membeli' : 'Buyer Status: Ready')}
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-[#f8f4ee] p-4 sm:p-5 rounded-2xl border border-[#e5dfd7] text-left text-xs sm:text-sm space-y-2 text-[#315f4f]">
                  <div className="flex justify-between border-b border-[#e5dfd7] pb-1.5">
                    <span>{isBm ? 'Nama:' : 'Name:'}</span>
                    <strong className="text-[#1e3f33]">{name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#e5dfd7] pb-1.5">
                    <span>{isBm ? 'Peranan:' : 'Role:'}</span>
                    <strong className="text-[#234e3f] font-extrabold">
                      {role === 'collector'
                        ? (isBm ? 'Pengumpul B40' : 'B40 Collector')
                        : role === 'supplier'
                        ? (isBm ? 'Pembekal' : 'Supplier')
                        : (isBm ? 'Pembeli' : 'Buyer')}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-[#e5dfd7] pb-1.5">
                    <span>{isBm ? 'E-mel:' : 'Email:'}</span>
                    <strong className="text-[#1e3f33]">{email}</strong>
                  </div>
                  {role === 'collector' && (
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>{isBm ? 'Pengesahan B40 / SARA:' : 'B40 / SARA Status:'}</span>
                      <span>
                        {saraResult === 'verified'
                          ? (isBm ? '🟢 Disahkan' : '🟢 Verified')
                          : saraResult === 'pending'
                          ? (isBm ? '🟡 Menunggu' : '🟡 Pending')
                          : (isBm ? '🔴 Belum Disahkan' : '🔴 Unable to verify')}
                      </span>
                    </div>
                  )}
                  {role === 'supplier' && (
                    <div className="flex justify-between text-[#1e3f33] font-bold">
                      <span>{isBm ? 'Perniagaan:' : 'Business:'}</span>
                      <span>{businessName} ({businessType})</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                {errorMessage}
              </p>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-2">
              {step > 1 && step < 3 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="py-3.5 px-5 rounded-2xl border border-[#e5dfd7] bg-white font-bold text-sm text-[#315f4f] hover:bg-[#f8f4ee] transition"
                >
                  {isBm ? 'Sebelum' : 'Back'}
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleSignupNext}
                  className="flex-1 bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
                >
                  <span>{isBm ? 'Teruskan' : 'Continue'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishSignup}
                  className="w-full bg-[#234e3f] hover:bg-[#1b3d31] text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target"
                >
                  <span>{isBm ? 'Masuk ke Ruang Kerja PASAR KITA' : 'Enter PASAR KITA Workspace'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
