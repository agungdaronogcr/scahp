import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ArrowLeft, Send, Loader, CheckCircle2, Download, FileText, Globe, Clipboard } from 'lucide-react';
import { CRITERIA, ALTERNATIVES } from '../data/constants';
import { countValidPairwiseAnswers, evaluateAHPSection, generatePairwiseCombinations } from '../utils/ahp';

export function computeAHPResults(answers) {
  const critCodes = CRITERIA.map(c => c.code);
  const criteriaEval = evaluateAHPSection(critCodes, answers.criteria || {});

  const altCodes = ALTERNATIVES.map(a => a.code);
  const altPairs = generatePairwiseCombinations(ALTERNATIVES);

  const perCriterionEval = {};
  CRITERIA.forEach((c) => {
    const subAnswers = {};
    altPairs.forEach(p => {
      const key = `alt-${c.code}-${p.left.code}-${p.right.code}`;
      subAnswers[`${p.left.code}-${p.right.code}`] = answers.alternatives?.[key];
    });
    perCriterionEval[c.code] = evaluateAHPSection(altCodes, subAnswers);
  });

  const globalAlternatives = {};
  ALTERNATIVES.forEach(a => { globalAlternatives[a.code] = 0; });

  CRITERIA.forEach((c) => {
    const wCrit = criteriaEval.weightsMap[c.code] || 0;
    ALTERNATIVES.forEach((a) => {
      const wLocal = perCriterionEval[c.code]?.weightsMap[a.code] || 0;
      globalAlternatives[a.code] += wCrit * wLocal;
    });
  });

  return { criteria: criteriaEval, perCriterion: perCriterionEval, globalAlternatives };
}

