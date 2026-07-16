import React from 'react';
import { Network, ArrowRight } from 'lucide-react';
import { CRITERIA, ALTERNATIVES } from '../data/constants';

export default function AhpStructureStep({ onNext, onPrev }) {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-3 border border-blue-150 shadow-sm">
          <Network className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Struktur Hierarki Keputusan AHP</h2>
        <p className="text-slate-500">Model disederhanakan menjadi tiga tingkat: tujuan, lima kriteria, dan empat alternatif stack.</p>
      </div>

      {/* Goal */}
      <div className="bg-blue-950 text-white rounded-2xl p-5 text-center mb-4 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">Tujuan</div>
        <div className="font-bold text-sm md:text-base">
          Memilih data analytics stack yang paling sesuai untuk mendukung e-Audit dalam pemeriksaan pajak
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-slate-300"></div>
      </div>

      {/* Criteria */}
      <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">5 Kriteria</div>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {CRITERIA.map((c) => (
          <div key={c.code} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-xs shrink-0">
                {c.code}
              </span>
              <span className="font-bold text-slate-800 text-sm leading-snug">{c.name}</span>
            </div>
            <p className="text-slate-500 text-xs">{c.description}</p>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-xs italic text-center mb-4">
        Setiap alternatif dinilai terhadap kelima kriteria yang sama; tidak ada alternatif yang ditetapkan unggul sebelum penilaian pakar.
      </p>

      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-slate-300"></div>
      </div>

      {/* Alternatives */}
      <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">4 Alternatif Stack</div>
      <div className="space-y-3 mb-8">
        {ALTERNATIVES.map((a) => (
          <div key={a.code} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="font-bold text-slate-800 text-sm mb-0.5">
              <span className="text-blue-900">{a.code}</span> &nbsp;{a.name}
            </div>
            <p className="text-blue-900/80 font-semibold text-xs italic">{a.components}</p>
          </div>
        ))}
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
          onClick={onNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5 group"
        >
          Saya Memahami Struktur
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
