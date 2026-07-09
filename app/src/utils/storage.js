const STORAGE_KEY = 'scahp-ahp-questionnaire-v1';

export const initialState = {
  consent: false,
  profile: {},
  validations: {
    criteria: {},
    subcriteria: {},
    alternatives: {},
  },
  pairwise: {},
  openAnswers: {},
  settings: {
    googleSheetsUrl: import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL || '',
  },
  submittedAt: '',
  submissionCode: '',
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
