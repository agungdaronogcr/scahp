export const CRITERIA = [
  {
    code: 'K1',
    name: 'Pengambilan, Penyiapan, dan Pengelolaan Data',
    shortName: 'Pengelolaan Data',
    shortDescription: 'Akuisisi, transformasi, validasi, repository.',
    description: 'Kemampuan memperoleh data dari berbagai sumber, kemudian membersihkan, mengubah, menggabungkan, memvalidasi, menyimpan, dan mengelolanya agar siap dianalisis.'
  },
  {
    code: 'K2',
    name: 'Analisis Data dan Pengujian Audit',
    shortName: 'Analisis Audit',
    shortDescription: 'Pengujian populasi dan deteksi anomali.',
    description: 'Kemampuan menjalankan analisis data dan prosedur pengujian audit, seperti profiling, rekonsiliasi, pengujian populasi, sampling, serta deteksi duplikasi, anomali, dan pola risiko.'
  },
  {
    code: 'K3',
    name: 'Data Mining dan Analitik Lanjutan',
    shortName: 'Data Mining',
    shortDescription: 'ML, text mining, dan analitik lanjutan.',
    description: 'Kemampuan melakukan analisis lanjutan, termasuk analisis teks, data mining, machine learning, pemodelan, dan pengembangan teknik analitik sesuai kebutuhan pemeriksaan.'
  },
  {
    code: 'K4',
    name: 'Visualisasi dan Pelaporan',
    shortName: 'Visualisasi & Pelaporan',
    shortDescription: 'Tabel, grafik, dashboard, dan laporan.',
    description: 'Kemampuan menyajikan hasil analisis dalam bentuk tabel, grafik, visualisasi, dashboard, dan laporan yang jelas serta mendukung dokumentasi dan tindak lanjut pemeriksaan.'
  },
  {
    code: 'K5',
    name: 'Kelayakan Operasional',
    shortName: 'Kelayakan Operasional',
    shortDescription: 'Biaya, usability, dukungan, dan kontrol.',
    description: 'Kemampuan stack untuk digunakan secara aman, mudah, andal, terjangkau, dan berkelanjutan dengan mempertimbangkan tata kelola, perlindungan data, audit trail, kompetensi pengguna, kebutuhan perangkat, biaya, serta dukungan teknis.'
  }
];

export const ALTERNATIVES = [
  {
    code: 'A1',
    name: 'Excel-Centric Embedded Analytics Stack',
    components: 'Power Query + DuckDB + Formula/DAX + SQL + Python in Excel + PivotTable/Chart',
    description: 'Stack berbasis Excel dengan mesin analitik tertanam (Power Query, DuckDB, Python in Excel) untuk transformasi, kueri, dan analisis data skala besar tanpa keluar dari lingkungan Excel.'
  },
  {
    code: 'A2',
    name: 'Power BI-Centric Integrated Analytics Stack',
    components: 'Power Query + DuckDB + semantic model/DAX + SQL + Python in Power BI + Canvas/Analyze in Excel',
    description: 'Stack terintegrasi berbasis Power BI dengan semantic model dan DAX, didukung Python untuk analitik lanjutan serta keterhubungan dua arah dengan Excel.'
  },
  {
    code: 'A3',
    name: 'Excel–Orange Visual Low-Code Analytics Stack',
    components: 'Excel + Power Query + DuckDB + DAX/SQL + Orange Data Mining + PivotTable/Chart',
    description: 'Menggabungkan Excel/Power Query untuk persiapan data dengan Orange Data Mining, aplikasi visual berbasis workflow (low-code) untuk analitik lanjutan dan machine learning ringan.'
  },
  {
    code: 'A4',
    name: 'Purpose-Built Commercial Audit Analytics Stack',
    components: 'ACL Analytics, Caseware IDEA, Arbutus, atau perangkat sejenis dengan fitur minimum sebanding.',
    description: 'Dinilai sebagai kelas perangkat audit analytics komersial dengan fitur minimum yang sebanding: import data, audit testing, automation/scripting, dan reporting.'
  }
];

// Skala perbandingan AHP diskret. Hanya nilai 1, 3, 5, 7, dan 9 yang digunakan;
// nilai antara (2, 4, 6, 8) sengaja tidak disediakan pada kuesioner ini.
export const SAATY_SCALE = [
  { value: 1, label: 'Sama penting / sama sesuai', description: 'Kedua elemen memberikan kontribusi yang sama terhadap tujuan.' },
  { value: 3, label: 'Sedikit lebih penting / sesuai', description: 'Pengalaman dan penilaian sedikit memihak satu elemen dibanding yang lain.' },
  { value: 5, label: 'Lebih penting / sesuai', description: 'Pengalaman dan penilaian sangat memihak satu elemen dibanding yang lain.' },
  { value: 7, label: 'Sangat lebih penting / sesuai', description: 'Satu elemen sangat disukai dan dominasinya terbukti dalam praktik.' },
  { value: 9, label: 'Mutlak lebih penting / sesuai', description: 'Bukti yang memihak satu elemen atas yang lain memiliki tingkat penegasan tertinggi.' }
];
