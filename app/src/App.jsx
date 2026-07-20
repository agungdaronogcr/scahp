import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

// Import components
import LandingStep from './components/LandingStep';
import StackExplanationStep from './components/StackExplanationStep';
import ConsentStep from './components/ConsentStep';
import ProfileStep from './components/ProfileStep';
import AhpStructureStep from './components/AhpStructureStep';
import ScaleGuideStep from './components/ScaleGuideStep';
import { PairwiseCriteriaStep, PairwiseAlternativesStep } from './components/PairwiseSteps';
import ConsistencyCheckStep from './components/ConsistencyCheckStep';
import FinalStep from './components/FinalStep';

import { submitToGoogleSheets } from './utils/googleSheets';

// STORAGE KEY
const LOCAL_STORAGE_KEY = 'ahp_eaudit_survey_state';

// PLACEHOLDER GOOGLE SHEETS WEB APP URL
// Ganti nilai di bawah ini dengan URL hasil deployment Google Apps Script Anda
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxQVULE_JarT4S4rRwcXryU9qcXwKrSFcMpyS03E5NIJkROnHsIre9QIwuEJpmtgjVuMQ/exec";

// 10-step wizard sesuai mockup terbaru
const STEPS = [
  { id: 'landing', label: 'Pengantar' },
  { id: 'stack_explanation', label: 'Penjelasan Stack' },
  { id: 'consent', label: 'Persetujuan' },
  { id: 'profile', label: 'Profil Responden' },
  { id: 'ahp_structure', label: 'Struktur AHP' },
  { id: 'scale_guide', label: 'Panduan Skala' },
  { id: 'pw_criteria', label: 'Perbandingan Kriteria' },
  { id: 'pw_alternatives', label: 'Perbandingan Alternatif' },
  { id: 'consistency_check', label: 'Cek Konsistensi' },
  { id: 'final', label: 'Selesai' }
];

const STEP_INDEX = STEPS.reduce((acc, s, idx) => ({ ...acc, [s.id]: idx }), {});

