const SHEET_NAMES = {
  submissions: 'Submissions',
  pairwise: 'Pairwise',
  validations: 'Validations',
  openAnswers: 'OpenAnswers',
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    const submissions = getSheet_(spreadsheet, SHEET_NAMES.submissions, [
      'timestamp',
      'respondent_id',
      'name',
      'unit',
      'role',
      'expertise',
      'experience',
      'electronic_audit',
      'tools',
      'ahp_understanding',
      'criteria_cr',
      'raw_json',
    ]);
    const pairwise = getSheet_(spreadsheet, SHEET_NAMES.pairwise, [
      'timestamp',
      'respondent_id',
      'section',
      'parent',
      'left_item',
      'right_item',
      'selected_item',
      'intensity',
      'ahp_value',
      'reason',
    ]);
    const validations = getSheet_(spreadsheet, SHEET_NAMES.validations, [
      'timestamp',
      'respondent_id',
      'section',
      'item_code',
      'score',
      'note',
    ]);
    const openAnswers = getSheet_(spreadsheet, SHEET_NAMES.openAnswers, [
      'timestamp',
      'respondent_id',
      'question_index',
      'answer',
    ]);

    const profile = payload.profile || {};
    submissions.appendRow([
      payload.timestamp,
      payload.respondent_id,
      profile.name || '',
      profile.unit || '',
      profile.role || '',
      Array.isArray(profile.expertise) ? profile.expertise.join(', ') : profile.expertise || '',
      profile.experience || '',
      profile.electronicAudit || '',
      Array.isArray(profile.usedTools) ? profile.usedTools.join(', ') : '',
      profile.ahpUnderstanding || '',
      payload.ahp_results && payload.ahp_results.criteria ? payload.ahp_results.criteria.cr : '',
      JSON.stringify(payload),
    ]);

    (payload.pairwise || []).forEach((answer) => {
      pairwise.appendRow([
        payload.timestamp,
        payload.respondent_id,
        answer.section || '',
        answer.parentCode || '',
        answer.leftCode || '',
        answer.rightCode || '',
        answer.selectedCode || '',
        answer.intensity || '',
        answer.ahpValue || '',
        answer.reason || '',
      ]);
    });

    Object.keys(payload.validations || {}).forEach((section) => {
      const items = payload.validations[section] || {};
      Object.keys(items).forEach((code) => {
        validations.appendRow([
          payload.timestamp,
          payload.respondent_id,
          section,
          code,
          items[code].score || items[code].rating || '',
          items[code].note || items[code].notes || '',
        ]);
      });
    });

    Object.keys(payload.open_answers || {}).forEach((questionIndex) => {
      openAnswers.appendRow([
        payload.timestamp,
        payload.respondent_id,
        questionIndex,
        payload.open_answers[questionIndex] || '',
      ]);
    });

    return json_({ ok: true, status: 'success', respondent_id: payload.respondent_id });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doGet() {
  return json_({ ok: true, message: 'AHP questionnaire endpoint is ready.' });
}

function getSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  return sheet;
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
