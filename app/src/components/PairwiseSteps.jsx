import React, { useState, useEffect } from 'react';
import { ChevronRight, AlertTriangle, AlertCircle } from 'lucide-react';
import { CRITERIA, ALTERNATIVES } from '../data/constants';
import { generatePairwiseCombinations, evaluateAHPSection } from '../utils/ahp';

// Individual Row Component for Pairwise Question
function PairwiseRow({ leftItem, rightItem, value, onChange, index, total }) {
  const selected = value?.selected || null;
  const intensity = value?.intensity || 1;
  const reason = value?.reason || '';

  const handleSelection = (side) => {
    if (side === 'equal') {
      onChange({ selected: 'equal', intensity: 1, reason });
    } else {
      onChange({ selected: side, intensity: intensity === 1 ? 3 : intensity, reason });
    }
  };

  const handleIntensity = (val) => {
    onChange({ selected, intensity: Number(val), reason });
  };

  const handleReason = (e) => {
    onChange({ selected, intensity, reason: e.target.value });
  };

  const intensityOptions = [3, 5, 7, 9];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6 mb-5">
      {/* Row Heading */}
      {index !== undefined && (
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Perbandingan {index + 1} dari {total}
        </div>
      )}

      {/* Main Grid: Left - Equal - Right */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
        {/* Left Item Card */}
        <button
          type="button"
          onClick={() => handleSelection('left')}
          className={`col-span-3 p-4 rounded-xl border text-left transition duration-150 h-full flex flex-col justify-between cursor-pointer ${
            selected === 'left'
              ? 'border-blue-900 bg-blue-50/50 ring-2 ring-blue-900/10'
              : 'border-slate-200 bg-white hover:border-slate-350'
          }`}
        >
          <div>
            <div className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 mb-1">
              {leftItem.code}
            </div>
            <div className="font-bold text-slate-800 text-sm md:text-base leading-snug">
              {leftItem.name || leftItem.code}
            </div>
            {leftItem.components && (
              <div className="text-blue-900/80 font-bold text-xs italic mt-0.5">
                {leftItem.components}
              </div>
            )}
          </div>
          {leftItem.description && (
            <div className="text-slate-500 text-xs mt-2 italic leading-normal">
              {leftItem.description.slice(0, 100)}...
            </div>
          )}
        </button>

        {/* Equal button */}
        <div className="col-span-1 flex justify-center">
          <button
            type="button"
            onClick={() => handleSelection('equal')}
            className={`w-full md:w-auto px-3 py-3 rounded-xl border text-center transition duration-150 cursor-pointer text-xs font-semibold ${
              selected === 'equal'
                ? 'border-blue-900 bg-blue-50 text-blue-950 font-bold'
                : 'border-slate-200 bg-white hover:border-slate-350 text-slate-650'
            }`}
          >
            Sama
            <div className="text-[10px] text-slate-400 font-normal mt-0.5">Skor = 1</div>
          </button>
        </div>

        {/* Right Item Card */}
        <button
          type="button"
          onClick={() => handleSelection('right')}
          className={`col-span-3 p-4 rounded-xl border text-left transition duration-150 h-full flex flex-col justify-between cursor-pointer ${
            selected === 'right'
              ? 'border-blue-900 bg-blue-50/50 ring-2 ring-blue-900/10'
              : 'border-slate-200 bg-white hover:border-slate-350'
          }`}
        >
          <div>
            <div className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 mb-1">
              {rightItem.code}
            </div>
            <div className="font-bold text-slate-800 text-sm md:text-base leading-snug">
              {rightItem.name || rightItem.code}
            </div>
            {rightItem.components && (
              <div className="text-blue-900/80 font-bold text-xs italic mt-0.5">
                {rightItem.components}
              </div>
            )}
          </div>
          {rightItem.description && (
            <div className="text-slate-500 text-xs mt-2 italic leading-normal">
              {rightItem.description.slice(0, 100)}...
            </div>
          )}
        </button>
      </div>

      {/* Intensity Selector if not Equal */}
      {selected && selected !== 'equal' && (
        <div className="mt-4 border-t border-slate-100 pt-4 animate-fadeIn">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Tingkat Keunggulan ({selected === 'left' ? leftItem.code : rightItem.code} Lebih Penting/Sesuai):
            <span className="text-sm font-extrabold text-blue-900 ml-1.5">{intensity}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {intensityOptions.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleIntensity(v)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                  intensity === v
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1 px-1">
            <span>Sedikit Lebih (3)</span>
            <span>Lebih Penting (5)</span>
            <span>Sangat Lebih (7)</span>
            <span>Mutlak Lebih (9)</span>
          </div>
        </div>
      )}

      {/* Reason text field */}
      {selected && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <input
            type="text"
            value={reason}
            onChange={handleReason}
            placeholder="Alasan / catatan singkat atas penilaian Anda (opsional)..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-blue-900 focus:border-blue-900"
          />
        </div>
      )}
    </div>
  );
}

