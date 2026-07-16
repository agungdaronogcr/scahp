import { CRITERIA, ALTERNATIVES } from '../data/constants';
import { flattenPairwiseAnswers } from './ahp';

export function buildPayload(state, ahpResults = {}) {
  const profile = state.profile || {};

  return {
    respondent_id: state.submissionCode || state.submissionId || `DRAFT-${Date.now()}`,
    title: 'Pemilihan Data Analytics Stack untuk e-Audit dalam Pemeriksaan Pajak',
    timestamp: state.submittedAt || new Date().toISOString(),
    profile: {
      name: profile.nama || '',
      unit: profile.instansi || '',
      role: profile.jabatan || '',
      expertise: profile.keahlian || [],
      experience: profile.pengalaman || '',
      ahpUnderstanding: profile.pemahaman_ahp || '',
      toolsUsed: profile.tools_digunakan || [],
    },
    consent: state.consent,
    pairwise: flattenPairwiseAnswers(state.pairwise),
    results: ahpResults,
    metadata: {
      criteria_count: CRITERIA.length,
      alternatives_count: ALTERNATIVES.length,
      criteria_pairs: 10,
      alternative_pairs: 30,
    },
  };
}
