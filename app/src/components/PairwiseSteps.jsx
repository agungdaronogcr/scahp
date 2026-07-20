import { useMemo, useState } from 'react';
import { AlertCircle, BookOpen, ChevronRight, Save } from 'lucide-react';
import { CRITERIA, ALTERNATIVES } from '../data/constants';
import { generatePairwiseCombinations, evaluateAHPSection } from '../utils/ahp';

const SCALE_OPTIONS = [
  { side: 'left', intensity: 9, label: '9' },
  { side: 'left', intensity: 7, label: '7' },
  { side: 'left', intensity: 5, label: '5' },
  { side: 'left', intensity: 3, label: '3' },
  { side: 'equal', intensity: 1, label: '1' },
  { side: 'right', intensity: 3, label: '3' },
  { side: 'right', intensity: 5, label: '5' },
  { side: 'right', intensity: 7, label: '7' },
  { side: 'right', intensity: 9, label: '9' },
];

function DefinitionButton({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 hover:text-blue-950"
        aria-expanded={open}
      >
        <BookOpen className="h-3 w-3" />
        {open ? 'Tutup definisi' : 'Lihat definisi'}
      </button>
      {open && (
        <p className="mt-1 max-w-sm rounded-lg bg-blue-50 p-2 text-[11px] font-normal leading-relaxed text-slate-600">
          {item.description}
          {item.components && <span className="mt-1 block font-semibold text-blue-900">{item.components}</span>}
        </p>
      )}
    </div>
  );
}