// 1. CRITERIA PAIRWISE STEP (10 comparisons, step-by-step)
export function PairwiseCriteriaStep({ onNext, onPrev, answers, setAnswers }) {
  const pairs = generatePairwiseCombinations(CRITERIA);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [errors, setErrors] = useState('');

  const currentPair = pairs[currentIdx];
  const key = `${currentPair.left.code}-${currentPair.right.code}`;
  const currentValue = answers.criteria?.[key] || null;

  const handleChange = (val) => {
    setAnswers(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: val
      }
    }));
    setErrors('');
  };

  const handleNext = () => {
    if (!currentValue?.selected) {
      setErrors('Anda harus memilih salah satu opsi untuk melanjutkan.');
      return;
    }

    if (currentIdx < pairs.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      onPrev();
    }
  };

  const jumpTo = (idx) => {
    if (idx < currentIdx || answers.criteria?.[`${pairs[idx - 1]?.left.code}-${pairs[idx - 1]?.right.code}`]?.selected) {
      setCurrentIdx(idx);
      setErrors('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Perbandingan Berpasangan Antarkriteria</h2>
        <p className="text-slate-500">Bandingkan tingkat kepentingan relatif antara dua kriteria. Terdapat 10 pasangan.</p>
      </div>

      {/* Progress Circles */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {pairs.map((p, idx) => {
          const pairKey = `${p.left.code}-${p.right.code}`;
          const isAnswered = !!answers.criteria?.[pairKey]?.selected;
          const isActive = idx === currentIdx;

          return (
            <button
              key={pairKey}
              onClick={() => jumpTo(idx)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition duration-150 flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-blue-900 text-white ring-2 ring-blue-900/25'
                  : isAnswered
                  ? 'bg-green-150 text-green-900 hover:bg-green-200'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-4 text-xs md:text-sm text-slate-600">
        {currentIdx + 1} dari {pairs.length} perbandingan
      </div>

      {/* Question Card */}
      <PairwiseRow
        leftItem={currentPair.left}
        rightItem={currentPair.right}
        value={currentValue}
        onChange={handleChange}
        index={currentIdx}
        total={pairs.length}
      />

      {errors && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-5 flex gap-2 text-xs md:text-sm text-rose-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {errors}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1"
        >
          {currentIdx === pairs.length - 1 ? 'Simpan & Lanjut' : 'Lanjut'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// 2. ALTERNATIVES PAIRWISE STEP (Grouped: 5 screens of 6 comparisons each = 30 total)
export function PairwiseAlternativesStep({ onNext, onPrev, answers, setAnswers }) {
  const [currentCritIdx, setCurrentCritIdx] = useState(0);
  const [warnings, setWarnings] = useState('');

  const currentCriterion = CRITERIA[currentCritIdx];
  const altPairs = generatePairwiseCombinations(ALTERNATIVES);

  const getAnswersKeyPrefix = (critCode) => `alt-${critCode}`;

  // Evaluate Consistency for current criterion
  const checkConsistency = () => {
    const altCodes = ALTERNATIVES.map(a => a.code);
    const subAnswers = {};
    altPairs.forEach(p => {
      const answerKey = `${getAnswersKeyPrefix(currentCriterion.code)}-${p.left.code}-${p.right.code}`;
      const ans = answers.alternatives?.[answerKey];
      if (ans) {
        subAnswers[`${p.left.code}-${p.right.code}`] = ans;
      }
    });

    const result = evaluateAHPSection(altCodes, subAnswers);
    if (result.cr > 0.10) {
      setWarnings(`Consistency Ratio (CR) = ${result.cr}. Pilihan Anda pada kriteria ${currentCriterion.code} tidak konsisten (CR > 0.10). Kami menyarankan untuk meninjau kembali pilihan Anda agar konsisten.`);
    } else {
      setWarnings('');
    }
  };

  useEffect(() => {
    checkConsistency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.alternatives, currentCritIdx]);

  const handleRowChange = (key, val) => {
    setAnswers(prev => ({
      ...prev,
      alternatives: {
        ...prev.alternatives,
        [key]: val
      }
    }));
  };

  const validateAllAnswered = () => {
    return altPairs.every(p => {
      const key = `${getAnswersKeyPrefix(currentCriterion.code)}-${p.left.code}-${p.right.code}`;
      return !!answers.alternatives?.[key]?.selected;
    });
  };

  const handleNext = () => {
    if (!validateAllAnswered()) {
      alert('Mohon isi semua perbandingan sebelum melanjutkan.');
      return;
    }

    if (currentCritIdx < CRITERIA.length - 1) {
      setCurrentCritIdx(currentCritIdx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (currentCritIdx > 0) {
      setCurrentCritIdx(currentCritIdx - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onPrev();
    }
  };

  const handleJump = (idx) => {
    let canJump = true;
    for (let i = 0; i < idx; i++) {
      const c = CRITERIA[i];
      const answered = altPairs.every(
        p => !!answers.alternatives?.[`${getAnswersKeyPrefix(c.code)}-${p.left.code}-${p.right.code}`]?.selected
      );
      if (!answered) {
        canJump = false;
        break;
      }
    }
    if (canJump || idx < currentCritIdx) {
      setCurrentCritIdx(idx);
    }
  };

  const answeredCount = altPairs.filter(p => !!answers.alternatives?.[`${getAnswersKeyPrefix(currentCriterion.code)}-${p.left.code}-${p.right.code}`]?.selected).length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Perbandingan Berpasangan Antaralternatif</h2>
        <p className="text-slate-500">Nilai kesesuaian dua alternatif terhadap kriteria yang sedang aktif.</p>
      </div>

      {/* Criteria Tabs */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
          Kriteria ({currentCritIdx + 1} dari {CRITERIA.length})
        </label>
        <div className="flex justify-center gap-1.5">
          {CRITERIA.map((c, idx) => {
            const isActive = idx === currentCritIdx;
            const complete = altPairs.every(
              p => !!answers.alternatives?.[`${getAnswersKeyPrefix(c.code)}-${p.left.code}-${p.right.code}`]?.selected
            );

            return (
              <button
                key={c.code}
                type="button"
                onClick={() => handleJump(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white ring-2 ring-blue-900/10'
                    : complete
                    ? 'bg-green-100 text-green-800 hover:bg-green-150'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {c.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Criteria Info */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-6">
        <div className="text-[10px] font-bold text-blue-950 uppercase tracking-wider">
          Kriteria Aktif: {currentCriterion.code} — {currentCriterion.name}
        </div>
        <div className="text-slate-600 text-xs mt-1 leading-relaxed">
          {currentCriterion.description}
        </div>
        <div className="text-[11px] text-slate-400 mt-2 font-semibold">
          {answeredCount} dari {altPairs.length} perbandingan pada {currentCriterion.code}
        </div>
      </div>

      {/* Render 6 comparisons of 4 alternatives */}
      <div className="space-y-4">
        {altPairs.map((pair, index) => {
          const key = `${getAnswersKeyPrefix(currentCriterion.code)}-${pair.left.code}-${pair.right.code}`;
          return (
            <PairwiseRow
              key={key}
              leftItem={pair.left}
              rightItem={pair.right}
              value={answers.alternatives?.[key]}
              onChange={(val) => handleRowChange(key, val)}
              index={index}
              total={altPairs.length}
            />
          );
        })}
      </div>

      {/* Consistency warning */}
      {warnings && (
        <div className="bg-amber-50 border border-amber-250 rounded-xl p-4 mb-6 flex gap-2.5 text-xs md:text-sm text-amber-800">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>{warnings}</div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={handleNext}
          disabled={!validateAllAnswered()}
          className={`px-6 py-3 font-semibold rounded-xl shadow-sm transition duration-150 flex items-center gap-1 ${
            validateAllAnswered()
              ? 'bg-blue-900 hover:bg-blue-950 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {currentCritIdx === CRITERIA.length - 1 ? 'Simpan & Lanjut' : 'Lanjut'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
