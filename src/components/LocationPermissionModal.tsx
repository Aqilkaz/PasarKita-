import React, { useState } from 'react';
import { AppLanguage, UserLocation } from '../types';
import { MapPin, Shield, AlertTriangle, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { getApproximateAreaName } from '../utils/distance';

interface LocationPermissionModalProps {
  language: AppLanguage;
  onAllowLocation: (location: UserLocation) => void;
  onNotNow: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  language,
  onAllowLocation,
  onNotNow
}) => {
  const isBm = language === 'bm';
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestLocation = () => {
    setLoading(true);
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setLoading(false);
      setErrorMessage(
        isBm
          ? 'Pelayar anda tidak menyokong geolokasi. Anda boleh meneruskan menggunakan lokasi anggaran standard.'
          : 'Geolocation is not supported by your browser. You can continue using estimated area.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const approxArea = getApproximateAreaName(lat, lng);

        const userLoc: UserLocation = {
          lat,
          lng,
          approximateArea: approxArea,
          isApproximate: true
        };

        setLoading(false);
        onAllowLocation(userLoc);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage(
              isBm
                ? 'Kebenaran lokasi telah ditolak dalam pelayar anda. Anda boleh teruskan menggunakan anggaran kawasan atau aktifkan di tetapan pelayar.'
                : 'Location permission was denied by your browser. You can continue with standard distances or enable it in your browser settings.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage(
              isBm
                ? 'Maklumat lokasi peranti anda tidak dapat dikesan pada masa ini.'
                : 'Device location information is currently unavailable.'
            );
            break;
          case error.TIMEOUT:
            setErrorMessage(
              isBm
                ? 'Permintaan lokasi telah melebihi had masa. Sila cuba lagi atau pilih "Not Now".'
                : 'Location request timed out. Please try again or select "Not Now".'
            );
            break;
          default:
            setErrorMessage(
              isBm
                ? 'Ralat semasa mendapatkan lokasi. Sila cuba lagi.'
                : 'An unexpected error occurred while obtaining location. Please try again.'
            );
            break;
        }
      },
      {
        enableHighAccuracy: false, // Low battery consumption, fast response
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e8dfd5] my-auto space-y-6 text-center">
        {/* Visual Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-[#eef5f1] text-[#234e3f] mx-auto flex items-center justify-center shadow-xs border border-[#234e3f]/20">
          <MapPin className="w-9 h-9 text-[#234e3f]" />
        </div>

        {/* Title & Explicit User Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#eef5f1] text-[#234e3f] px-3 py-1 rounded-full text-xs font-bold border border-[#234e3f]/20">
            <Navigation className="w-3.5 h-3.5 text-[#60a103]" />
            <span>{isBm ? 'Kebenaran Lokasi B40' : 'B40 Location Permission'}</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1e3f33]">
            {isBm ? 'Kesan Peluang Berdekatan' : 'Find Nearby Opportunities'}
          </h2>

          <p className="text-xs sm:text-sm text-[#40534C] leading-relaxed font-medium">
            Your location helps us find fabric waste opportunities near you and match you with nearby suppliers.
          </p>
          {isBm && (
            <p className="text-[11px] text-[#52796F] italic">
              (Lokasi anda membantu kami mencari peluang sisa fabrik berdekatan dan memadankan anda dengan pembekal terdekat.)
            </p>
          )}
        </div>

        {/* Privacy Note: exact coordinates are never exposed */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#e5dfd7] text-left text-xs space-y-1.5 text-[#315f4f]">
          <div className="flex items-center gap-2 font-bold text-[#1e3f33]">
            <Shield className="w-4 h-4 text-[#234e3f] shrink-0" />
            <span>{isBm ? 'Privasi Anda Dilindungi' : 'Your Privacy is Protected'}</span>
          </div>
          <p className="text-[11px] text-[#52796F] leading-relaxed">
            {isBm
              ? 'Koordinat tepat anda tidak akan didedahkan kepada pengguna lain. Hanya anggaran jarak kasar (contoh: 5 km) dipaparkan untuk mengira kos penghantaran.'
              : 'Your exact coordinates are never exposed to other users or suppliers. Only approximate distances (e.g. 5 km) are used to compute delivery and nearby pickup.'}
          </p>
        </div>

        {/* Error message box if failed */}
        {errorMessage && (
          <div className="bg-red-50 text-red-900 border border-red-200 p-3.5 rounded-2xl text-xs text-left space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
            <div className="text-[11px] text-red-700">
              {isBm
                ? 'Anda boleh memilih "Not Now" untuk terus menggunakan aplikasi dengan anggaran lokasi PPR Pantai Dalam.'
                : 'You can select "Not Now" to continue using the app with estimated Pantai Dalam area.'}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleRequestLocation}
            disabled={loading}
            className="w-full bg-[#60a103] hover:bg-[#528c02] active:scale-[0.99] text-white font-extrabold text-base py-3.5 px-5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer touch-target disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isBm ? 'Mendapatkan Lokasi...' : 'Detecting Location...'}</span>
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5 text-white" />
                <span>Allow Location</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNotNow}
            disabled={loading}
            className="w-full py-3 text-center text-xs sm:text-sm font-bold text-[#40534C] hover:text-[#1e3f33] rounded-xl transition hover:bg-[#FAF8F5] cursor-pointer"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};
