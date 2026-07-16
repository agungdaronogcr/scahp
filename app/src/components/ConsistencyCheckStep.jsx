import React, { useMemo } from 'react';
import { ClipboardCheck, AlertTriangle, ChevronRight } from 'lucide-react';
import { CRITERIA, ALTERNATIVES } from '../data/constants';
import { evaluateAHPSection, generatePairwiseCombinations } from '../utils/ahp';

export default function ConsistencyCheckStep({ onNext, onPrev, answers, jumpToStep, pwCriteriaStepIndex, pwAlternativesStepIndex }) {
  const results = useMemo(() => {
    const critCodes = CRITERIA.map(c => c.code);
    const criteriaEval = evaluateAHPSection(critCodes, answers.criteria || {});

    const altCodes = ALTERNATIVES.map(a => a.code);
    const altPairs = generatePairwiseCombinations(ALTERNATIVES);

    const perCriterion = CRITERIA.map((c) => {
      const subAnswers = {};
      altPairs.forEach(p => {
        const key = `alt-${c.code}-${p.left.code}-${p.right.code}`;
        subAnswers[`${p.left.code}-${p.right.code}`] = answers.alternatives?.[key];
      });
      const evalResult = evaluateAHPSection(altCodes, subAnswers);
      return { criterion: c, ...evalResult };
    });

    return { criteriaEval, perCriterion };
  }, [answers]);

  const rows = [
    { label: 'Antarkriteria', n: CRITERIA.length, cr: results.criteriaEval.cr, jump: pwCriteriaStepIndex },
    ...results.perCriterion.map(r => ({
      label: `Alternatif pada ${r.criterion.code}`,
      n: ALTERNATIVES.length,
      cr: r.cr,
      jump: pwAlternativesStepIndex
    }))
  ];

  const hasInconsistency = rows.some(r => r.cr > 0.10);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-3 border border-blue-150 shadow-sm">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pemeriksaan Konsistensi Jawaban</h2>
        <p className="text-slate-500">Sistem menghitung Consistency Ratio (CR) untuk setiap matriks perbandingan.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Matriks</th>
                <th className="py-2.5 px-3 text-center">Jumlah Elemen</th>
                <th className="py-2.5 px-3 text-center">CR</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((r) => {
                const isOk = r.cr <= 0.10;
                return (
                  <tr key={r.label} className="hover:bg-slate-50 transition duration-100">
                    <td className="py-3 px-3 font-semibold">{r.label}</td>
                    <td className="py-3 px-3 text-center">{r.n}</td>
                    <td className="py-3 px-3 text-center font-bold">{r.cr.toFixed(2)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOk ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isOk ? 'Konsisten' : 'Perlu ditinjau'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {!isOk && (
                        <button
                          onClick={() => jumpToStep(r.jump)}
                          className="text-[11px] font-bold text-blue-900 hover:underline"
                        >
                          Tinjau ulang
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {hasInconsistency && (
          <div className="bg-amber-50 border border-amber-250 rounded-xl p-4 mt-5 flex gap-2.5 text-xs md:text-sm text-amber-800">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              Satu atau lebih matriks memiliki CR di atas 0,10. Anda dapat kembali meninjau perbandingan yang bersangkutan, atau tetap melanjutkan — jawaban Anda akan tetap disimpan.
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-400 mt-4 italic">
          Aturan: CR ≤ 0,10 = konsisten; CR &gt; 0,10 = perlu ditinjau.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1"
        >
          Lanjut ke Penyelesaian
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
