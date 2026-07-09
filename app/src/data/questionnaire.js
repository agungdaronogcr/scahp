export const criteria = [
  { code: 'K1', name: 'Data Connectivity and Ingestion', description: 'Kemampuan stack untuk mengakses, mengambil, dan menghubungkan data audit dari berbagai sumber secara efisien dan andal.' },
  { code: 'K2', name: 'Data Preparation and Management', description: 'Kemampuan stack membersihkan, mentransformasi, memanipulasi, dan mengelola data audit agar siap dianalisis.' },
  { code: 'K3', name: 'Audit Analytics and Testing Capability', description: 'Kemampuan stack menjalankan prosedur audit berbasis data untuk pengujian substantif dan kepatuhan.' },
  { code: 'K4', name: 'Advanced Analytics Capability', description: 'Kemampuan stack mendukung analitik lanjutan di luar analisis audit dasar.' },
  { code: 'K5', name: 'Reporting and Audit Communication', description: 'Kemampuan stack menyajikan hasil analisis secara jelas, komunikatif, dan dapat digunakan dalam tindak lanjut pemeriksaan.' },
  { code: 'K6', name: 'Governance, Security, and Operational Feasibility', description: 'Kemampuan stack menjamin kualitas, keamanan, keterlacakan, dan kelayakan operasional.' },
];

export const subcriteria = [
  { code: 'K1.1', parent: 'K1', name: 'Konektivitas ke multi-type files dan database', indicator: 'Excel, CSV, TXT, JSON, XML, PDF terstruktur, dan database melalui ODBC/konektor sejenis.' },
  { code: 'K1.2', parent: 'K1', name: 'Konektivitas ke open data, API, ERP, dan cloud', indicator: 'API, open data, ERP, sistem transaksi, dan penyimpanan cloud.' },
  { code: 'K1.3', parent: 'K1', name: 'Kemudahan dan keandalan proses ingestion', indicator: 'Preview/validasi awal, minim error, dan waktu ingestion efisien.' },
  { code: 'K2.1', parent: 'K2', name: 'Kemampuan data shaping dan transformation', indicator: 'Cleaning, standardizing, filtering, reshaping, merging, enrichment.' },
  { code: 'K2.2', parent: 'K2', name: 'Kemampuan manipulasi data audit', indicator: 'Join, split, deduplikasi, rekonsiliasi, verification.' },
  { code: 'K2.3', parent: 'K2', name: 'Efisiensi repository dan pengelolaan data', indicator: 'Repository ringan, dataset mudah dipanggil ulang, efisien untuk pemrosesan berulang.' },
  { code: 'K3.1', parent: 'K3', name: 'Kemampuan analisis deskriptif dan eksploratif', indicator: 'Profiling, summarizing, pivoting, tabulasi, filtering, eksplorasi pola.' },
  { code: 'K3.2', parent: 'K3', name: 'Kemampuan pengujian audit spesifik', indicator: 'Sampling, trend analysis, verification, Benford Law, dan pengujian numerik lain.' },
  { code: 'K3.3', parent: 'K3', name: 'Kemampuan anomaly/risk detection', indicator: 'Outlier, red flags, duplikasi, transaksi tidak lazim, pola risiko kepatuhan.' },
  { code: 'K4.1', parent: 'K4', name: 'Kemampuan text mining', indicator: 'Keyword search, fuzzy join, fuzzy duplicate, text clustering, semantic analysis.' },
  { code: 'K4.2', parent: 'K4', name: 'Kemampuan machine learning', indicator: 'Outlier detection, clustering, training, prediction, classification.' },
  { code: 'K4.3', parent: 'K4', name: 'Fleksibilitas pengembangan analitik lanjutan', indicator: 'Script/library tambahan, use case baru, deep learning/image mining jika diperlukan.' },
  { code: 'K5.1', parent: 'K5', name: 'Kualitas visualisasi analitik', indicator: 'Grafik, dashboard, heatmap, pivot chart, visual lain.' },
  { code: 'K5.2', parent: 'K5', name: 'Kemudahan reporting audit', indicator: 'Output mudah diekspor, didokumentasikan, dan mendukung pembahasan kasus.' },
  { code: 'K5.3', parent: 'K5', name: 'Keterhubungan insight dengan tindak lanjut audit', indicator: 'Insight mudah diterjemahkan menjadi temuan atau langkah pemeriksaan.' },
  { code: 'K6.1', parent: 'K6', name: 'Data quality, integrity, and audit trail', indicator: 'Kontrol kualitas data, integritas data, jejak proses, reproduksibilitas.' },
  { code: 'K6.2', parent: 'K6', name: 'Access control and data protection', indicator: 'Kontrol akses, perlindungan data sensitif, log aktivitas.' },
  { code: 'K6.3', parent: 'K6', name: 'Low/less-code usability, cost, and supportability', indicator: 'Mudah dipelajari auditor, hardware ringan, biaya rendah, mudah dipelihara.' },
];

export const alternatives = [
  { code: 'A', name: 'Spreadsheet-centric lightweight stack', component: 'Excel 365/Power Query + Pivot Table + DuckDB/Parquet' },
  { code: 'B', name: 'Low-code analytics stack', component: 'Power Query + Orange Data Mining + DuckDB/SQLite/Parquet' },
  { code: 'C', name: 'Script-assisted open analytics stack', component: 'Power Query + Python/R + DuckDB/Parquet' },
  { code: 'D', name: 'Reporting-oriented hybrid stack', component: 'Power Query + Python/Orange Data Mining + Power BI + DuckDB/Parquet' },
];

export const openQuestions = [
  'Apakah enam kriteria utama sudah mencerminkan kebutuhan pemilihan data analytics stack untuk e-Audit pemeriksaan pajak?',
  'Apakah subkriteria yang digunakan sudah cukup operasional dan mudah dipahami?',
  'Apakah alternatif stack yang digunakan sudah realistis untuk konteks pemeriksaan pajak di Indonesia?',
  'Risiko implementasi apa yang perlu diperhatikan dalam penggunaan data analytics stack untuk e-Audit?',
  'Rekomendasi tambahan apa yang perlu dipertimbangkan terkait teknologi, prosedur, atau tata kelola e-Audit berbasis data analytics?',
];

export const saatyScale = [
  { value: 1, label: 'Sama penting/sesuai' },
  { value: 3, label: 'Sedikit lebih penting/sesuai' },
  { value: 5, label: 'Lebih penting/sesuai' },
  { value: 7, label: 'Sangat lebih penting/sesuai' },
  { value: 9, label: 'Mutlak lebih penting/sesuai' },
];

export const expertiseOptions = ['Pemeriksaan Pajak', 'e-Audit', 'Data Analytics', 'Sistem Informasi', 'Pengembangan Aplikasi', 'Lainnya'];
export const experienceOptions = ['<5 tahun', '5-10 tahun', '11-15 tahun', '>15 tahun'];
export const ahpUnderstandingOptions = ['Belum memahami', 'Dasar', 'Cukup', 'Baik', 'Sangat baik'];
export const toolsOptions = ['Excel/Power Query', 'ACL', 'IDEA', 'SQL', 'Python/R', 'Power BI', 'Orange Data Mining', 'Lainnya'];
