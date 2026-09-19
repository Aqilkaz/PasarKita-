import React, { useState } from 'react';
import { AppLanguage } from '../types';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Camera,
  Bell,
  HelpCircle,
  MessageCircle,
  Building2,
  Calendar,
  Scale,
  Sparkles,
  ShoppingBag,
  Truck
} from 'lucide-react';
import { RegistrationModal } from './RegistrationModal';

interface LandingPageViewProps {
  language: AppLanguage;
  onGoToAuth: (targetRole: 'collector' | 'supplier' | 'buyer', mode?: 'login' | 'signup') => void;
  onGoToCollector: () => void;
  onGoToSupplier: () => void;
  onGoToBuyer: () => void;
  onOpenHelpModal: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  language,
  onGoToAuth,
  onGoToCollector,
  onGoToSupplier,
  onGoToBuyer,
  onOpenHelpModal
}) => {
  const isBm = language === 'bm';
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('section-how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: isBm ? 'Perlu pandai menjahit?' : 'Do I need sewing skills?',
      a: isBm
        ? 'Tidak. Anda hanya perlu mengumpul dan mengasingkan fabrik mengikut jenis dan keadaan.'
        : 'No. You only need to collect and sort fabric by type and condition.'
    },
    {
      q: isBm ? 'Perlu keluarkan modal sendiri?' : 'Do I need upfront capital?',
      a: isBm
        ? 'Tidak. Anda tidak perlu membeli stok atau membayar pendahuluan.'
        : 'No. You do not need to purchase stock or pay upfront fees.'
    },
    {
      q: isBm ? 'Bagaimanakah sistem penghantaran berfungsi?' : 'How does delivery work?',
      a: isBm
        ? 'Pengguna boleh memilih untuk ambil sendiri (percuma) atau guna perkhidmatan penghantaran. Di bawah 5 km adalah PERCUMA, dan melebihi 5 km dikenakan caj berdasarkan jarak (kadar cadangan RM0.30/km).'
        : 'Users can choose self-pickup (free) or delivery service. Under 5 km is FREE, and beyond 5 km is distance-based (starting rate RM0.30/km).'
    },
    {
      q: isBm ? 'Apakah kaedah pembayaran yang disokong?' : 'What payment options are supported?',
      a: isBm
        ? 'Pembeli boleh membayar menggunakan GrabPay, ShopeePay, Touch ’n Go eWallet, FPX, Tunai semasa Penghantaran (COD), dan SPayLater.'
        : 'Buyers can pay via GrabPay, ShopeePay, Touch ’n Go eWallet, FPX, Cash on Delivery (COD), and SPayLater.'
    },
    {
      q: isBm ? 'Siapakah yang boleh menjadi pembekal?' : 'Who can register as a supplier?',
      a: isBm
        ? 'Bukan sahaja kilang besar, malah kafe, restoran, hotel, kedai jahit, pembekal uniform, syarikat tekstil, dobi komersial, dan syarikat acara juga boleh menyalurkan sisa fabrik.'
        : 'Not only large factories, but also cafes, restaurants, hotels, tailors, uniform suppliers, commercial laundries, and event organizers can supply fabric scraps.'
    },
    {
      q: isBm ? 'Bagaimana pengesahan kelayakan B40 dijalankan?' : 'How is B40 eligibility verified?',
      a: isBm
        ? 'PasarKita membolehkan anda menyemak status SARA di laman rasmi MyKasih dan mengesahkan kelayakan tanpa perlu memuat naik kad MyKad atau dokumen peribadi yang sensitif.'
        : 'PasarKita lets you check your SARA status on the official MyKasih site and confirm eligibility without uploading your MyKad or sensitive documents.'
    }
  ];

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-20 text-[#1E2923]">
      {/* 1. HERO SECTION */}
      <section className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E5DFD7] shadow-xs text-center space-y-7">
        <div className="inline-flex items-center gap-2 bg-[#eef5f1] text-[#234e3f] px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold border border-[#234e3f]/20">
          <span className="w-2.5 h-2.5 rounded-full bg-[#60a103] animate-pulse" />
          <span>{isBm ? 'Kurang Sisa. Lebih Peluang.' : 'Less Waste. More Opportunities.'}</span>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#1e3f33] tracking-tight leading-[1.15]">
            {isBm ? '“Tukar Sisa Fabrik Jadi Pendapatan.”' : '“Turn Fabric Waste Into Extra Income.”'}
          </h1>
          <p className="text-sm sm:text-lg text-[#40534C] max-w-2xl mx-auto leading-relaxed font-medium">
            {isBm
              ? 'Platform pengurusan tekstil menghubungkan pembekal perniagaan, pengumpul komuniti B40, dan pembeli fabrik di seluruh Malaysia.'
              : 'Empowering B40 community collectors, connecting surplus business textiles with ready upcyclers & craft buyers.'}
          </p>
        </div>

        {/* 5-Step Flow Visual */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5DFD7] max-w-2xl mx-auto shadow-xs">
          <p className="text-xs font-bold text-[#52796F] uppercase tracking-wider mb-2.5">
            {isBm ? 'Aliran Pantas PasarKita' : 'PasarKita Quick Flow'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-extrabold text-[#1e3f33]">
            <span className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E5DFD7]">
              🏢 {isBm ? 'Pembekal' : 'Supplier'}
            </span>
            <span className="text-[#234e3f]">→</span>
            <span className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E5DFD7]">
              🚶 {isBm ? 'Ambil / Hantar' : 'Collect/Deliver'}
            </span>
            <span className="text-[#234e3f]">→</span>
            <span className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E5DFD7]">
              🧺 {isBm ? 'Asingkan' : 'Sort'}
            </span>
            <span className="text-[#234e3f]">→</span>
            <span className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E5DFD7]">
              🛍️ {isBm ? 'Pembeli' : 'Buyer'}
            </span>
            <span className="text-[#234e3f]">→</span>
            <span className="bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
              💰 {isBm ? 'Dapat Bayaran' : 'Get Paid'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setIsRegModalOpen(true)}
            className="w-full sm:w-auto flex-1 bg-[#234e3f] hover:bg-[#1b3d31] text-white font-extrabold text-base py-4 px-8 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer touch-target"
          >
            <span>{isBm ? 'Mula Sekarang' : 'Get Started'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleScrollToHowItWorks}
            className="w-full sm:w-auto flex-1 bg-white hover:bg-[#FAF8F5] text-[#1e3f33] font-bold text-base py-4 px-6 rounded-2xl border-2 border-[#E5DFD7] transition cursor-pointer touch-target"
          >
            {isBm ? 'Lihat Cara Berfungsi' : 'See How It Works'}
          </button>
        </div>
      </section>

      {/* 2. DEDICATED ROLE DASHBOARD SELECTOR */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DFD7] shadow-xs space-y-7">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#234e3f] bg-[#eef5f1] px-3 py-1 rounded-full">
            {isBm ? 'Ruang Kerja Khusus' : 'Dedicated Workspaces'}
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1e3f33]">
            {isBm ? 'Pilih Pengalaman Mengikut Peranan' : 'Choose Your Dedicated Dashboard'}
          </h2>
          <p className="text-xs sm:text-sm text-[#40534C]">
            {isBm
              ? 'Pengalaman Pengumpul B40, Portal Pembekal, dan Pasaran Pembeli diasingkan dengan teratur.'
              : 'B40 Collector, Supplier Portal, and Buyer Marketplace are purpose-built and kept distinct.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* 1. B40 Collector */}
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border-2 border-[#234e3f] shadow-sm flex flex-col justify-between space-y-5 relative">
            <span className="bg-[#234e3f] text-white text-[11px] font-extrabold px-3 py-1 rounded-bl-xl absolute top-0 right-0">
              {isBm ? 'Komuniti B40' : 'B40 Community'}
            </span>

            <div className="space-y-3">
              <span className="text-3xl block">👩</span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#1e3f33]">
                {isBm ? 'Pengumpul Komuniti B40' : 'B40 Collector'}
              </h3>
              <p className="text-xs sm:text-sm text-[#40534C] leading-relaxed">
                {isBm
                  ? 'Cari sisa fabrik terdekat, pilih kaedah ambil sendiri atau hantar, asingkan di rumah, dan terima bayaran terus.'
                  : 'Find surplus fabrics, pick collection method, sort at home, and earn direct income without capital.'}
              </p>

              <div className="bg-white p-3 rounded-xl border border-[#E5DFD7] text-xs text-[#234e3f] font-bold space-y-1">
                <div>✓ {isBm ? 'Pengesahan SARA/MyKasih mudah' : 'Quick SARA/MyKasih verification'}</div>
                <div>✓ {isBm ? 'Penghantaran percuma ≤5 km' : 'Free delivery ≤5 km'}</div>
                <div>✓ {isBm ? 'Padanan pembeli automatik' : 'Automatic buyer matching'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToCollector}
              className="w-full bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold text-base py-3.5 px-5 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer touch-target"
            >
              <span>{isBm ? 'Buka Dashboard B40' : 'Open Collector Dashboard'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Supplier */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5DFD7] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#234e3f] transition">
            <div className="space-y-3">
              <span className="text-3xl block">🏢</span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#1e3f33]">
                {isBm ? 'Portal Pembekal' : 'Supplier Portal'}
              </h3>
              <p className="text-xs sm:text-sm text-[#40534C] leading-relaxed">
                {isBm
                  ? 'Kafe, restoran, hotel, kilang, kedai jahit, dobi, dan syarikat tekstil boleh memuat naik sisa fabrik secara percuma atau berbayar.'
                  : 'Hotels, cafes, restaurants, tailors, laundries, and manufacturers can list scraps as Free or Paid.'}
              </p>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DFD7] text-xs text-[#52796F] font-medium space-y-1">
                <div>• {isBm ? 'Kategori sumber terperinci' : 'Detailed supplier source types'}</div>
                <div>• {isBm ? 'Pilihan sisa percuma / berbayar' : 'Free / Paid / Negotiable terms'}</div>
                <div>• {isBm ? 'Sokongan pengurusan CSR sisa tekstil' : 'Zero-waste ESG textile reduction'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToSupplier}
              className="w-full bg-[#234e3f] hover:bg-[#1b3d31] text-white font-extrabold text-base py-3.5 px-5 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer touch-target"
            >
              <span>{isBm ? 'Buka Portal Pembekal' : 'Open Supplier Portal'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* 3. Buyer */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5DFD7] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#234e3f] transition">
            <div className="space-y-3">
              <span className="text-3xl block">🛍️</span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#1e3f33]">
                {isBm ? 'Pasaran Pembeli Fabrik' : 'Buyer Marketplace'}
              </h3>
              <p className="text-xs sm:text-sm text-[#40534C] leading-relaxed">
                {isBm
                  ? 'Cari bahan sisa fabrik yang telah diasingkan dan dibersihkan. Pelbagai pilihan bayaran termasuk GrabPay, TNG, ShopeePay, FPX & COD.'
                  : 'Source clean reclaimed textiles sorted by B40 collectors. Pay with GrabPay, TNG, ShopeePay, FPX, or COD.'}
              </p>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DFD7] text-xs text-[#52796F] font-medium space-y-1">
                <div>• {isBm ? 'Harga bahan berasingan dari kos hantar' : 'Separated material price & delivery fee'}</div>
                <div>• {isBm ? 'Penghantaran ikut jarak (RM0.30/km)' : 'Distance-based fee (RM0.30/km)'}</div>
                <div>• {isBm ? 'Sokongan pembiayaan SPayLater' : 'Multiple e-wallets & SPayLater'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToBuyer}
              className="w-full bg-[#234e3f] hover:bg-[#1b3d31] text-white font-extrabold text-base py-3.5 px-5 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer touch-target"
            >
              <span>{isBm ? 'Buka Pasaran Pembeli' : 'Open Buyer Marketplace'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP HOW IT WORKS */}
      <section id="section-how-it-works" className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#E5DFD7] shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#234e3f] bg-white px-3 py-1 rounded-full border border-[#E5DFD7]">
            {isBm ? 'Panduan Pengumpul B40' : 'B40 Collector Journey'}
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1e3f33]">
            {isBm ? 'Aliran Langkah demi Langkah' : 'Step-by-Step Flow'}
          </h2>
          <p className="text-xs sm:text-sm text-[#40534C]">
            {isBm
              ? 'Langkah telus dan mudah daripada mendaftar sehingga wang dimasukkan ke akaun anda.'
              : 'Clear, reassuring steps from signup until payment reaches your wallet.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] space-y-2">
            <span className="text-xs font-black text-[#234e3f] bg-[#eef5f1] px-2.5 py-1 rounded-lg">
              01 · CARI & PILIH
            </span>
            <h4 className="font-bold text-base text-[#1e3f33]">
              {isBm ? 'Pilih Bahan & Kaedah' : 'Select Material & Pickup'}
            </h4>
            <p className="text-xs text-[#40534C] leading-relaxed">
              {isBm
                ? 'Semak lokasi, jenis sisa, dan status harga percuma atau berbayar. Pilih ambil sendiri atau guna penghantaran.'
                : 'Review location, scrap type, and pricing. Choose self-pickup or delivery request.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] space-y-2">
            <span className="text-xs font-black text-[#234e3f] bg-[#eef5f1] px-2.5 py-1 rounded-lg">
              02 · ASINGKAN DI RUMAH
            </span>
            <h4 className="font-bold text-base text-[#1e3f33]">
              {isBm ? 'Asingkan Jenis & Keadaan' : 'Sort by Type & Quality'}
            </h4>
            <p className="text-xs text-[#40534C] leading-relaxed">
              {isBm
                ? 'Asingkan kain mengikut kapas, denim atau campuran. Ambil gambar dan masukkan kuantiti.'
                : 'Classify fabric into cotton, denim, or mixed. Take a photo and confirm piece count.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] space-y-2">
            <span className="text-xs font-black text-[#234e3f] bg-[#eef5f1] px-2.5 py-1 rounded-lg">
              03 · JUAL & BAYARAN
            </span>
            <h4 className="font-bold text-base text-[#1e3f33]">
              {isBm ? 'Padan Pembeli & Terima Wang' : 'Match Buyer & Get Paid'}
            </h4>
            <p className="text-xs text-[#40534C] leading-relaxed">
              {isBm
                ? 'PasarKita memadankan kain anda dengan pembeli. Bayaran terus masuk ke dompet anda sedia dikeluarkan.'
                : 'PasarKita automatically pairs your listing with buyers. Earnings go straight to your withdrawable wallet.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DFD7] shadow-xs space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#234e3f] bg-[#eef5f1] px-3 py-1 rounded-full">
            {isBm ? 'Soalan Lazim' : 'FAQ'}
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1e3f33]">
            {isBm ? 'Pertanyaan Kerap Ditanya' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="bg-[#FAF8F5] rounded-2xl border border-[#E5DFD7] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-[#1e3f33] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="w-6 h-6 rounded-full bg-white border border-[#E5DFD7] flex items-center justify-center shrink-0">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#40534C] leading-relaxed border-t border-[#E5DFD7]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="bg-[#234e3f] text-white rounded-3xl p-8 sm:p-12 shadow-lg text-center space-y-6">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            {isBm ? 'Sedia Untuk Bermula Bersama PasarKita?' : 'Ready to Start with PasarKita?'}
          </h2>
          <p className="text-xs sm:text-sm text-white/80">
            {isBm
              ? 'Daftar secara percuma sekarang dan sertai pergerakan ekonomi kitaran tekstil Malaysia.'
              : 'Sign up for free today and join Malaysia’s textile circular economy movement.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onGoToAuth('collector', 'signup')}
            className="px-6 py-3.5 bg-[#60a103] hover:bg-[#528c02] text-white font-extrabold rounded-2xl shadow-sm text-sm"
          >
            {isBm ? 'Daftar Sebagai Pengumpul B40' : 'Sign Up as B40 Collector'}
          </button>
          <button
            type="button"
            onClick={() => onGoToAuth('supplier', 'signup')}
            className="px-6 py-3.5 bg-white text-[#234e3f] font-extrabold rounded-2xl shadow-sm text-sm hover:bg-slate-100"
          >
            {isBm ? 'Daftar Sebagai Pembekal' : 'Sign Up as Supplier'}
          </button>
          <button
            type="button"
            onClick={() => onGoToAuth('buyer', 'signup')}
            className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl border border-white/30 text-sm"
          >
            {isBm ? 'Daftar Sebagai Pembeli' : 'Sign Up as Buyer'}
          </button>
        </div>
      </section>

      {/* Interactive Registration Modal */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        language={language}
        onGoToAuth={(r) => onGoToAuth(r, 'signup')}
        onViewHowItWorks={handleScrollToHowItWorks}
      />
    </div>
  );
};
