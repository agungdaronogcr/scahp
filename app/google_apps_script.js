/**
 * GOOGLE APPS SCRIPT FOR AHP E-AUDIT QUESTIONNAIRE BACKEND (VERSI OPTIMAL / BATCH WRITE)
 *
 * Struktur kuesioner: 5 kriteria (K1-K5), 4 alternatif (A1-A4).
 * 10 perbandingan antarkriteria + 30 perbandingan antaralternatif (6 x 5 kriteria) = 40 total.
 *
 * PETUNJUK INSTALASI:
 * 1. Buka Google Sheets Anda, klik Ekstensi > Apps Script.
 * 2. Hapus semua kode lama, lalu paste kode baru di bawah ini.
 * 3. Simpan.
 * 4. Klik Terapkan (Deploy) > Kelola Penerapan (Manage deployments) > Edit (pensil) > Pilih versi baru (New Version) > klik Terapkan.
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

    // Inisialisasi/dapatkan sheet rekap & raw
    var sheetRekap = getOrCreateSheet(spreadSheet, "Responden_Rekap");
    var sheetRaw = getOrCreateSheet(spreadSheet, "Pairwise_Raw");

    // Tulis header jika sheet baru dibuat
    initializeSheetHeaders(sheetRekap, "rekap");
    initializeSheetHeaders(sheetRaw, "raw");

    var timestamp = new Date().toISOString();

    // 1. TULIS DATA REKAP (1 Baris)
    writeRekapRow(sheetRekap, data, timestamp);

    // 2. TULIS DATA PAIRWISE RAW (Batch Write - Sangat Cepat!)
    writeRawRowsOptimized(sheetRaw, data, timestamp);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data kuesioner berhasil disimpan.",
      submissionId: data.submissionId
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET untuk tes koneksi
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Koneksi backend kuesioner AHP e-Audit aktif."
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(spreadSheet, name) {
  var sheet = spreadSheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadSheet.insertSheet(name);
  }
  return sheet;
}

function initializeSheetHeaders(sheet, type) {
  if (sheet.getLastRow() > 0) return; // Sudah ada header

  var headers = [];
  if (type === "raw") {
    headers = [
      "Timestamp", "Submission_ID", "Nama_Responden", "Instansi",
      "Kategori_Pairwise", "Kriteria_Terkait", "Item_Kiri", "Item_Kanan",
      "Pilihan_Responden", "Intensitas", "Nilai_AHP", "Alasan"
    ];
  } else if (type === "rekap") {
    headers = [
      "Timestamp", "Submission_ID", "Nama_Responden", "Instansi", "Jabatan",
      "Bidang_Keahlian", "Lama_Pengalaman", "Tools_Digunakan", "Pemahaman_AHP"
    ];

    // Tambah header CR per matriks (kriteria + 5 matriks alternatif)
    headers.push("CR_Kriteria_Utama");
    for (var i = 1; i <= 5; i++) {
      headers.push("CR_K" + i);
    }

    // Tambah header bobot prioritas global alternatif (A1-A4)
    var altCodes = ["A1", "A2", "A3", "A4"];
    altCodes.forEach(function(code) {
      headers.push("Weight_" + code);
    });
  }

  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
}

function writeRekapRow(sheet, data, timestamp) {
  var p = data.profile || {};
  var results = data.results || {};

  var row = [
    timestamp,
    data.submissionId,
    p.nama || "",
    p.instansi || "",
    p.jabatan || "",
    (p.keahlian || []).join(", "),
    p.pengalaman || "",
    (p.tools_digunakan || []).join(", "),
    p.pemahaman_ahp || ""
  ];

  // CR Kriteria Utama
  row.push(results.criteria && results.criteria.cr !== undefined ? results.criteria.cr : "");

  // CR per kriteria (matriks alternatif K1-K5)
  for (var i = 1; i <= 5; i++) {
    var code = "K" + i;
    var perCrit = results.perCriterion && results.perCriterion[code];
    row.push(perCrit && perCrit.cr !== undefined ? perCrit.cr : "");
  }

  // Bobot prioritas global alternatif
  var altCodes = ["A1", "A2", "A3", "A4"];
  altCodes.forEach(function(code) {
    row.push(results.globalAlternatives ? results.globalAlternatives[code] : "");
  });

  sheet.appendRow(row);
}

function writeRawRowsOptimized(sheet, data, timestamp) {
  var p = data.profile || {};
  var pw = data.pairwise || {};

  var name = p.nama || "";
  var instansi = p.instansi || "";
  var subId = data.submissionId;

  var rowsToAppend = [];

  var addRow = function(category, parent, left, right, ans) {
    if (!ans) return;

    var ahpValue = 1;
    var intensity = Number(ans.intensity) || 1;
    if (ans.selected === "left") {
      ahpValue = intensity;
    } else if (ans.selected === "right") {
      ahpValue = 1 / intensity;
    }

    rowsToAppend.push([
      timestamp,
      subId,
      name,
      instansi,
      category,
      parent,
      left,
      right,
      ans.selected || "equal",
      intensity,
      ahpValue,
      ans.reason || ""
    ]);
  };

  // 1. Kriteria Utama (10 perbandingan)
  if (pw.criteria) {
    Object.keys(pw.criteria).forEach(function(key) {
      var parts = key.split("-");
      addRow("Kriteria Utama", "Tujuan", parts[0], parts[1], pw.criteria[key]);
    });
  }

  // 2. Alternatif (30 perbandingan: 6 pasangan x 5 kriteria)
  if (pw.alternatives) {
    Object.keys(pw.alternatives).forEach(function(key) {
      var parts = key.split("-");
      if (parts.length >= 4) {
        var critCode = parts[1];
        var leftAlt = parts[2];
        var rightAlt = parts[3];
        addRow("Alternatif", critCode, leftAlt, rightAlt, pw.alternatives[key]);
      }
    });
  }

  // Batch write ke sheet (Sangat cepat, hanya 1 kali panggil API Google Sheets)
  if (rowsToAppend.length > 0) {
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow + 1, 1, rowsToAppend.length, rowsToAppend[0].length);
    range.setValues(rowsToAppend);
  }
}
