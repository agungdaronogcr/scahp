import React from 'react';
import { ClipboardList, ArrowRight, Play, BookOpen, ShieldCheck, Clock, GitCompareArrows } from 'lucide-react';
import { CRITERIA, ALTERNATIVES } from '../data/constants';

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
          Kuesioner Penilaian Pakar dan Praktisi berbasis <strong>Analytic Hierarchy Process (AHP)</strong>
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
          Pengantar Penelitian
        </h2>
        <div className="prose text-slate-600 leading-relaxed text-sm md:text-base space-y-4">
          <p>
            Yth. Bapak/Ibu Responden,
          </p>
          <p>
            Perkembangan sistem informasi, pembukuan elektronik, dan transaksi digital membuat pemeriksaan pajak semakin bergantung pada kemampuan memperoleh, mengolah, menganalisis, dan mendokumentasikan data elektronik. Kebutuhan tersebut sejalan dengan SE-25/PJ/2013 tentang Pedoman e-Audit dan SE-10/PJ/2017 mengenai pelaksanaan pemeriksaan, yang menempatkan data elektronik sebagai bagian penting dalam proses pemeriksaan pajak.
          </p>
          <p>
            Penelitian ini tidak berfokus pada pemilihan satu aplikasi audit tertentu. Objek yang dinilai adalah <strong>data analytics stack</strong>, yaitu konfigurasi perangkat dan prosedur yang bekerja secara terpadu untuk mendukung alur e-Audit secara menyeluruh, mulai dari pengambilan dan penyiapan data, analisis dan pengujian audit, analitik lanjutan, visualisasi dan pelaporan, hingga tata kelola, keamanan, dan dukungan operasional.
          </p>
          <p>
            Melalui metode <strong>AHP</strong>, penelitian ini bertujuan menentukan konfigurasi data analytics stack yang paling sesuai untuk mendukung e-Audit dalam pemeriksaan pajak. Penilaian dilakukan berdasarkan enam kriteria utama berikut:
          </p>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong className="text-slate-800">Data Connectivity and Ingestion</strong> — Kemampuan mengakses dan mengambil data dari berbagai jenis file, database, aplikasi, Application Programming Interface (API), Enterprise Resource Planning (ERP), dan sumber digital lainnya secara mudah dan andal.
            </li>
            <li>
              <strong className="text-slate-800">Data Preparation and Management</strong> — Kemampuan membersihkan, mengubah, menggabungkan, memvalidasi, menyimpan, dan mengelola data agar siap digunakan dalam analisis audit.
            </li>
            <li>
              <strong className="text-slate-800">Audit Analytics and Testing Capability</strong> — Kemampuan menjalankan analisis dan pengujian audit, seperti profiling, rekonsiliasi, sampling, deteksi duplikasi, anomali, dan pola risiko.
            </li>
            <li>
              <strong className="text-slate-800">Advanced Analytics Capability</strong> — Kemampuan mendukung analitik lanjutan, termasuk analisis teks, machine learning, pemodelan, dan pengembangan teknik analisis baru.
            </li>
            <li>
              <strong className="text-slate-800">Reporting and Audit Communication</strong> — Kemampuan menyajikan hasil analisis dalam bentuk laporan, tabel, grafik, atau dashboard yang jelas dan mendukung tindak lanjut pemeriksaan.
            </li>
            <li>
              <strong className="text-slate-800">Governance, Security, and Operational Feasibility</strong> — Kemampuan menjaga kualitas, keamanan, integritas, dan keterlacakan data, sekaligus memastikan stack mudah digunakan, terjangkau, dan dapat didukung secara operasional.
            </li>
          </ol>
          <p>
            Berdasarkan kriteria tersebut, Bapak/Ibu akan membandingkan empat alternatif konfigurasi, yaitu <em>spreadsheet-centric lightweight stack</em>, <em>low-code analytics stack</em>, <em>script-assisted open analytics stack</em>, dan <em>reporting-oriented hybrid stack</em>. Keempat alternatif tersebut bukan pilihan terhadap satu merek atau produk tertentu, melainkan representasi kombinasi teknologi dengan tingkat kemampuan, kemudahan penggunaan, biaya, fleksibilitas, dan kebutuhan dukungan yang berbeda.
          </p>
          <p>
            Penilaian Bapak/Ibu akan digunakan untuk menentukan bobot prioritas kriteria, subkriteria, dan alternatif secara sistematis. Hasil penelitian diharapkan dapat menjadi kerangka rujukan operasional bagi pengembangan e-Audit berbasis analitika data yang efektif, terintegrasi, aman, dan realistis untuk diterapkan dalam pemeriksaan pajak.
          </p>
          <p>
            Bapak/Ibu dipersilakan memberikan penilaian berdasarkan pengalaman, pengetahuan, dan pertimbangan profesional. Tidak terdapat jawaban benar atau salah. Jawaban digunakan untuk kepentingan akademik dan disajikan secara agregat, sehingga identitas serta penilaian individual responden tidak ditampilkan secara terbuka.
          </p>
          <p>
            Terima kasih atas waktu, kesediaan, dan kontribusi Bapak/Ibu. Pengalaman dan pertimbangan profesional Bapak/Ibu sangat berarti bagi kualitas dan relevansi penelitian ini.
          </p>
          <p>
            Hormat saya,
          </p>
          <p>
            Agung Darono
          </p>
        </div>
      </div>

      {/* Model Overview: Criteria & Alternatives */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Criteria Summary */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
          <h3 className="font-bold text-slate-850 mb-3 text-sm tracking-wider uppercase text-blue-950">
            5 Kriteria Evaluasi
          </h3>
          <ul className="space-y-2.5">
            {CRITERIA.map((c) => (
              <li key={c.code} className="flex gap-3 items-start text-xs md:text-sm text-slate-700">
                <span className="font-semibold text-blue-900 bg-blue-100/60 px-1.5 py-0.5 rounded text-xs">
                  {c.code}
                </span>
                <div>
                  <strong className="text-slate-800">{c.name}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Alternatives Summary */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
          <h3 className="font-bold text-slate-850 mb-3 text-sm tracking-wider uppercase text-blue-950">
            4 Alternatif Stack
          </h3>
          <ul className="space-y-3">
            {ALTERNATIVES.map((a) => (
              <li key={a.code} className="text-xs md:text-sm text-slate-700">
                <div className="font-bold text-slate-850 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span>
                  {a.code}: {a.name}
                </div>
                <div className="text-slate-500 pl-3 text-xs italic mt-0.5">
                  {a.components}
                </div>
              </li>
            ))}
          </ul>
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
