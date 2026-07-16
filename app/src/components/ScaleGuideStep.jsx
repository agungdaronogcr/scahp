import React, { useState } from 'react';
import { Gauge, Info, ArrowRight } from 'lucide-react';
import { SAATY_SCALE } from '../data/constants';

const POSITIONS = [9, 7, 5, 3, 1, 3, 5, 7, 9];

export default function ScaleGuideStep({ onNext, onPrev }) {
  // Demonstration state
  const [demoSelected, setDemoSelected] = useState('left');
  const [demoIntensity, setDemoIntensity] = useState(3);

  const getDemoDescription = () => {
    if (demoSelected === 'equal') return 'Kriteria A dan Kriteria B sama penting / sama sesuai.';
    const side = demoSelected === 'left' ? 'Kriteria A' : 'Kriteria B';
    const otherSide = demoSelected === 'left' ? 'Kriteria B' : 'Kriteria A';
    const found = SAATY_SCALE.find(s => s.value === demoIntensity);
    const intensityText = found ? found.label.split(' / ')[0].toLowerCase() : 'lebih penting dibanding';
    return `${side} ${intensityText} daripada ${otherSide} (${demoIntensity})`;
  };

  const handlePick = (position, index) => {
    if (position === 1) {
      setDemoSelected('equal');
      setDemoIntensity(1);
      return;
    }
    setDemoSelected(index < 4 ? 'left' : 'right');
    setDemoIntensity(position);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-3 border border-blue-150 shadow-sm">
          <Gauge className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Panduan Skala Perbandingan AHP</h2>
        <p className="text-slate-500">Gunakan skala diskret 1, 3, 5, 7, dan 9 untuk menyatakan kekuatan preferensi.</p>
      </div>

      {/* Saaty Scale Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 text-base mb-4">Skala Perbandingan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Skor</th>
                <th className="py-2.5 px-3">Definisi</th>
                <th className="py-2.5 px-3">Penjelasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SAATY_SCALE.map((s) => (
                <tr key={s.value} className="hover:bg-slate-50 transition duration-100">
                  <td className="py-3 px-3 font-bold text-blue-900 text-sm">{s.value}</td>
                  <td className="py-3 px-3 font-semibold">{s.label}</td>
                  <td className="py-3 px-3 text-slate-550 italic text-xs">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs md:text-sm text-blue-800 mt-4">
          <Info className="w-5 h-5 shrink-0" />
          <p>
            Pilih sisi kiri atau kanan, lalu pilih intensitas 3, 5, 7, atau 9. Pilih titik tengah bernilai 1 apabila kedua elemen sama penting atau sama sesuai.
            Nilai 2, 4, 6, dan 8 tidak digunakan dalam kuesioner ini. Posisi awal wajib belum terisi agar sistem tidak merekam jawaban otomatis.
          </p>
        </div>
      </div>

      {/* Interactive Demonstration */}
      <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-6 md:p-8 mb-8">
        <h3 className="font-bold text-blue-950 text-base mb-4">Contoh Interaktif</h3>

        <div className="bg-white p-5 rounded-xl border border-blue-150 shadow-sm mb-4">
          <div className="flex justify-between text-xs md:text-sm font-semibold text-slate-600 mb-4">
            <span>Kriteria A lebih penting</span>
            <span>Sama</span>
            <span>Kriteria B lebih penting</span>
          </div>
          <div className="flex justify-between items-center gap-1 md:gap-2">
            {POSITIONS.map((pos, idx) => {
              const isActive = pos === 1
                ? demoSelected === 'equal'
                : (idx < 4 ? demoSelected === 'left' : demoSelected === 'right') && demoIntensity === pos;
              return (
                <button
                  key={idx}
                  onClick={() => handlePick(pos, idx)}
                  title={String(pos)}
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full text-[11px] font-bold transition duration-150 cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-900 text-white ring-2 ring-blue-900/20 scale-110'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {pos}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Interpretation */}
        <div className="p-3 bg-blue-900 text-white rounded-xl text-xs md:text-sm font-semibold text-center shadow-sm">
          Pilihan saat ini: {getDemoDescription()}
        </div>
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
          Mulai Penilaian
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
