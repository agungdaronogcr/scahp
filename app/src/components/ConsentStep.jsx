import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const CONSENT_POINTS = [
  'Partisipasi Bapak/Ibu bersifat sukarela dan dapat dihentikan sewaktu-waktu tanpa konsekuensi.',
  'Data profil digunakan hanya untuk memastikan kesesuaian responden dengan kebutuhan penelitian berbasis penilaian pakar.',
  'Jawaban digunakan untuk kepentingan akademik dan hasil penelitian disajikan dalam bentuk rekapitulasi kelompok.',
  'Kuesioner tidak meminta data rahasia Wajib Pajak, dokumen pemeriksaan, atau informasi yang dilindungi.',
  'Jawaban akhir disimpan secara aman dalam Google Sheet privat yang hanya dapat diakses oleh tim penelitian.',
  'Draf pengisian dapat disimpan sementara di browser dan/atau sebagai status DRAFT pada Google Sheet.'
];

export default function ConsentStep({ onNext, onPrev, consentChecked, setConsentChecked }) {
  const handleProceed = () => {
    if (consentChecked) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-2xl mb-4 border border-green-100">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Persetujuan Keikutsertaan</h2>
        <p className="text-slate-500">Sebelum memulai pengisian, mohon membaca pernyataan berikut dengan saksama.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Pernyataan Persetujuan</h3>
        <ul className="space-y-3">
          {CONSENT_POINTS.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-slate-600 leading-relaxed">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Checkbox */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-blue-900 focus:ring-blue-900 mt-0.5"
          />
          <span className="text-xs md:text-sm text-slate-700 font-medium leading-snug">
            Saya telah membaca dan memahami informasi di atas serta bersedia berpartisipasi dalam penelitian ini.
          </span>
        </label>
        <p className="text-[11px] text-slate-400 mt-2 pl-8">Tombol "Lanjut" aktif setelah kotak persetujuan dipilih.</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={handleProceed}
          disabled={!consentChecked}
          className={`px-6 py-3 font-semibold rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5 ${
            consentChecked
              ? 'bg-blue-900 hover:bg-blue-950 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
