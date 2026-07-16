import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { CRITERIA, ALTERNATIVES } from '../data/constants';

export default function StackExplanationStep({ onNext, onPrev }) {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-3 border border-blue-150 shadow-sm">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Apa Itu Data Analytics Stack untuk e-Audit?</h2>
        <p className="text-slate-500">Pahami objek yang akan dinilai sebelum memberikan penilaian.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6 text-slate-600 leading-relaxed text-sm md:text-base">
        <p>
          Data analytics stack adalah konfigurasi perangkat dan teknologi yang bekerja secara terpadu untuk memperoleh, menyiapkan, menyimpan, menguji, menambang, memvisualisasikan, dan melaporkan data elektronik dalam pemeriksaan pajak. Stack bukan satu aplikasi tunggal. Empat kriteria menilai kapabilitas fungsional, sedangkan satu kriteria menilai kelayakan operasional seluruh konfigurasi.
        </p>
      </div>

      {/* Alur ringkas */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-8 text-center">
        {['Data & Repository', 'Audit & Data Mining', 'Visualisasi & Pelaporan'].map((label, idx, arr) => (
          <React.Fragment key={label}>
            <div className="bg-blue-950 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm">
              {label}
            </div>
            {idx < arr.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Criteria cards */}
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">5 Kriteria Penilaian</h3>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {CRITERIA.map((c) => (
          <div key={c.code} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-xs shrink-0">
                {c.code}
              </span>
              <span className="font-bold text-slate-800 text-sm">{c.shortName}</span>
            </div>
            <p className="text-slate-500 text-xs">{c.shortDescription}</p>
          </div>
        ))}
      </div>

      {/* Alternatives cards */}
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">4 Alternatif Stack</h3>
      <div className="space-y-3 mb-4">
        {ALTERNATIVES.map((a) => (
          <div key={a.code} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="font-bold text-slate-800 text-sm mb-0.5">
              <span className="text-blue-900">{a.code}</span> &nbsp;{a.name}
            </div>
            <p className="text-blue-900/80 font-semibold text-xs italic">{a.components}</p>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-[11px] italic mb-8">
        Catatan A4: dinilai sebagai kelas perangkat dengan fitur minimum yang sebanding—import, audit testing, automation/scripting, dan reporting.
      </p>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5 group"
        >
          Saya Memahami, Lanjut
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
