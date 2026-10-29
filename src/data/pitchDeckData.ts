export interface PitchSlide {
  slideNumber: number;
  title: string;
  category: string;
  tagline: string;
  bulletPoints: string[];
  keyMetric?: { label: string; value: string };
  speakerNotes: string;
  visualCue: string;
}

export const GDS_PITCH_DECK: PitchSlide[] = [
  {
    slideNumber: 1,
    title: "GARUDA DOME SYSTEM (GDS) v3",
    category: "COVER & INTRO",
    tagline: "Platform Ketahanan Nasional Multi-Domain Berbasis AI Archipelagic Edge & Sensor Fusion",
    bulletPoints: [
      "Kedaulatan Maritim, Ruang Udara, Kekayaan Hayati Hutan & Pertahanan Siber",
      "Solusi Canggih Menjawab Karakteristik Spesifik Negara Kepulauan Indonesia",
      "Konsep Dual-Use: Menyatukan Pertahanan Militer & Perlindungan Sumber Daya Sipil",
      "Inisiatif Hackathon Teknologi Pertahanan Nasional 2026"
    ],
    keyMetric: { label: "Cakupan Kepulauan", value: "17.508 Pulau" },
    speakerNotes: "Selamat pagi Dewan Juri dan Pimpinan Komando. Hari ini kami memperkenalkan Garuda Dome System versi 3: platform lompatan strategis yang mengubah cara Indonesia menjaga langit, laut, dan hutan buminya.",
    visualCue: "Hero visual emblem Garuda emas futuristik dengan grid radar geosfer melingkupi peta kepulauan Nusantara."
  },
  {
    slideNumber: 2,
    title: "ANATOMI MASALAH: KUTUKAN GEOPOLITIK KEPULAUAN",
    category: "PROBLEM STATEMENT",
    tagline: "Wilayah Seluas Benua Eropa Namun Terjebak Paradigma 'Patroli Buta' (Blind Patrol)",
    bulletPoints: [
      "Luas laut 5,8 juta km² dengan 3 Alur Laut Kepulauan Indonesia (ALKI) yang sangat padat",
      "Biaya patroli laut/udara konvensional sangat mahal (mencapai ratusan juta rupiah per sortie)",
      "Kapal pencuri ikan asing mematikan AIS ('Dark Vessel') dan bersembunyi di balik cuaca buruk",
      "Pembalakan liar (illegal logging) membuka koridor pedalaman sebelum terdeteksi secara manual"
    ],
    keyMetric: { label: "Kerugian IUU & Logging", value: "Rp 75+ Triliun/Thn" },
    speakerNotes: "Kita tidak bisa menaruh kapal perang di setiap mil laut. Berpatroli tanpa data intelijen real-time hanya membakar bahan bakar dan menyisakan celah kedaulatan yang dieksploitasi pelaku kejahatan.",
    visualCue: "Peta blind spot wilayah ZEE Natuna & Arafura dengan ilustrasi biaya BBM operasional kapal patroli."
  },
  {
    slideNumber: 3,
    title: "SOLUSI GDS v3: SISTEM SARAF PERTAHANAN KEPULAUAN",
    category: "CORE VALUE PROPOSITION",
    tagline: "Bukan Sekadar Radar Statis, Melainkan Neural Sensor Mesh yang Adaptif",
    bulletPoints: [
      "Integrasi Multi-Intelligence: GEOINT (SAR Radar), SIGINT, AIS, Akustik Hutan, dan Seismik",
      "Garuda Brain: Mesin AI yang mengorelasikan data multi-sensor menjadi situational awareness",
      "Archipelagic Edge Computing: Kemampuan pemrosesan mandiri di pulau terluar tanpa ketergantungan koneksi pusat",
      "Human-in-the-Loop: AI menyusun rekomendasi preskriptif, komando eksekusi tetap di tangan perwira"
    ],
    keyMetric: { label: "Waktu Deteksi", value: "< 15 Menit" },
    speakerNotes: "GDS v3 mengumpulkan seluruh mata dan telinga nusantara ke dalam satu otak cerdas yang kami namakan Garuda Brain. Dari kapal tanpa AIS hingga suara gergaji mesin di tengah rimba, semua terdeteksi seketika.",
    visualCue: "Diagram aliran data sensor mesh (satelit, radar, drone, seismik) mengalir menuju Garuda Brain dan Edge Nodes."
  },
  {
    slideNumber: 4,
    title: "ARSITEKTUR ARCHIPELAGIC EDGE COMPUTING",
    category: "ENGINEERING ARCHITECTURE",
    tagline: "Sistem Tetap Beroperasi Penuh Meski Kabel Bawah Laut Terputus",
    bulletPoints: [
      "Node komputasi taktis di pulau terluar: Ranai Natuna, Sabang, Miangas, Rote, dan Merauke",
      "Model AI terkompresi lokal menjalankan inferensi tanpa perlu mengirim gigabyte video mentah ke Jakarta",
      "Sinkronisasi mesh berulang via Satelit LEO dan radio taktis HF saat fiber optik darurat offline",
      "Mobile Node terpasang langsung di Combat Management System (CMS) kapal perang KRI garis depan"
    ],
    keyMetric: { label: "Ketahanan Jaringan", value: "99.98% Uptime" },
    speakerNotes: "Bila terjadi bencana megathrust atau sabotase kabel optik bawah laut, pulau terluar kita tidak akan buta. Edge node di Ranai atau Miangas tetap menganalisis sasaran dan memandu aset pencegat setempat secara otonom.",
    visualCue: "Peta topologi mesh 7 Edge Node terdistribusi dengan jalur failover satelit dan HF radio."
  },
  {
    slideNumber: 5,
    title: "MODUL BARU: MONITORING ILLEGAL LOGGING",
    category: "DEEP DIVE MODULE 9",
    tagline: "Deteksi Dini Pembalakan Liar Tembus Awan Berbasis SAR Radar & Sensor Biofonik",
    bulletPoints: [
      "Sentinel-1 SAR C-Band mendeteksi hilangnya tutupan kanopi tanpa terhalang awan dan kabut hujan",
      "AI mengenali pola bukaan geometris koridor jalan logging dan pergerakan alat berat ekskavator",
      "Jejaring mikrofon akustik biofonik tanah menangkap suara chainsaw dalam radius 3 km",
      "Terintegrasi langsung dengan Balai Gakkum KLHK, Babinsa Kodim setempat, dan helikopter patroli"
    ],
    keyMetric: { label: "Akurasi Deteksi Kanopi", value: "98.6% Conf." },
    speakerNotes: "Inilah inovasi besar GDS v3. Hutan kita di Kalimantan dan Papua tidak lagi bisa dijarah secara sembunyi-sembunyi. Dalam hitungan jam setelah pohon ditebang, titik koordinat dan rute alat berat sudah tersaji di meja komando.",
    visualCue: "Split-screen perbandingan citra SAR sebelum-sesudah bukaan kanopi di TN Bukit Baka Bukit Raya dengan heatmap akustik chainsaw."
  },
  {
    slideNumber: 6,
    title: "MODUL BARU: MARITIME DOMAIN AWARENESS & IUU FISHING",
    category: "DEEP DIVE MODULE 10",
    tagline: "Membongkar Modus 'Dark Vessel' dan Transshipment Ilegal di Laut Lepas",
    bulletPoints: [
      "Sensor fusion mendeteksi kapal metalik yang mematikan AIS di ZEE Natuna Utara & Laut Arafura",
      "Deteksi otomatis anomali manuver: pair-trawling (pukat harimau ganda) dan transshipment BBM/ikan",
      "Kalkulasi kecepatan, arah haluan, dan proyeksi rute pelarian target ke perairan internasional",
      "Tiket disposisi operasi satu-klik ke KRI TNI AL, kapal Bakamla, dan armada Ditjen PSDKP KKP"
    ],
    keyMetric: { label: "Intersepsi Dark Vessel", value: "38 Menit ETA" },
    speakerNotes: "Kapal pencuri ikan tidak bisa lagi bersembunyi dengan mematikan AIS. Pantulan radar satelit SAR dan radar pantai menangkap badan kapal mereka, dan AI langsung membunyikan alarm pencegatan terarah.",
    visualCue: "Tampilan tactical radar plot menampilkan formasi pair trawler non-AIS di Natuna Utara lengkap dengan kalkulasi vektor intersepsi KRI."
  },
  {
    slideNumber: 7,
    title: "MODUL PEMANTAUAN SUMBER DAYA & PERTAMBANGAN (PETI)",
    category: "DEEP DIVE MODULE 11",
    tagline: "Perlindungan Daerah Aliran Sungai dan Pengawasan Tambang Tanpa Izin",
    bulletPoints: [
      "Analisis indeks kekeruhan air (turbidity) satelit Sentinel-2 mendeteksi limbah merkuri tambang emas liar",
      "Pemantauan perambahan kawasan hutan lindung untuk tambang nikel dan bauksit tanpa IPPKH",
      "Deteksi rakit penyedot emas ilegal (dredging rafts) di sepanjang sungai-sungai utama pedalaman",
      "Integrasi lintas instansi antara Kementerian ESDM, KLHK, dan Kepolisian Daerah"
    ],
    keyMetric: { label: "Valuasi Ekologis Terlindungi", value: "Rp 22 M/Kasus" },
    speakerNotes: "Modul 11 mengawasi kekayaan mineral tanah air. Penambangan ilegal yang merusak sempadan sungai dan meracuni air rakyat langsung teridentifikasi sebelum kerusakannya meluas.",
    visualCue: "Peta spektrometri DAS Kahayan dengan tanda peringatan turbiditas tinggi dan posisi rakit PETI."
  },
  {
    slideNumber: 8,
    title: "GARUDA BRAIN: CROSS-DOMAIN CORRELATION ENGINE",
    category: "AI DIFFERENTIATOR",
    tagline: "Ketika Satu Peristiwa Terhubung dengan Rantai Kejahatan di Sektor Lain",
    bulletPoints: [
      "Korelasi Kausal 1: Koridor logging liar membuka jalan gambut kering -> Memicu karhutla dan asap lintas batas",
      "Korelasi Kausal 2: Penyerbuan kapal IUU di Natuna diiringi serangan siber DDoS pada radar navigasi darat",
      "Korelasi Kausal 3: Kanal kayu bakau pesisir dimanfaatkan sindikat narkotika sebagai dermaga 'jalur tikus'",
      "Compound Risk Score membantu pembuat kebijakan memprioritaskan penindakan pada akar masalah"
    ],
    keyMetric: { label: "Sinergi Lintas Sektor", value: "340% Lebih Efisien" },
    speakerNotes: "Kejahatan masa kini tidak bekerja dalam satu kotak terisolasi. Garuda Brain adalah satu-satunya sistem yang menghubungkan logging liar dengan ancaman karhutla, atau serangan siber dengan pencurian ikan.",
    visualCue: "Interactive Node Graph memperlihatkan relasi kausalitas antar modul dengan garis-garis ancaman compound."
  },
  {
    slideNumber: 9,
    title: "PERTAHANAN UDARA, KEBENCANAAN & KETAHANAN SIBER",
    category: "FULL SPECTRUM RESILIENCE",
    tagline: "Pondasi Pertahanan Udara ADIZ dan Resiliensi Bencana Alam",
    bulletPoints: [
      "Air Defense: Deteksi LSA (Latihan Sasaran Anomali) melanggar ADIZ dengan panduan scramble jet tempur",
      "InaTEWS Disaster: Perambatan gelombang tsunami gempa megathrust & peringatan evakuasi warga < 3 menit",
      "BSSN Cyber Shield: Proteksi SCADA pelabuhan vital & pencegahan spoofing koordinat GPS maritim",
      "Karhutla Early Warning: Pemantauan hotspot FRP satelit MODIS/VIIRS sebelum api menjalar"
    ],
    keyMetric: { label: "Waktu Evakuasi Tsunami", value: "8 Menit Golden Time" },
    speakerNotes: "GDS v3 melengkapi portofolio pertahanan udara ADIZ, keselamatan rakyat dari bencana megathrust, serta perlindungan infrastruktur pelabuhan dari ancaman perang siber hibrida.",
    visualCue: "Dashboard 4-grid menampilkan radar udara Kosek I, sensor seismik Selat Sunda, dan matriks honeynet BSSN."
  },
  {
    slideNumber: 10,
    title: "DECISION SUPPORT & PRESCRIPTIVE 1-CLICK DISPATCH",
    category: "HUMAN-IN-THE-LOOP",
    tagline: "Dari Deteksi Sensor Menjadi Surat Perintah Operasi Terpadu dalam 30 Detik",
    bulletPoints: [
      "AI menghasilkan rekomendasi lengkap: Nama kapal patroli terdekat, konsumsi BBM, dan ETA ketepatan waktu",
      "Penyusunan otomatis rujukan pasal hukum penindakan (UU Perikanan, Kehutanan, Narkotika)",
      "Pengiriman draf telegram disposisi langsung ke ruang kendali TNI AL, Bakamla, atau KLHK",
      "Komando akhir mutlak diverifikasi dengan otorisasi digital perwira komando jaga"
    ],
    keyMetric: { label: "Waktu Disposisi SOP", value: "30 Detik" },
    speakerNotes: "Tidak ada lagi kebingungan siapa yang harus bertindak. Begitu ancaman terkonfirmasi, tombol 'Kirim Disposisi SOP' langsung menyalurkan perintah lengkap dengan kalkulasi aset terdekat dan landasan hukum yang sah.",
    visualCue: "Antarmuka tiket preskriptif menampilkan tombol otorisasi hijau 'Eksekusi Disposisi' dan rincian alutsista terdekat."
  },
  {
    slideNumber: 11,
    title: "ANALISIS BIAYA & PENYELAMATAN KEUANGAN NEGARA",
    category: "ECONOMIC & STRATEGIC ROI",
    tagline: "Investasi Sistem yang Menghasilkan Penghematan Triliunan Rupiah",
    bulletPoints: [
      "Penghematan BBM Armada Patroli: 42% penghematan solar dari penggantian patroli buta menjadi patroli presisi",
      "Penyelamatan Devisa Perikanan: Mengamankan potensi tangkapan senilai Rp 14,8 Miliar per kasus IUU",
      "Pencegahan Kerusakan Ekologis: Menyelamatkan jutaan hektar hutan lindung bernilai serapan karbon miliaran dolar",
      "Penyelamatan Generasi Muda: Pemotongan jalur tikus narkotika menyelamatkan ratusan ribu jiwa anak bangsa"
    ],
    keyMetric: { label: "Efisiensi BBM Tahunan", value: "Rp 620 Miliar" },
    speakerNotes: "Secara kalkulasi fiskal, GDS v3 adalah investasi yang membayar dirinya sendiri dalam tahun pertama hanya dari penghematan bahan bakar patroli laut dan sitaan kapal penjarah ikan.",
    visualCue: "Bagan perbandingan biaya operasional patroli sebelum vs sesudah implementasi GDS v3."
  },
  {
    slideNumber: 12,
    title: "DEMO SIMULASI INTERAKTIF & CAPABILITY SHOWCASE",
    category: "SOFTWARE PROTOTYPE READY",
    tagline: "Prototipe C4ISR Berfungsi Penuh Siap Diuji Skenario Lapangan",
    bulletPoints: [
      "4 Skenario Simulasi Bawaan: Krisis Natuna, Bencana Hutan Borneo, Narkoba Malaka, Megathrust Sunda",
      "Visualisasi Geospasial Interaktif: Peta taktikal kepulauan dengan layer ADIZ, ALKI, ZEE, dan Hutan Lindung",
      "Telemetry Feed Real-time: Inspeksi detail kapal, koordinat GPS, kecepatan, dan skor keyakinan AI",
      "Audio Komando Taktis: Sintesis audio responsif Web Audio API untuk alarm prioritas dan verifikasi"
    ],
    keyMetric: { label: "Kesiapan Software", value: "TRL 6-7 Ready" },
    speakerNotes: "Bapak-bapak sekalian dapat langsung mencoba prototipe interaktif ini sekarang. Semua modul, korelasi, dan simulasi penindakan sudah berjalan mulus di browser dengan data geospasial riil.",
    visualCue: "Tampilan layar penuh Dashboard v3 dengan peta geospasial Nusantara dan panel inspeksi sasaran."
  },
  {
    slideNumber: 13,
    title: "ROADMAP IMPLEMENTASI 5 TAHUN (RENSTRA)",
    category: "EXECUTION STRATEGY",
    tagline: "Rencana Bertahap Menuju Kemandirian Penuh Industri Pertahanan Nasional",
    bulletPoints: [
      "Tahun 1 (Quick-Win): Deploy Sovereign Cloud + Integrasi Satelit Publik + Uji Coba Edge Ranai & Sabang",
      "Tahun 2 (Konsolidasi): Feed Radar Militer TNI AU/AL + 8 Edge Node Pulau Terluar + SOP Otomasi KLHK/KKP",
      "Tahun 3 (Swasembada): Integrasi CubeSat SAR Nasional & Drone PUNA MALE produksi dalam negeri",
      "Tahun 4-5: Drone Maritim Otonom (USV) & Standarisasi Komando Terpadu Pusat Krisis Kepresidenan"
    ],
    keyMetric: { label: "Tahap Pertama", value: "6 Bulan Quick Win" },
    speakerNotes: "Kita tidak perlu menunggu bertahun-tahun untuk merasakan manfaatnya. Fase 1 dapat dioperasikan dalam 6 bulan pertama memanfaatkan data satelit terbuka dan infrastruktur radar yang sudah ada.",
    visualCue: "Gantt chart timeline 5 tahun dengan tonggak capaian Quick-Win hingga Kemandirian Penuh."
  },
  {
    slideNumber: 14,
    title: "KOLABORASI MULTI-KEMENTERIAN & LEMBAGA (DOD-INTERAGENCY)",
    category: "GOVERNANCE & SYNERGY",
    tagline: "Satu Peta Situasional Bersama (Single Common Operating Picture)",
    bulletPoints: [
      "Mabes TNI (AU, AL, AD): Perlindungan kedaulatan teritorial, ADIZ, dan penegakan hukum ZEE",
      "Kementerian Kelautan & Perikanan (KKP) + Bakamla: Pengawasan sumber daya kelautan dan selat strategis",
      "Kementerian LHK: Pengamanan hutan lindung, cagar alam, dan penanggulangan karhutla",
      "BSSN, BNPB, & BNN: Ketahanan siber nasional, mitigasi bencana cepat, dan pemberantasan narkotika"
    ],
    keyMetric: { label: "Instansi Terhubung", value: "8 Lembaga Negara" },
    speakerNotes: "Kekuatan sejati GDS v3 terletak pada kemampuannya meruntuhkan sekat ego sektoral antar lembaga, menghadirkan satu peta situasi tunggal yang diakui dan digunakan bersama.",
    visualCue: "Piramida sinergi kelembagaan dengan Garuda Brain di pusat koordinasi terpadu."
  },
  {
    slideNumber: 15,
    title: "KESIMPULAN: MENJAGA INDONESIA SEBAGAI POROS MARITIM DUNIA",
    category: "CALL TO ACTION",
    tagline: "Lompatan Berani Membela Kedaulatan Sumber Daya dan Masa Depan Bangsa",
    bulletPoints: [
      "Garuda Dome System v3 adalah bukti nyata teknologi anak bangsa yang berdaulat dan tangguh",
      "Menggabungkan pertahanan militer dengan perlindungan ekonomi dan ekologi hutan-laut",
      "Kesiapan komando presisi: Tepat sasaran, efisien anggaran, dan berlandaskan hukum tegak",
      "Bersama GDS, Indonesia berdaulat dari Sabang sampai Merauke, dari Miangas hingga Rote"
    ],
    keyMetric: { label: "Status Kesiapan", value: "Siap Uji Lapangan" },
    speakerNotes: "Kedaulatan bukan sekadar kata dalam pidato, melainkan kemampuan menjaga setiap jengkal tanah, setiap tetes air laut, dan setiap helai daun hutan nusantara. Terima kasih, mohon arahan pimpinan.",
    visualCue: "Logo GDS v3 bersanding dengan bendera Merah Putih dan semboyan 'Garuda Melindungi Ibu Pertiwi'."
  }
];
