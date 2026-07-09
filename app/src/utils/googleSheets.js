import { buildPayload } from './export';

export async function submitToGoogleSheets(webAppUrl, state, ahpResults) {
  if (!webAppUrl) {
    throw new Error('URL Google Apps Script belum diisi.');
  }

  const bodyText = JSON.stringify(buildPayload(state, ahpResults));

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: bodyText,
    });

    const text = await response.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { ok: response.ok, message: text };
    }

    if (!response.ok || body.ok === false) {
      throw new Error(body.error || body.message || 'Gagal menyimpan ke Google Sheet.');
    }

    return body;
  } catch (error) {
    if (!String(error.message || '').toLowerCase().includes('failed to fetch')) {
      throw error;
    }

    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: bodyText,
    });

    return { ok: true, opaque: true, message: 'Data dikirim. Browser tidak mengizinkan pembacaan respons Google Apps Script.' };
  }
}
