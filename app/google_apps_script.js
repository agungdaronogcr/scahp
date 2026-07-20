/**
 * Backend Google Apps Script — Kuesioner AHP e-Audit.
 *
 * Worksheet dibuat otomatis:
 * RESPONSES    profil, metadata, dan hasil akhir
 * CRITERIA     10 perbandingan antarkriteria
 * ALTERNATIVES 30 perbandingan alternatif
 * LOG          jejak saveDraft, submitFinal, dan error
 *
 * Deploy sebagai Web App: Execute as Me, Who has access: Anyone.
 */

function doGet() {
  return jsonResponse({ ok: true, status: 'success', message: 'Backend AHP e-Audit aktif.' });
}

function doPost(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var data;

  try {
    data = JSON.parse(e.postData.contents || '{}');
    validatePayload(data);
    initializeSheets(spreadsheet);

    var action = data.action || 'submitFinal';
    upsertResponse(spreadsheet.getSheetByName('RESPONSES'), data);
    replacePairwiseRows(spreadsheet.getSheetByName('CRITERIA'), data.response_id, data.criteria || [], false);
    replacePairwiseRows(spreadsheet.getSheetByName('ALTERNATIVES'), data.response_id, data.alternatives || [], true);
    appendLog(spreadsheet, data.response_id, action, 'success', 'Data berhasil disimpan.');

    return jsonResponse({
      ok: true,
      status: 'success',
      action: action,
      response_id: data.response_id,
      message: action === 'saveDraft' ? 'Draf berhasil disimpan.' : 'Jawaban akhir berhasil disimpan.'
    });
  } catch (error) {
    try {
      initializeSheets(spreadsheet);
      appendLog(spreadsheet, data && data.response_id ? data.response_id : '', data && data.action ? data.action : '', 'error', String(error));
    } catch (ignored) {
      // Respons error tetap dikembalikan walaupun pencatatan log gagal.
    }
    return jsonResponse({ ok: false, status: 'error', message: String(error) });
  }
}

function validatePayload(data) {
  if (!data.response_id) throw new Error('response_id wajib diisi.');
  if (['saveDraft', 'submitFinal'].indexOf(data.action || 'submitFinal') === -1) {
    throw new Error('action tidak valid.');
  }
  if (!data.profile || typeof data.profile !== 'object') throw new Error('profile tidak valid.');
}

function initializeSheets(spreadsheet) {
  ensureSheet(spreadsheet, 'RESPONSES', [
    'response_id', 'timestamp', 'action', 'nama', 'instansi', 'jabatan',
    'pengalaman', 'bidang', 'pemahaman_ahp', 'tools', 'consent',
    'cr_kriteria', 'cr_k1', 'cr_k2', 'cr_k3', 'cr_k4', 'cr_k5',
    'weight_a1', 'weight_a2', 'weight_a3', 'weight_a4'
  ]);
  ensureSheet(spreadsheet, 'CRITERIA', [
    'response_id', 'pair_code', 'left_code', 'right_code',
    'score', 'chosen_side', 'ahp_value', 'note', 'created_at'
  ]);
  ensureSheet(spreadsheet, 'ALTERNATIVES', [
    'response_id', 'criterion_code', 'pair_code', 'left_alt', 'right_alt',
    'score', 'chosen_side', 'ahp_value', 'note', 'created_at'
  ]);
  ensureSheet(spreadsheet, 'LOG', [
    'response_id', 'timestamp', 'action', 'status', 'message'
  ]);
}

function ensureSheet(spreadsheet, name, headers) {
  var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#dbeafe');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function upsertResponse(sheet, data) {
  var profile = data.profile || {};
  var results = data.results || {};
  var perCriterion = results.perCriterion || {};
  var globalWeights = results.globalAlternatives || {};
  var row = [
    safeCell(data.response_id),
    safeCell(data.timestamp || new Date().toISOString()),
    safeCell(data.action || 'submitFinal'),
    safeCell(profile.nama),
    safeCell(profile.instansi),
    safeCell(profile.jabatan),
    safeCell(profile.pengalaman),
    safeCell((profile.bidang || []).join(', ')),
    safeCell(profile.pemahaman_ahp),
    safeCell((profile.tools || []).join(', ')),
    Boolean(data.consent),
    numberOrBlank(results.criteria && results.criteria.cr),
    numberOrBlank(perCriterion.K1 && perCriterion.K1.cr),
    numberOrBlank(perCriterion.K2 && perCriterion.K2.cr),
    numberOrBlank(perCriterion.K3 && perCriterion.K3.cr),
    numberOrBlank(perCriterion.K4 && perCriterion.K4.cr),
    numberOrBlank(perCriterion.K5 && perCriterion.K5.cr),
    numberOrBlank(globalWeights.A1),
    numberOrBlank(globalWeights.A2),
    numberOrBlank(globalWeights.A3),
    numberOrBlank(globalWeights.A4)
  ];

  var rowNumber = findResponseRow(sheet, data.response_id);
  if (rowNumber) sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  else sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

function findResponseRow(sheet, responseId) {
  if (sheet.getLastRow() < 2) return 0;
  var match = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(String(responseId))
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function replacePairwiseRows(sheet, responseId, rows, includeCriterion) {
  deleteRowsForResponse(sheet, responseId);
  if (!rows.length) return;

  var values = rows.map(function(row) {
    var common = [
      safeCell(responseId)
    ];
    if (includeCriterion) common.push(safeCell(row.parentCode));
    common.push(
      safeCell(row.leftCode + '-' + row.rightCode),
      safeCell(row.leftCode),
      safeCell(row.rightCode),
      Number(row.intensity) || 1,
      safeCell(row.selectedSide || 'equal'),
      Number(row.ahpValue) || 1,
      safeCell(row.reason),
      safeCell(row.createdAt)
    );
    return common;
  });

  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
}

function deleteRowsForResponse(sheet, responseId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var matchingRows = [];
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(responseId)) matchingRows.push(i + 2);
  }
  if (!matchingRows.length) return;

  // Kelompokkan nomor baris yang berurutan, lalu hapus dari bawah agar
  // nomor baris kelompok sebelumnya tidak bergeser. Maksimal dua panggilan
  // deleteRows untuk data normal, bukan 10–30 deleteRow terpisah.
  var groups = [];
  var start = matchingRows[0];
  var previous = matchingRows[0];
  for (var j = 1; j < matchingRows.length; j++) {
    if (matchingRows[j] === previous + 1) {
      previous = matchingRows[j];
    } else {
      groups.push({ start: start, count: previous - start + 1 });
      start = matchingRows[j];
      previous = matchingRows[j];
    }
  }
  groups.push({ start: start, count: previous - start + 1 });

  for (var g = groups.length - 1; g >= 0; g--) {
    sheet.deleteRows(groups[g].start, groups[g].count);
  }
}

function appendLog(spreadsheet, responseId, action, status, message) {
  spreadsheet.getSheetByName('LOG').appendRow([
    safeCell(responseId),
    new Date().toISOString(),
    safeCell(action),
    safeCell(status),
    safeCell(message)
  ]);
}

function safeCell(value) {
  if (value === null || value === undefined) return '';
  var text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function numberOrBlank(value) {
  return typeof value === 'number' && isFinite(value) ? value : '';
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