export default function FinalStep({
  onPrev,
  profile,
  answers,
  onSubmit,
  isSubmitting,
  submitError,
  jumpToStep,
  profileStepIndex,
  criteriaStepIndex,
  alternativesStepIndex,
  submitResult
}) {
  const [finalConfirm, setFinalConfirm] = useState(false);

  const profileComplete = !!(profile.nama?.trim() && profile.instansi?.trim() && profile.jabatan?.trim() &&
    profile.keahlian?.length > 0 && profile.pengalaman && profile.pemahaman_ahp);

  const validCounts = countValidPairwiseAnswers(answers);
  const critCount = validCounts.criteria;
  const altCount = validCounts.alternatives;

  const isComplete = profileComplete && critCount === 10 && altCount === 30;
  const results = isComplete ? computeAHPResults(answers) : null;

  const handleSubmit = () => {
    if (!isComplete || !finalConfirm) return;
    onSubmit(results);
  };

  // ---- Confirmation view after successful submit ----
  if (submitResult) {
    return <SubmittedConfirmation profile={profile} answers={answers} submitResult={submitResult} />;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Penyelesaian</h2>
        <p className="text-slate-500">Periksa ringkasan sebelum mengirim jawaban akhir.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="space-y-3 mb-2">
          <SummaryRow
            label="Profil responden"
            value={profileComplete ? 'Lengkap' : 'Belum lengkap'}
            ok={profileComplete}
            onJump={() => jumpToStep(profileStepIndex)}
          />
          <SummaryRow
            label="Perbandingan antarkriteria"
            value={`${critCount} dari 10`}
            ok={critCount === 10}
            onJump={() => jumpToStep(criteriaStepIndex)}
          />
          <SummaryRow
            label="Perbandingan antaralternatif"
            value={`${altCount} dari 30`}
            ok={altCount === 30}
            onJump={() => jumpToStep(alternativesStepIndex)}
          />
          <SummaryRow label="Pemeriksaan konsistensi" value="Selesai" ok={true} />
          <SummaryRow label="Total pairwise comparison" value={`${critCount + altCount} dari 40`} ok={critCount + altCount === 40} />
        </div>

        {isComplete ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4 flex gap-3 text-xs md:text-sm text-green-800">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong>Kuesioner telah selesai.</strong> Seluruh bagian telah diisi dan pemeriksaan konsistensi telah dilakukan. Silakan kirim jawaban setelah memastikan ringkasan di atas sesuai.
            </div>
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-250 rounded-xl p-4 mt-4 flex gap-3 text-xs md:text-sm text-rose-800">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>Ada bagian yang belum lengkap. Klik baris di atas untuk kembali melengkapinya.</div>
          </div>
        )}
      </div>

      {/* Final consent checkbox */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={finalConfirm}
            onChange={(e) => setFinalConfirm(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-blue-900 focus:ring-blue-900 mt-0.5"
          />
          <span className="text-xs md:text-sm text-slate-700 font-medium leading-snug">
            Saya menyatakan bahwa seluruh penilaian diberikan berdasarkan pengalaman dan pertimbangan profesional.
          </span>
        </label>
        <p className="text-[11px] text-slate-400 mt-2 pl-8">
          Data akhir akan dikirim ke Google Sheet. Setelah server mengonfirmasi penyimpanan, sistem menampilkan response ID dan waktu pengiriman.
        </p>
      </div>

      {/* Submission Errors */}
      {submitError && (
        <div className="bg-rose-50 border border-rose-250 rounded-xl p-4 mb-6 flex gap-2.5 text-xs md:text-sm text-rose-800">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong>Gagal mengirim data:</strong> {submitError}
            <br />
            Silakan coba kirim ulang. Jika terus gagal, pastikan Anda terhubung ke internet.
          </div>
        </div>
      )}

      {/* Navigation & Submit Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isComplete || !finalConfirm || isSubmitting}
          className={`px-7 py-3.5 font-bold rounded-xl shadow-md transition duration-150 flex items-center gap-2 text-white ${
            isComplete && finalConfirm && !isSubmitting
              ? 'bg-blue-900 hover:bg-blue-950 cursor-pointer'
              : 'bg-slate-350 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Mengirim Data...
            </>
          ) : (
            <>
              Kirim Jawaban
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, ok, onJump }) {
  const content = (
    <div className={`flex items-center justify-between p-3 rounded-xl border text-xs md:text-sm ${
      ok ? 'border-green-150 bg-green-50/40' : 'border-rose-150 bg-rose-50/30'
    }`}>
      <span className="font-semibold text-slate-700">{label}</span>
      <span className={`font-bold flex items-center gap-1 ${ok ? 'text-green-700' : 'text-rose-700'}`}>
        {ok && <CheckCircle2 className="w-4 h-4" />}
        {value}
      </span>
    </div>
  );

  if (!onJump) return content;

  return (
    <button type="button" onClick={onJump} className="w-full text-left cursor-pointer">
      {content}
    </button>
  );
}

function SubmittedConfirmation({ profile, answers, submitResult }) {
  const getTimestampString = () => {
    const d = new Date();
    return `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}_${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const triggerDownload = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const fullData = {
      meta: {
        title: 'Kuesioner AHP e-Audit Pajak',
        responseId: submitResult.responseId,
        submittedAt: submitResult.submittedAt
      },
      profile,
      pairwise: answers
    };
    triggerDownload(
      JSON.stringify(fullData, null, 2),
      `AHP_eAudit_Backup_${profile.nama?.replace(/\s+/g, '_') || 'Responden'}_${getTimestampString()}.json`,
      'application/json;charset=utf-8;'
    );
  };

  const handleExportCSV = () => {
    const csvRows = [];
    const headers = ['Response_ID', 'Nama', 'Instansi', 'Section', 'Criterion', 'Left', 'Right', 'Selected', 'Intensity', 'AHP_Value', 'Reason'];
    csvRows.push(headers.map(h => `"${h}"`).join(','));

    const addRow = (section, parent, left, right, answer) => {
      if (!answer) return;
      let ahpValue = 1;
      const intensity = Number(answer.intensity) || 1;
      if (answer.selected === 'left') ahpValue = intensity;
      else if (answer.selected === 'right') ahpValue = 1 / intensity;

      const row = [
        submitResult.responseId, profile.nama || '', profile.instansi || '',
        section, parent || '', left, right, answer.selected || 'equal',
        intensity, ahpValue.toFixed(4), answer.reason || ''
      ];
      csvRows.push(row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    };

    const critPairs = generatePairwiseCombinations(CRITERIA);
    critPairs.forEach(p => {
      const key = `${p.left.code}-${p.right.code}`;
      addRow('Kriteria', 'Tujuan', p.left.code, p.right.code, answers.criteria?.[key]);
    });

    const altPairs = generatePairwiseCombinations(ALTERNATIVES);
    CRITERIA.forEach(c => {
      altPairs.forEach(p => {
        const key = `alt-${c.code}-${p.left.code}-${p.right.code}`;
        addRow('Alternatif', c.code, p.left.code, p.right.code, answers.alternatives?.[key]);
      });
    });

    const csvContent = '﻿' + csvRows.join('\n');
    triggerDownload(
      csvContent,
      `AHP_eAudit_Pairwise_${profile.nama?.replace(/\s+/g, '_') || 'Responden'}_${getTimestampString()}.csv`,
      'text/csv;charset=utf-8;'
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(submitResult.responseId);
    alert('Response ID berhasil disalin ke clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-center">
      <div className="inline-flex items-center justify-center p-4 bg-emerald-50 text-emerald-600 rounded-full mb-6 border border-emerald-100 shadow-md">
        <CheckCircle className="w-12 h-12" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
        Pengiriman Berhasil!
      </h1>
      <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto mb-8">
        Terima kasih atas waktu dan kontribusi berharga yang Bapak/Ibu berikan. Data kuesioner Anda telah tersimpan di Google Sheet penelitian kami.
      </p>

      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 mb-8 max-w-md mx-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          Response ID
        </div>
        <div className="flex items-center justify-center gap-2">
          <code className="text-lg md:text-xl font-extrabold text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
            {submitResult.responseId}
          </code>
          <button
            onClick={copyToClipboard}
            title="Salin Response ID"
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-pointer hover:text-blue-900 transition-colors"
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Waktu pengiriman: {new Date(submitResult.submittedAt).toLocaleString('id-ID')}
        </p>
      </div>

      <div className="bg-white border border-slate-150 rounded-2xl p-6 mb-8 max-w-md mx-auto shadow-sm">
        <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center justify-center gap-1.5">
          <Download className="w-4 h-4 text-blue-900" />
          Download Salinan Data Anda
        </h4>
        <div className="flex justify-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Download CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            Download JSON
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-400">
        <p>Hubungi tim peneliti jika Anda memiliki pertanyaan atau kendala lanjutan.</p>
        <p className="mt-1 font-semibold text-slate-500">Penelitian AHP e-Audit &copy; 2026</p>
      </div>
    </div>
  );
}
