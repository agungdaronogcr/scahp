import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

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
        <p className="text-slate-500">Lembar Persetujuan Responden (Informed Consent)</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6 text-slate-600 leading-relaxed text-sm md:text-base space-y-4">
        <p>
          Sebelum memulai pengisian, mohon membaca pernyataan berikut dengan saksama.
        </p>

        <p>
          Partisipasi Bapak/Ibu dalam kuesioner ini bersifat sukarela. Bapak/Ibu dapat menghentikan pengisian sewaktu-waktu tanpa konsekuensi apa pun.
        </p>

        <p>
          Data profil responden, seperti nama, instansi/unit kerja, jabatan atau peran, bidang keahlian, dan lama pengalaman, digunakan hanya untuk memastikan kesesuaian responden dengan kebutuhan penelitian berbasis penilaian pakar.
        </p>

        <p>
          Jawaban Bapak/Ibu akan digunakan untuk kepentingan akademik, khususnya dalam penyusunan prioritas pemilihan <strong>data analytics stack</strong> untuk <strong>e-Audit</strong> dalam pemeriksaan pajak. Hasil penelitian akan disajikan dalam bentuk rekapitulasi kelompok, sehingga identitas individual responden tidak ditampilkan secara terbuka.
        </p>

        <p>
          Kuesioner ini tidak meminta data rahasia Wajib Pajak, dokumen pemeriksaan, atau informasi lain yang dilindungi ketentuan kerahasiaan jabatan. Apabila terdapat pertanyaan terbuka, mohon memberikan jawaban dalam bentuk umum tanpa menyebutkan identitas Wajib Pajak atau kasus pemeriksaan tertentu.
        </p>

        <p>
          Pengisian kuesioner diperkirakan memerlukan waktu sekitar <strong>15–20 menit</strong>, karena mencakup validasi relevansi dan perbandingan berpasangan dengan skala AHP.
        </p>

        <p>
          Penilaian Bapak/Ibu akan diolah menggunakan prosedur AHP, termasuk agregasi penilaian pakar dan pengujian konsistensi. Uji konsistensi digunakan untuk menilai keteraturan logis jawaban, bukan untuk menilai benar atau salahnya pendapat responden.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs md:text-sm text-blue-800">
          <Info className="w-5 h-5 shrink-0" />
          <p>
            Pernyataan persetujuan di bawah ini diperlukan untuk memastikan bahwa Bapak/Ibu memahami tujuan penelitian dan bersedia berpartisipasi secara sukarela.
          </p>
        </div>
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
            Saya telah membaca penjelasan di atas, memahami tujuan penelitian ini, dan bersedia secara sukarela berpartisipasi sebagai responden. Saya juga memahami bahwa jawaban saya akan digunakan secara agregat untuk kepentingan penelitian akademik.
          </span>
        </label>
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
          Setuju & Lanjut
        </button>
      </div>
    </div>
  );
}