function PairwiseTable({ pairs, getKey, values, onChange, leftHeading, rightHeading }) {
  return (
    <>
      <div className="space-y-4 md:hidden">
        {pairs.map((pair, index) => {
          const key = getKey(pair);
          const answer = values?.[key];
          return (
            <section
              key={key}
              className={`rounded-2xl border p-4 shadow-sm ${answer?.selected ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}
            >
              <div className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Perbandingan {index + 1} dari {pairs.length}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <div className="text-[10px] font-bold uppercase text-blue-700">{leftHeading}</div>
                  <div className="mt-1 text-xs font-bold leading-snug text-slate-800">
                    <span className="mr-1 text-blue-900">{pair.left.code}</span>
                    {pair.left.name}
                  </div>
                  <DefinitionButton item={pair.left} />
                </div>
                <div className="rounded-xl bg-slate-100 p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-500">{rightHeading}</div>
                  <div className="mt-1 text-xs font-bold leading-snug text-slate-800">
                    <span className="mr-1 text-blue-900">{pair.right.code}</span>
                    {pair.right.name}
                  </div>
                  <DefinitionButton item={pair.right} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-9 gap-1">
                {SCALE_OPTIONS.map(option => {
                  const checked = answer?.selected === option.side && Number(answer?.intensity) === option.intensity;
                  return (
                    <label
                      key={`${option.side}-${option.intensity}`}
                      className={`flex min-w-0 cursor-pointer flex-col items-center gap-1 rounded-lg px-0.5 py-2 text-[10px] font-bold ${
                        checked ? 'bg-blue-900 text-white ring-2 ring-blue-300' :
                        option.side === 'equal' ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span>{option.label}</span>
                      <input
                        type="radio"
                        name={`mobile-${key}`}
                        checked={checked}
                        onChange={() => onChange(key, {
                          selected: option.side,
                          intensity: option.intensity,
                          reason: answer?.reason || '',
                          createdAt: answer?.createdAt || new Date().toISOString(),
                        })}
                        className="h-4 w-4 cursor-pointer accent-blue-900"
                        aria-label={`${pair.left.code} dibanding ${pair.right.code}: ${option.side} ${option.intensity}`}
                      />
                    </label>
                  );
                })}
              </div>
              <div className="mt-2 grid grid-cols-3 text-[9px] font-semibold text-slate-400">
                <span>Kiri dominan</span>
                <span className="text-center">Sama</span>
                <span className="text-right">Kanan dominan</span>
              </div>
            </section>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[980px] border-collapse text-sm">
        <thead className="bg-blue-100 text-blue-950">
          <tr>
            <th className="w-12 px-3 py-4 text-center">No</th>
            <th className="w-[250px] px-4 py-4 text-left">{leftHeading}</th>
            {SCALE_OPTIONS.map((option, index) => (
              <th
                key={`${option.side}-${option.intensity}`}
                className={`w-12 px-1 py-4 text-center ${index === 4 ? 'border-x border-blue-300 bg-blue-200' : ''}`}
              >
                {option.label}
              </th>
            ))}
            <th className="w-[250px] px-4 py-4 text-left">{rightHeading}</th>
          </tr>
          <tr className="border-t border-blue-200 text-[10px] uppercase tracking-wider text-blue-700">
            <th />
            <th className="px-4 pb-3 text-left">Elemen kiri lebih dominan</th>
            <th colSpan="4" className="pb-3 text-center">Kiri</th>
            <th className="border-x border-blue-300 bg-blue-200 pb-3 text-center">Sama</th>
            <th colSpan="4" className="pb-3 text-center">Kanan</th>
            <th className="px-4 pb-3 text-left">Elemen kanan lebih dominan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pairs.map((pair, index) => {
            const key = getKey(pair);
            const answer = values?.[key];
            return (
              <tr key={key} className={answer?.selected ? 'bg-emerald-50/30' : 'hover:bg-slate-50'}>
                <td className="px-3 py-5 text-center font-bold text-slate-400">{index + 1}</td>
                <td className="px-4 py-5 align-middle">
                  <div className="font-bold leading-snug text-slate-800">
                    <span className="mr-1 text-blue-900">{pair.left.code}</span>
                    {pair.left.name}
                  </div>
                  <DefinitionButton item={pair.left} />
                </td>
                {SCALE_OPTIONS.map((option, optionIndex) => {
                  const checked = answer?.selected === option.side && Number(answer?.intensity) === option.intensity;
                  return (
                    <td
                      key={`${option.side}-${option.intensity}`}
                      className={`px-1 py-5 text-center ${optionIndex === 4 ? 'border-x border-blue-100 bg-blue-50/70' : ''}`}
                    >
                      <label className="flex cursor-pointer justify-center p-2" title={`${option.label} — ${option.side}`}>
                        <input
                          type="radio"
                          name={key}
                          checked={checked}
                          onChange={() => onChange(key, {
                            selected: option.side,
                            intensity: option.intensity,
                            reason: answer?.reason || '',
                            createdAt: answer?.createdAt || new Date().toISOString(),
                          })}
                          className="h-5 w-5 cursor-pointer accent-blue-900"
                          aria-label={`${pair.left.code} dibanding ${pair.right.code}: ${option.side} ${option.intensity}`}
                        />
                      </label>
                    </td>
                  );
                })}
                <td className="px-4 py-5 align-middle">
                  <div className="font-bold leading-snug text-slate-800">
                    <span className="mr-1 text-blue-900">{pair.right.code}</span>
                    {pair.right.name}
                  </div>
                  <DefinitionButton item={pair.right} />
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </>
  );
}

function Progress({ answered, total }) {
  const percentage = Math.round((answered / total) * 100);
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex justify-between text-xs font-bold text-slate-600">
        <span>{answered} dari {total} pasangan terisi</span>
        <span className="text-blue-900">{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-900 transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function Navigation({ onPrev, onNext, complete, lastLabel, onSaveDraft, isSavingDraft }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <button onClick={onPrev} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
        Kembali
      </button>
      <div className="flex gap-2">
        {onSaveDraft && (
          <button
            onClick={onSaveDraft}
            disabled={isSavingDraft}
            className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-900 hover:bg-blue-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSavingDraft ? 'Menyimpan…' : 'Simpan Draf'}
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!complete}
          className="flex items-center gap-1 rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-950 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {lastLabel}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function PairwiseCriteriaStep({ onNext, onPrev, answers, setAnswers, onSaveDraft, isSavingDraft }) {
  const pairs = useMemo(() => generatePairwiseCombinations(CRITERIA), []);
  const answered = pairs.filter(pair => answers.criteria?.[`${pair.left.code}-${pair.right.code}`]?.selected).length;

  const handleChange = (key, value) => {
    setAnswers(previous => ({
      ...previous,
      criteria: { ...previous.criteria, [key]: value },
    }));
  };

  return (
    <div className="mx-auto max-w-6xl px-2 py-8">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Perbandingan Berpasangan Antarkriteria</h2>
        <p className="text-slate-500">Pilih tepat satu nilai pada setiap baris. Angka di kiri memihak kriteria kiri; angka di kanan memihak kriteria kanan.</p>
      </div>
      <Progress answered={answered} total={pairs.length} />
      <PairwiseTable
        pairs={pairs}
        getKey={pair => `${pair.left.code}-${pair.right.code}`}
        values={answers.criteria}
        onChange={handleChange}
        leftHeading="Kriteria kiri"
        rightHeading="Kriteria kanan"
      />
      {answered < pairs.length && (
        <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          Lengkapi seluruh {pairs.length} baris untuk melanjutkan.
        </div>
      )}
      <Navigation
        onPrev={onPrev}
        onNext={onNext}
        complete={answered === pairs.length}
        lastLabel="Simpan & Lanjut"
        onSaveDraft={onSaveDraft}
        isSavingDraft={isSavingDraft}
      />
    </div>
  );
}

export function PairwiseAlternativesStep({ onNext, onPrev, answers, setAnswers, onSaveDraft, isSavingDraft }) {
  const [currentCritIdx, setCurrentCritIdx] = useState(0);
  const currentCriterion = CRITERIA[currentCritIdx];
  const pairs = useMemo(() => generatePairwiseCombinations(ALTERNATIVES), []);
  const keyFor = pair => `alt-${currentCriterion.code}-${pair.left.code}-${pair.right.code}`;
  const answered = pairs.filter(pair => answers.alternatives?.[keyFor(pair)]?.selected).length;

  const subAnswers = {};
  pairs.forEach(pair => {
    const answer = answers.alternatives?.[keyFor(pair)];
    if (answer) subAnswers[`${pair.left.code}-${pair.right.code}`] = answer;
  });
  const consistency = evaluateAHPSection(ALTERNATIVES.map(item => item.code), subAnswers);

  const criterionComplete = criterion => pairs.every(pair =>
    answers.alternatives?.[`alt-${criterion.code}-${pair.left.code}-${pair.right.code}`]?.selected
  );

  const handleChange = (key, value) => {
    setAnswers(previous => ({
      ...previous,
      alternatives: { ...previous.alternatives, [key]: value },
    }));
  };

  const handleNext = () => {
    if (currentCritIdx < CRITERIA.length - 1) {
      setCurrentCritIdx(value => value + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (currentCritIdx > 0) setCurrentCritIdx(value => value - 1);
    else onPrev();
  };

  return (
    <div className="mx-auto max-w-6xl px-2 py-8">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Perbandingan Berpasangan Antaralternatif</h2>
        <p className="text-slate-500">Nilai kesesuaian setiap pasangan stack terhadap kriteria aktif.</p>
      </div>
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {CRITERIA.map((criterion, index) => (
          <button
            key={criterion.code}
            onClick={() => setCurrentCritIdx(index)}
            className={`rounded-lg px-4 py-2 text-xs font-bold ${
              index === currentCritIdx ? 'bg-blue-900 text-white' :
              criterionComplete(criterion) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {criterion.code}
          </button>
        ))}
      </div>
      <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Kriteria aktif</p>
        <h3 className="mt-1 text-lg font-bold text-blue-950">{currentCriterion.code} — {currentCriterion.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{currentCriterion.description}</p>
      </div>
      <Progress answered={answered} total={pairs.length} />
      <PairwiseTable
        pairs={pairs}
        getKey={keyFor}
        values={answers.alternatives}
        onChange={handleChange}
        leftHeading="Alternatif kiri"
        rightHeading="Alternatif kanan"
      />
      {answered === pairs.length && consistency.cr > 0.10 && (
        <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          CR {consistency.cr.toFixed(2)} melebihi 0,10. Anda tetap dapat melanjutkan, tetapi sebaiknya tinjau pola penilaian pada tab ini.
        </div>
      )}
      <Navigation
        onPrev={handlePrev}
        onNext={handleNext}
        complete={answered === pairs.length}
        lastLabel={currentCritIdx === CRITERIA.length - 1 ? 'Simpan & Lanjut' : `Lanjut ke ${CRITERIA[currentCritIdx + 1]?.code}`}
        onSaveDraft={onSaveDraft}
        isSavingDraft={isSavingDraft}
      />
    </div>
  );
}
