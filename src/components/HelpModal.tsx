import React from 'react';
import { AppLanguage } from '../types';
import { Phone, MessageSquare, X, HelpCircle, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  language: AppLanguage;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ language, onClose }) => {
  const isBm = language === 'bm';

  const steps = [
    { num: 1, text: isBm ? 'Cari peluang' : 'Find opportunities', desc: isBm ? 'Pilih sisa kain berdekatan lokasi anda.' : 'Pick nearby textile scrap opportunities.' },
    { num: 2, text: isBm ? 'Ambil kain' : 'Collect fabric', desc: isBm ? 'Pilih ambil sendiri atau guna perkhidmatan penghantaran.' : 'Choose self-pickup or delivery service.' },
    { num: 3, text: isBm ? 'Asingkan kain' : 'Sort fabric', desc: isBm ? 'Asingkan mengikut jenis & keadaan kain di rumah.' : 'Sort by material type and condition at home.' },
    { num: 4, text: isBm ? 'Senaraikan kain' : 'List fabric', desc: isBm ? 'Ambil gambar dan sahkan senarai dengan mudah.' : 'Snap a photo and confirm the simple listing.' },
    { num: 5, text: isBm ? 'Tunggu pembeli' : 'Wait for buyer', desc: isBm ? 'PasarKita padankan pembeli tanpa perlu tawar-menawar.' : 'PasarKita auto-matches buyers without negotiation.' },
    { num: 6, text: isBm ? 'Terima bayaran' : 'Receive payment', desc: isBm ? 'Wang terus masuk ke dompet anda & boleh ditarik.' : 'Money goes directly into your earnings wallet.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e8dfd5] my-auto space-y-5">
        <div className="flex items-center justify-between border-b border-[#e8dfd5] pb-3">
          <div className="flex items-center gap-2 text-[#234e3f]">
            <HelpCircle className="w-5 h-5" />
            <h2 className="font-display font-extrabold text-xl text-[#1e3f33]">
              {isBm ? 'Bantuan PasarKita' : 'PasarKita Assistance'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#315f4f] hover:text-[#1e3f33] rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Steps Guide */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-xs text-[#1e3f33] uppercase tracking-wider">
            {isBm ? 'Panduan 6 Langkah Pengumpul:' : 'Collector 6-Step Guide:'}
          </h3>

          <div className="space-y-2">
            {steps.map((item) => (
              <div
                key={item.num}
                className="flex items-start gap-2.5 p-2.5 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7]"
              >
                <div className="w-6 h-6 rounded-full bg-[#234e3f] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {item.num}
                </div>
                <div>
                  <strong className="text-[#1e3f33] text-xs sm:text-sm block font-bold">
                    {item.text}
                  </strong>
                  <span className="text-[11px] text-[#52796F]">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Links */}
        <div className="pt-2 border-t border-[#e5dfd7] space-y-2.5">
          <h3 className="font-bold text-xs text-[#1e3f33] uppercase tracking-wider">
            {isBm ? 'Hubungi Pasukan Komuniti:' : 'Contact Community Support:'}
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://wa.me/60123456789"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-[#eef5f1] hover:bg-[#d8edd6] text-[#234e3f] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition border border-[#234e3f]/25"
            >
              <MessageSquare className="w-4 h-4 text-[#234e3f]" />
              <span>WhatsApp Kami</span>
            </a>

            <a
              href="tel:0380001234"
              className="p-3 bg-[#FAF8F5] hover:bg-[#FAF8F5]/80 text-[#1e3f33] font-extrabold text-xs rounded-xl border border-[#e5dfd7] flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-4 h-4 text-[#234e3f]" />
              <span>{isBm ? 'Talian Bebas Tol' : 'Toll-Free Helpline'}</span>
            </a>
          </div>

          <p className="text-[11px] text-[#52796F] text-center">
            {isBm
              ? 'Waktu operasi khidmat sokongan: Isnin – Sabtu (9:00 pagi – 6:00 petang).'
              : 'Helpline hours: Monday – Saturday (9:00 AM – 6:00 PM).'}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#60a103] hover:bg-[#528c02] text-white font-bold rounded-xl text-sm"
        >
          {isBm ? 'Saya Faham' : 'Got It'}
        </button>
      </div>
    </div>
  );
};
