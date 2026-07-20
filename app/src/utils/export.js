import { CRITERIA, ALTERNATIVES } from '../data/constants';
import { flattenPairwiseAnswers } from './ahp';

export function buildPayload(state, ahpResults = {}) {
  const profile = state.profile || {};
  const pairwiseRows = flattenPairwiseAnswers(state.pairwise);

  return {
    action: state.action || 'submitFinal',
    response_id: state.submissionCode || state.submissionId || `DRAFT-${Date.now()}`,
    title: 'Pemilihan Data Analytics Stack untuk e-Audit dalam Pemeriksaan Pajak',
    timestamp: state.submittedAt || new Date().toISOString(),
    profile: {
      nama: profile.nama || '',
      instansi: profile.instansi || '',
      jabatan: profile.jabatan || '',
      bidang: profile.keahlian || [],
      pengalaman: profile.pengalaman || '',
      pemahaman_ahp: profile.pemahaman_ahp || '',
      tools: profile.tools_digunakan || [],
    },
    consent: state.consent,
    criteria: pairwiseRows.filter(row => row.section === 'criteria'),
    alternatives: pairwiseRows.filter(row => row.section === 'alternatives'),
    results: ahpResults,
    metadata: {
      criteria_count: CRITERIA.length,
      alternatives_count: ALTERNATIVES.length,
      criteria_pairs: CRITERIA.length * (CRITERIA.length - 1) / 2,
      alternative_pairs: CRITERIA.length * ALTERNATIVES.length * (ALTERNATIVES.length - 1) / 2,
    },
  };
}