export default function App() {
  // 1. STATE INITIALIZATION
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [profile, setProfile] = useState({});
  const [consentChecked, setConsentChecked] = useState(false);
  const [answers, setAnswers] = useState({
    criteria: {},
    alternatives: {}
  });
  const [submissionId, setSubmissionId] = useState('');
  const [hasSavedData, setHasSavedData] = useState(false);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitResult, setSubmitResult] = useState(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Generate unique submission/response ID
  const generateSubmissionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'AHP-EAUDIT-';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 2. AUTOSAVE EFFECT & LOAD
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setHasSavedData(true);
    }
    setSubmissionId(generateSubmissionId());
  }, []);

  // Save state on change
  useEffect(() => {
    if (step > 0 && !submitResult) {
      const stateToSave = {
        step,
        furthestStep,
        profile,
        consentChecked,
        answers,
        submissionId
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [step, furthestStep, profile, consentChecked, answers, submissionId, submitResult]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        setStep(state.step || 0);
        setFurthestStep(Math.max(state.step || 0, state.furthestStep || 0));
        setProfile(state.profile || {});
        setConsentChecked(state.consentChecked || false);
        setAnswers(state.answers || { criteria: {}, alternatives: {} });
        setSubmissionId(state.submissionId || generateSubmissionId());
        setHasSavedData(false);
      }
    } catch (e) {
      console.error("Gagal memuat sesi simpanan: ", e);
      alert("Gagal memuat sesi pengisian sebelumnya.");
    }
  };

  const clearSavedState = () => {
    if (confirm("Apakah Anda yakin ingin menghapus data pengisian sebelumnya dan memulai dari awal?")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setProfile({});
      setConsentChecked(false);
      setAnswers({ criteria: {}, alternatives: {} });
      setSubmissionId(generateSubmissionId());
      setHasSavedData(false);
      setStep(1);
      setFurthestStep(1);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    const next = Math.min(step + 1, STEPS.length - 1);
    setStep(next);
    setFurthestStep(current => Math.max(current, next));
  };
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));
  const jumpToStep = (targetStep) => {
    // Semua langkah yang pernah dicapai tetap dapat dibuka saat meninjau jawaban.
    if (targetStep <= furthestStep) {
      setStep(targetStep);
    }
  };

  // 3. SUBMISSION TO GOOGLE SHEETS
  const handleSubmit = async (ahpResults) => {
    setIsSubmitting(true);
    setSubmitError('');

    const submittedAt = new Date().toISOString();
    const submissionState = {
      submissionId,
      submissionCode: submissionId,
      submittedAt,
      profile,
      consent: consentChecked,
      pairwise: answers,
    };

    // Jika URL masih menggunakan placeholder, ingatkan user tapi simulasikan sukses
    if (GOOGLE_SHEET_WEBAPP_URL.includes("MASUKKAN_URL_GOOGLE_APPS_SCRIPT")) {
      setTimeout(() => {
        setIsSubmitting(false);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setSubmitResult({ responseId: submissionId, submittedAt });
        alert("MODE SIMULASI: Data berhasil diproses lokal! (Anda melihat ini karena URL Google Apps Script belum dikonfigurasi. Anda dapat mengunduh data CSV/JSON di halaman ini.)");
      }, 1500);
      return;
    }

    try {
      await submitToGoogleSheets(GOOGLE_SHEET_WEBAPP_URL, submissionState, ahpResults || {});
      setIsSubmitting(false);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSubmitResult({ responseId: submissionId, submittedAt });
    } catch (err) {
      console.error("Submit Error: ", err);
      setIsSubmitting(false);
      setSubmitError(err.message || 'Koneksi jaringan terputus atau server Apps Script mengembalikan error.');
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setSubmitError('');
    try {
      await submitToGoogleSheets(GOOGLE_SHEET_WEBAPP_URL, {
        submissionId,
        submissionCode: submissionId,
        submittedAt: new Date().toISOString(),
        profile,
        consent: consentChecked,
        pairwise: answers,
        action: 'saveDraft',
      }, {});
      alert('Draf berhasil disimpan ke Google Sheet.');
    } catch (err) {
      setSubmitError(err.message || 'Draf gagal disimpan.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // 4. PROGRESS & COMPLETENESS TRACKERS FOR SIDEBAR
  const checkStepStatus = (stepId) => {
    switch (stepId) {
      case 'landing': return true;
      case 'stack_explanation': return furthestStep > STEP_INDEX.stack_explanation;
      case 'consent': return consentChecked;
      case 'profile':
        return !!(profile.nama && profile.instansi && profile.jabatan && profile.keahlian?.length > 0 && profile.pengalaman && profile.pemahaman_ahp);
      case 'ahp_structure': return furthestStep > STEP_INDEX.ahp_structure;
      case 'scale_guide': return furthestStep > STEP_INDEX.scale_guide;
      case 'pw_criteria':
        return Object.keys(answers.criteria || {}).filter(k => answers.criteria[k]?.selected).length === 10;
      case 'pw_alternatives':
        return Object.keys(answers.alternatives || {}).filter(k => answers.alternatives[k]?.selected).length === 30;
      case 'consistency_check': return furthestStep > STEP_INDEX.consistency_check;
      case 'final': return false;
      default: return false;
    }
  };

  // Render correct content for current step
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <LandingStep
            onNext={handleNext}
            hasSavedData={hasSavedData}
            onLoadSaved={loadSavedState}
            onClearSaved={clearSavedState}
          />
        );
      case 1:
        return <StackExplanationStep onNext={handleNext} onPrev={handlePrev} />;
      case 2:
        return (
          <ConsentStep
            onNext={handleNext}
            onPrev={handlePrev}
            consentChecked={consentChecked}
            setConsentChecked={setConsentChecked}
          />
        );
      case 3:
        return (
          <ProfileStep
            onNext={handleNext}
            onPrev={handlePrev}
            profile={profile}
            setProfile={setProfile}
          />
        );
      case 4:
        return <AhpStructureStep onNext={handleNext} onPrev={handlePrev} />;
      case 5:
        return <ScaleGuideStep onNext={handleNext} onPrev={handlePrev} />;
      case 6:
        return (
          <PairwiseCriteriaStep
            onNext={handleNext}
            onPrev={handlePrev}
            answers={answers}
            setAnswers={setAnswers}
            onSaveDraft={handleSaveDraft}
            isSavingDraft={isSavingDraft}
          />
        );
      case 7:
        return (
          <PairwiseAlternativesStep
            onNext={handleNext}
            onPrev={handlePrev}
            answers={answers}
            setAnswers={setAnswers}
            onSaveDraft={handleSaveDraft}
            isSavingDraft={isSavingDraft}
          />
        );
      case 8:
        return (
          <ConsistencyCheckStep
            onNext={handleNext}
            onPrev={handlePrev}
            answers={answers}
            jumpToStep={jumpToStep}
            pwCriteriaStepIndex={STEP_INDEX.pw_criteria}
            pwAlternativesStepIndex={STEP_INDEX.pw_alternatives}
          />
        );
      case 9:
        return (
          <FinalStep
            onPrev={handlePrev}
            profile={profile}
            answers={answers}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
            submitResult={submitResult}
            jumpToStep={jumpToStep}
            profileStepIndex={STEP_INDEX.profile}
            criteriaStepIndex={STEP_INDEX.pw_criteria}
            alternativesStepIndex={STEP_INDEX.pw_alternatives}
          />
        );
      default:
        return <div>Langkah tidak valid.</div>;
    }
  };

  // Calculate global progress percentage
  const calculateProgress = () => {
    if (step === 0) return 0;
    return Math.round((step / (STEPS.length - 1)) * 100);
  };

  const showChrome = step > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER BAR */}
      <header className="bg-blue-950 text-white border-b border-blue-900 shadow-sm py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-200" />
            <span className="font-extrabold text-sm md:text-base tracking-wide uppercase">
              e-Audit Stack AHP Survey
            </span>
          </div>
          {showChrome && (
            <div className="flex items-center gap-2 text-[10px] md:text-xs bg-blue-900/60 px-3 py-1 rounded-full text-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Autosave Aktif
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* SIDEBAR ON DESKTOP */}
        {showChrome && (
          <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-5 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto shrink-0 hidden md:block">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Langkah Kuesioner
            </h3>
            <nav className="space-y-1.5">
              {STEPS.map((s, idx) => {
                if (idx === 0) return null; // Skip landing
                const isActive = step === idx;
                const isComplete = checkStepStatus(s.id);

                return (
                  <button
                    key={s.id}
                    onClick={() => jumpToStep(idx)}
                    disabled={idx > furthestStep}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-sm font-bold'
                        : isComplete
                        ? 'text-slate-800 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-50'
                    } ${idx > furthestStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="truncate">{idx}. {s.label}</span>
                    {isComplete && (
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-green-600'}`} />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8 flex flex-col">
          {/* Progress bar at the top of content */}
          {showChrome && (
            <div className="mb-6 max-w-3xl mx-auto w-full">
              <div className="flex justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                <span>Progress Pengisian</span>
                <span className="text-blue-900">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          )}

          {/* Render active step */}
          <div className="flex-1">
            {renderStepContent()}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-250 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <p>Penelitian Penentuan Data Analytics Stack untuk e-Audit Pajak &copy; 2026</p>
          <div className="flex items-center gap-3">
            <span>Metode AHP</span>
            <span>&bull;</span>
            <span>Google Sheets Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
