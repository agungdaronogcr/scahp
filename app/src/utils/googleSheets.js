import { buildPayload } from './export';

async function fetchWithTimeout(url, options, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function submitToGoogleSheets(webAppUrl, state, ahpResults) {
  if (!webAppUrl) {
    throw new Error('URL Google Apps Script belum diisi.');
  }

  const bodyText = JSON.stringify(buildPayload(state, ahpResults));

  // Google Apps Script Web App tidak mengirim header CORS yang dapat dibaca
  // browser. Menggunakan mode cors terlebih dahulu membuat request menunggu
  // timeout lalu dikirim ulang. Kirim sekali dengan no-cors agar cepat dan
  // mencegah submission ganda; hasil server tetap dicatat di worksheet LOG.
  await fetchWithTimeout(webAppUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: bodyText,
  }, 30000);

  return {
    ok: true,
    opaque: true,
    message: 'Data telah dikirim ke Google Apps Script.'
  };
}
