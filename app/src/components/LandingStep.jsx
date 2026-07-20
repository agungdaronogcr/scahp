import React from 'react';
import { ClipboardList, ArrowRight, Play, BookOpen, ShieldCheck, Clock, GitCompareArrows } from 'lucide-react';
import { CRITERIA } from '../data/constants';

export default function LandingStep({ onNext, hasSavedData, onLoadSaved, onClearSaved }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-4 border border-blue-100 shadow-sm">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Pemilihan Data Analytics Stack untuk e-Audit dalam Pemeriksaan Pajak
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Kuesioner Penilaian Pakar Berbasis <strong>Analytic Hierarchy Process (AHP)</strong>
        </p>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-10">
        <div className="bg-white border border-slate-150 rounded-xl p-3 text-center shadow-sm">
          <ShieldCheck className="w-5 h-5 text-blue-900 mx-auto mb-1" />
          <div className="text-[11px] font-semibold text-slate-600">Aman &amp; rahasia</div>
        </div>
        <div className="bg-white border border-slate-150 rounded-xl p-3 text-center shadow-sm">
          <Clock className="w-5 h-5 text-blue-900 mx-auto mb-1" />
          <div className="text-[11px] font-semibold text-slate-600">20–30 menit</div>
        </div>
        <div className="bg-white border border-slate-150 rounded-xl p-3 text-center shadow-sm">
          <GitCompareArrows className="w-5 h-5 text-blue-900 mx-auto mb-1" />
          <div className="text-[11px] font-semibold text-slate-600">40 perbandingan</div>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="w-5 h-5 text-blue-900" />
          Pengantar Kuesioner Penelitian
        </h2>
        <div className="prose text-slate-600 leading-relaxed text-sm md:text-base space-y-4">
          <p>
            Yth. Bapak/Ibu Responden,
          </p>
          <p>
            Perkembangan pembukuan elektronik, sistem informasi, dan transaksi digital membuat pemeriksaan pajak semakin bergantung pada kemampuan memperoleh, menyiapkan, menganalisis, serta mendokumentasikan data elektronik. Kebutuhan tersebut sejalan dengan <strong>SE-25/PJ/2013 tentang Pedoman e-Audit dan SE-10/PJ/2017 mengenai petunjuk teknis pemeriksaan lapangan</strong>, yang menempatkan pengelolaan data elektronik sebagai bagian penting dalam pelaksanaan pemeriksaan pajak.
          </p>
          <p>
            Penelitian ini tidak berfokus pada pemilihan satu aplikasi audit tertentu. Objek yang dinilai adalah <em>data analytics stack</em>, yaitu konfigurasi perangkat dan prosedur yang bekerja secara terpadu untuk mendukung alur e-Audit secara menyeluruh, mulai dari pengambilan dan penyiapan data, analisis dan pengujian audit, data mining dan analitik lanjutan, visualisasi dan pelaporan, hingga kelayakan operasionalnya.
          </p>
          <p>
            Melalui metode AHP, penelitian ini bertujuan menentukan konfigurasi <em>data analytics stack</em> yang paling sesuai untuk mendukung e-Audit dalam pemeriksaan pajak. Penilaian dilakukan berdasarkan lima kriteria berikut.
          </p>
          <div className="space-y-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            {CRITERIA.map((criterion) => (
              <div key={criterion.code}>
                <h3 className="font-bold text-slate-900">{criterion.code} — {criterion.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{criterion.description}</p>
              </div>
            ))}
          </div>
          <p>
            Berdasarkan kelima kriteria tersebut, Bapak/Ibu akan membandingkan empat alternatif konfigurasi, yaitu <em>spreadsheet-centric lightweight stack</em>, <em>low-code analytics stack</em>, <em>script-assisted open analytics stack</em>, dan <em>reporting-oriented hybrid stack</em>. Alternatif tersebut tidak dimaksudkan sebagai pilihan terhadap satu merek atau produk tertentu, tetapi sebagai representasi kombinasi teknologi dengan kemampuan, fleksibilitas, tingkat kemudahan, biaya, dan kebutuhan dukungan yang berbeda.
          </p>
          <p>
            Penilaian Bapak/Ibu akan digunakan untuk menentukan bobot prioritas kriteria dan alternatif secara sistematis. Hasil penelitian diharapkan dapat menjadi kerangka rujukan operasional bagi pengembangan e-Audit berbasis <em>data analytics</em> yang sesuai dengan kebutuhan pemeriksaan pajak.
          </p>
          <p>
            Bapak/Ibu dipersilakan memberikan penilaian berdasarkan pengalaman, pengetahuan, dan pertimbangan profesional. Tidak terdapat jawaban benar atau salah. Jawaban digunakan hanya untuk kepentingan akademik dan akan disajikan secara agregat sehingga identitas serta penilaian individual responden tidak ditampilkan secara terbuka.
          </p>
          <p className="font-bold text-slate-800">
            Terima kasih atas waktu, kesediaan, dan kontribusi Bapak/Ibu. Pengalaman dan pertimbangan profesional Bapak/Ibu sangat berarti bagi kualitas dan relevansi penelitian ini.
          </p>
          <p>
            Hormat saya,
          </p>
          <p>
            <strong>Agung Darono</strong><br />
            Peneliti
          </p>
        </div>
      </div>

      {/* Saved Session Notification */}
      {hasSavedData && (
        <div className="bg-amber-50 border border-amber-250 rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-amber-900 text-sm md:text-base flex items-center gap-1.5">
              Sesi Pengisian Ditemukan!
            </h4>
            <p className="text-amber-700 text-xs md:text-sm mt-1">
              Anda memiliki data pengisian sebelumnya yang tersimpan di browser ini.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClearSaved}
              className="px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 rounded-xl transition duration-150"
            >
              Mulai Baru
            </button>
            <button
              onClick={onLoadSaved}
              className="px-5 py-2.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5"
            >
              Lanjutkan Pengisian
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center">
        {!hasSavedData && (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-2xl shadow-md transition duration-200 group transform hover:-translate-y-0.5"
          >
            Mulai Kuesioner
            <Play className="w-5 h-5 fill-current text-white/90 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
