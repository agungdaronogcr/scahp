import { alternatives, criteria, subcriteria } from '../data/questionnaire';
import { flattenPairwiseAnswers } from './ahp';

function download(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildPayload(state, ahpResults = {}) {
  const profile = state.profile || {};

  return {
    respondent_id: state.submissionCode || state.submissionId || `DRAFT-${Date.now()}`,
    title: 'Pemilihan Data Analytics Stack untuk e-Audit dalam Pemeriksaan Pajak',
    timestamp: state.submittedAt || new Date().toISOString(),
    profile: {
      ...profile,
      name: profile.name || profile.nama || '',
      unit: profile.unit || profile.instansi || '',
      role: profile.role || profile.jabatan || '',
      expertise: profile.expertise || profile.keahlian || [],
      experience: profile.experience || profile.pengalaman || '',
      electronicAudit: profile.electronicAudit || profile.pernah_e_audit || '',
      usedAnalytics: profile.usedAnalytics || profile.pernah_tools || '',
      usedTools: profile.usedTools || profile.tools_digunakan || [],
      ahpUnderstanding: profile.ahpUnderstanding || profile.pemahaman_ahp || '',
    },
    consent: state.consent,
    validations: state.validations || state.validationAnswers || {},
    pairwise: flattenPairwiseAnswers(state.pairwise),
    open_answers: state.openAnswers || {},
    ahp_results: ahpResults,
    metadata: {
      criteria_count: criteria.length,
      subcriteria_count: subcriteria.length,
      alternatives_count: alternatives.length,
    },
  };
}

export function exportToJSON(state, ahpResults) {
  const code = state.submissionCode || 'draft';
  download(`jawaban-ahp-${code}.json`, JSON.stringify(buildPayload(state, ahpResults), null, 2), 'application/json');
}

export function exportToCSV(state) {
  const rows = flattenPairwiseAnswers(state.pairwise).map((answer) => ({
    respondent_id: state.submissionCode || 'draft',
    section: answer.section || '',
    parent: answer.parentCode || '',
    left_item: answer.leftCode || '',
    right_item: answer.rightCode || '',
    selected_item: answer.selectedSide === 'same' ? 'same' : answer.selectedCode || '',
    intensity: answer.intensity || '',
    ahp_value: answer.ahpValue || '',
    reason: answer.reason || '',
    created_at: answer.createdAt || '',
  }));

  const headers = ['respondent_id', 'section', 'parent', 'left_item', 'right_item', 'selected_item', 'intensity', 'ahp_value', 'reason', 'created_at'];
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => `"${String(row[header]).replaceAll('"', '""')}"`).join(',')),
  ].join('\n');

  download(`pairwise-ahp-${state.submissionCode || 'draft'}.csv`, csv, 'text/csv;charset=utf-8');
}
