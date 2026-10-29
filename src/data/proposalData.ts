export interface ProposalSection {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  content: string[];
  keyPoints?: string[];
  tables?: {
    headers: string[];
    rows: string[][];
  };
}

export const GDS_PROPOSAL_DATA: {
  title: string;
  subtitle: string;
  classification: string;
  edition: string;
  preparedFor: string;
  executiveSummary: string[];
  sections: ProposalSection[];
} = {
  title: "PROPOSAL RANCANG BANGUN PLATFORM KETAHANAN NASIONAL TERINTEGRASI",
  subtitle: "GARUDA DOME SYSTEM (GDS) v3: MULTI-DOMAIN ARCHIPELAGIC DEFENSE, MARITIME SOVEREIGNTY & NATURAL RESOURCES EARLY WARNING",
  classification: "DOKUMEN STRATEGIS RESMI - DUAL-USE CIVIL-MILITARY FRAMEWORK",
  edition: "Versi 3.0 (Super Canggih - Multi-Intelligence & Archipelagic Edge)",
  preparedFor: "Komando Cadangan & Operasi Terpadu TNI, Kementerian LHK, KKP, Bakamla RI, BSSN, BNPB, dan BNN RI",
  executiveSummary: [
    "Indonesia sebagai negara kepulauan terbesar di dunia dengan garis pantai terpanjang kedua di muka bumi menghadapi tantangan kedaulatan yang bersifat asimetris dan multi-domain. Keterbatasan jumlah alutsista laut dan udara jika dikerahkan secara 'patroli buta' (blind patrol) menimbulkan inefisiensi anggaran bahan bakar yang luar biasa besar dan celah pengawasan yang dimanfaatkan pelaku kejahatan.",
    "Data empiris menunjukkan Indonesia menanggung kerugian ekonomi mencapai lebih dari Rp 45 Triliun per tahun akibat pencurian ikan (IUU Fishing), Rp 30+ Triliun dari pembalakan liar (Illegal Logging) dan perusakan kawasan konservasi, serta ratusan triliun kerugian sistemik akibat kebakaran hutan dan lahan (karhutla) dan peredaran narkoba.",
    "Garuda Dome System (GDS) v3 hadir bukan sebagai sekadar sistem radar militer statis, melainkan sebuah 'Autonomous Neural Defense & Sovereignty Grid' yang mengintegrasikan Multi-Intelligence Fusion (GEOINT, SIGINT, OSINT, AIS, Akustik, dan Seismik) melalui otak kecerdasan buatan 'Garuda Brain' dan komputasi tepi pulau terluar (Archipelagic Edge Computing). GDS mentransformasikan paradigma dari reaktif menjadi prediktif dan preskriptif, merekomendasikan pengerahan aset penegakan hukum dalam hitungan menit secara presisi."
  ],
  sections: [
    {
      id: "bab-1",
      number: "BAB I",
      title: "URGENSI GEOPOLITIK & ANATOMI ANCAMAN ASIMETRIS KEPULAUAN",
      subtitle: "Tinjauan Kerentanan 17.500 Pulau, ALKI, dan Kekayaan Alam Hayati",
      content: [
        "1.1. Paradigma Geopolitik Nusantara: Posisi silang Indonesia di antara dua benua dan dua samudera menjadikan perairan Indonesia sebagai jalur urat nadi perdagangan dunia (ALKI I, II, dan III). Namun posisi strategis ini sekaligus mengundang ancaman kedaulatan multi-dimensi.",
        "1.2. Kesenjangan Sensor Teritorial: Mengandalkan kapal perang (KRI) atau pesawat intai semata tanpa jejaring sensor cerdas terintegrasi adalah formula yang sangat mahal. Biaya operasional 1 jam pelayaran kapal patroli kelas fregat mencapai puluhan juta rupiah. Selama bertahun-tahun, operasi patroli kerap berjalan parsial per instansi (siloed operations).",
        "1.3. Eskalasi Ancaman 'Dark Vessel' & Modus Canggih: Kapal pencuri ikan asing kini secara sistematis mematikan Automatic Identification System (AIS) saat memasuki Zona Ekonomi Eksklusif (ZEE) Indonesia, memanfaatkan celah cuaca dan awan tebal untuk menghindari satelit optik biasa.",
        "1.4. Pembalakan Liar Modern Berkedok Hutan Tanaman: Pembalak liar tidak lagi bekerja manual, melainkan menggunakan alat berat hidrolik, membuka jalan koridor logging di pedalaman kalimantan dan papua dalam hitungan malam, lalu mengalirkan kayu melalui jalur sungai gelap yang luput dari pantauan pos darat konvensional."
      ],
      keyPoints: [
        "Kerugian IUU Fishing: Rp 35 - 45 Triliun per tahun.",
        "Kerugian Devisa & Ekologis Illegal Logging: Rp 30 Triliun per tahun.",
        "Jalur ALKI I, II, III memerlukan Maritime Domain Awareness 24/7 tanpa celah blind spot.",
        "Kebutuhan mutlak integrasi sensor sipil-militer (Dual-Use Sensor Mesh)."
      ]
    },
    {
      id: "bab-2",
      number: "BAB II",
      title: "ARSITEKTUR INTI GARUDA DOME SYSTEM v3",
      subtitle: "Garuda Brain, Multi-Intelligence Fusion Engine, dan Archipelagic Edge Mesh",
      content: [
        "2.1. Konsep Multi-Layer Sensor Mesh: GDS v3 menghimpun aliran data heterogen dari:",
        "- Satelit SAR (Synthetic Aperture Radar) seperti Sentinel-1 dan Cosmo-SkyMed yang mampu menembus tutupan awan malam hari untuk mendeteksi lambung baja kapal dan deforestasi.",
        "- Satelit Konstelasi Optik Resolusi Tinggi (PlanetScope, SPOT, Landsat-9).",
        "- Jaringan Radar Udara dan Maritim (Satrad Kosek TNI AU, Radar Pantai IMSS Bakamla, dan VTS Perhubungan Laut).",
        "- Transponder AIS darat dan satelit terenkripsi.",
        "- Sensor Akustik Biofonik Tanah di kawasan hutan lindung untuk mendeteksi suara chainsaw dan alat berat.",
        "- Sensor Seismometer InaTEWS BMKG dan Buoy Tsunami Laut Lepas.",
        "2.2. Archipelagic Edge Computing Nodes: Karakteristik pulau terluar Indonesia rawan mengalami pemutusan jalur komunikasi serat optik akibat gempa atau sabotase bawah laut. GDS v3 menempatkan node komputasi tepi mandiri di pulau-pulau strategis (Ranai Natuna, Sabang, Miangas, Rote, Merauke, serta kapal perang garis depan). Setiap node menjalankan model AI lokal yang tetap dapat mendeteksi, mengklasifikasi, dan memicu respon taktis lokal meski koneksi ke Jakarta terputus.",
        "2.3. Garuda Brain: Mesin AI Neural Pusat yang bertugas melakukan data fusion, filtering noise, verifikasi silang (cross-verification), dan pembuatan model korelasi kausal lintas domain."
      ],
      tables: {
        headers: ["Komponen Arsitektur", "Teknologi Utama", "Fungsi Taktis", "Ketahanan Redundansi"],
        rows: [
          ["Sensor Mesh Layer", "SAR Radar, Optik, AIS, Akustik, IMSS", "Akuisisi multi-domain near real-time", "Multi-band satelit & terrestrial"],
          ["Edge Nodes", "Compact Ruggedized TPU / GPU Cluster", "Inferensi AI lokal di pulau terluar", "Baterai surya + Satelit LEO mesh"],
          ["Garuda Brain Core", "Graph Neural Network & LLM Taktis", "Korelasi lintas modul & analisis risiko", "Pusat komando terdistribusi 3 zona"],
          ["SOP Prescriptive Engine", "Human-in-the-Loop Decision Matrix", "Rekomendasi aset & draf surat perintah", "Verifikasi berjenjang multi-otoritas"]
        ]
      }
    },
    {
      id: "bab-3",
      number: "BAB III",
      title: "SPESIFIKASI MODUL OPERASIONAL UNGGULAN",
      subtitle: "Fokus Mendalam: Illegal Logging, IUU Fishing, dan Lingkungan Sumber Daya Alam",
      content: [
        "3.1. Modul 9: Monitoring Illegal Logging (Pembalakan Liar):",
        "Menggunakan algoritma SAR Interferometric Coherence Loss untuk mendeteksi perubahan kerapatan tajuk hutan dalam rentang 10x10 meter. AI secara cerdas membedakan bukaan alami (pohon tumbang) dengan bukaan linier berpola (jalan logging buatan manusia). Begitu anomali terkonfirmasi, sistem memicu pengiriman drone otomatis PUNA MALE atau satelit mikro optik untuk mengambil citra resolusi 50cm, mendeteksi nomor lambung truk logging dan titik tumpukan kayu gelondongan.",
        "3.2. Modul 10: Maritime Domain Awareness – IUU Fishing & Dark Vessel:",
        "Menghilangkan konsep kapal 'siluman'. Bila kapal mematikan transponder AIS, pantulan radar SAR satelit dan radar pesisir tetap mendeteksi kontak metalik. AI membandingkan kontak fisik dengan basis data AIS: setiap kontak fisik yang tidak memiliki transmisi AIS langsung ditandai sebagai 'DARK VESSEL ANOMALY'. Algoritma pelacak trajektori mengenali manuver zig-zag khas pukat harimau (pair trawling) dan anomali dua kapal berdempetan di tengah laut (transshipment bahan bakar dan ikan beku).",
        "3.3. Modul 11: Pemantauan Sumber Daya & Pertambangan Ilegal (PETI):",
        "Mendeteksi perubahan spektrum air sungai akibat pembuangan tailing merkuri/sianida dari penambangan emas liar, serta penggalian bijih nikel dan bauksit di luar izin pinjam pakai kawasan hutan (IPPKH).",
        "3.4. Korelasi Lintas Modul (Cross-Domain Impact):",
        "Contoh Kasus Riil: Deteksi jalan koridor logging (Modul 9) -> Memicu peringatan dini penurunan muka air gambut -> Memprediksi lonjakan titik api karhutla (Modul 4) dalam kurun 72 jam -> Memandu BNPB dan Manggala Agni melakukan pembasahan kanal sebelum api menyala."
      ]
    },
    {
      id: "bab-4",
      number: "BAB IV",
      title: "TATA KELOLA KEPUTUSAN & HUMAN-IN-THE-LOOP (HITL)",
      subtitle: "Kombinasi Otoritas Komando Militer, Penegakan Hukum Sipil, dan Hukum Nasional",
      content: [
        "4.1. Prinsip Mutlak: AI Sebagai Penasihat Preskriptif, Manusia Pemegang Pemicu Keputusan. GDS v3 menganut kaidah 'Zero Autonomous Lethal Action' dan 'Strict Authorization Hierarchy'. Sistem tidak pernah mengambil tindakan penindakan atau pengerahan kekuatan tanpa tanda tangan digital / persetujuan perwira jaga (Command Duty Officer).",
        "4.2. Output Preskriptif Satu-Klik (1-Click Action Dispatch): Ketika insiden diverifikasi, sistem tidak hanya memberi alarm 'warna merah', tetapi menyusun Dokumen Rekomendasi Taktis lengkap:",
        "- Nama KRI / Kapal Pengawas terdekat beserta kalkulasi bahan bakar dan ETA menit tiba.",
        "- Rute intersepsi paling hemat energi dan meminimalisir risiko target melarikan diri ke perairan internasional.",
        "- Rujukan pasal hukum yang dilanggar (UU Perikanan, UU P3H Kehutanan, UU Minerba, UU Pelayaran).",
        "- Draf telegram perintah operasi gabungan lintas matra dan kementerian."
      ]
    },
    {
      id: "bab-5",
      number: "BAB V",
      title: "ANALISIS RETURN ON INVESTMENT (ROI) & PENGHEMATAN NEGARA",
      subtitle: "Justifikasi Finansial Pembangunan Sistem Berkelanjutan",
      content: [
        "5.1. Efisiensi Biaya Patroli Bahan Bakar: Berdasarkan simulasi operasional, transisi dari 'patroli terjadwal statis' menjadi 'patroli berbasis intelijen terarah' (intelligence-led interdiction) menghemat 42% konsumsi BBM solar kapal perang dan kapal patroli KKP/Bakamla.",
        "5.2. Penyelamatan Devisa Sumber Daya Alam: Pencegahan 10 armada kapal pencuri ikan asing per bulan menyelamatkan potensi devisa perikanan senilai Rp 1,8 Triliun per tahun. Penyelamatan kayu bernilai tinggi dari kawasan hutan lindung mencegah kerugian restorasi ekologis senilai puluhan triliun rupiah.",
        "5.3. Nilai Strategis Kedaulatan Politik: Memperkuat posisi tawar diplomasi Indonesia di perairan Natuna dan perbatasan ZEE dengan bukti data satelit dan radar yang sah di mata pengadilan internasional (UNCLOS / ITLOS)."
      ],
      tables: {
        headers: ["Komponen Manfaat", "Estimasi Sebelum GDS", "Setelah Implementasi GDS v3", "Dampak Efisiensi Tahunan"],
        rows: [
          ["Response Time IUU Fishing", "4 s/d 12 Jam (Laporan Terlambat)", "15 s/d 35 Menit (Near Real-Time)", "Peningkatan tangkapan kapal 340%"],
          ["Deteksi Deforestasi Hutan", "14 s/d 30 Hari (Citra Optik Bebas Awan)", "< 24 Jam (SAR Radar All-Weather)", "Pencegahan 80.000 Ha pembalakan"],
          ["Konsumsi BBM Armada Laut", "Patroli buta tanpa target pasti", "Patroli presisi terarah sasaran", "Penghematan Rp 620 Miliar BBM/thn"],
          ["Pencegahan Penyelundupan Narkoba", "Pemeriksaan acak muara sungai", "Intersepsi radar FLIR jalur tikus", "Pencegahan masuknya > 2,5 Ton sabu"]
        ]
      }
    },
    {
      id: "bab-6",
      number: "BAB VI",
      title: "ROADMAP PENGEMBANGAN 5 TAHUN (RENSTRA)",
      subtitle: "Fase Quick-Win Hingga Kemandirian Total Industri Pertahanan Siber Nasional",
      content: [
        "Tahun 1 (Fase Quick-Win): Deployment Garuda Brain v3 pada Cloud Berdaulat (Sovereign Cloud) + Integrasi data satelit publik/komersial (Sentinel, VIIRS, AIS) + Uji Coba Lapangan 2 Edge Node (Ranai Natuna & Sabang).",
        "Tahun 2 (Fase Konsolidasi Matra): Integrasi feed data radar militer TNI AU (Satrad) dan TNI AL ke dalam secure data pipeline + Deployment 8 Edge Node pulau terluar + Modul Otomasi Disposisi Gakkum KLHK & KKP.",
        "Tahun 3 (Fase Sensor Swasembada): Peluncuran konstelasi CubeSat SAR Nasional dan drone intai PUNA MALE buatan dalam negeri (PT Dirgantara Indonesia / PT Len) sebagai pemasok data eksklusif GDS.",
        "Tahun 4 (Fase AI Otonom & Interoperabilitas Penuh): Penguatan korelasi siber-fisik, integrasi drone maritim USV (Unmanned Surface Vessel) tanpa awak untuk patroli mandiri.",
        "Tahun 5 (Fase Kedaulatan Penuh): Sistem menjadi standar komando operasi terpadu Mabes TNI dan pusat koordinasi krisis kepresidenan (Situation Room Istana Kepresidenan)."
      ]
    }
  ]
};
