export interface VideoScriptScene {
  sceneNumber: number;
  timecode: string;
  durationSec: number;
  title: string;
  visualDirection: string;
  voiceoverText: string;
  sfxAndMusic: string;
}

export const GDS_VIDEO_SCRIPT: VideoScriptScene[] = [
  {
    sceneNumber: 1,
    timecode: "00:00 - 00:25",
    durationSec: 25,
    title: "Opening: Tantangan Geopolitik & Kedaulatan Kepulauan",
    visualDirection: "Opening dramatis dengan animasi globe berputar cepat lalu zoom-in tajam ke Kepulauan Indonesia. Garis batas ZEE, 3 jalur ALKI, dan ribuan pulau berpendar. Teks '17.508 PULAU, 5.8 JUTA KM² LAUT' muncul dengan efek glitch militer.",
    voiceoverText: "Indonesia, bentangan zamrud khatulistiwa dengan belasan ribu pulau dan perairan laut seluas benua Eropa. Namun di balik keindahan dan kekayaan alamnya, tersimpan celah kerentanan asimetris. Triliunan rupiah kekayaan laut dijarah, jutaan hektar hutan lindung ditebang tanpa terdeteksi, dan ruang udara kita diintai setiap detik.",
    sfxAndMusic: "Musik orkestra ketegangan militer bertempo rendah dengan dentuman bass subwoofer berulang (low heartbeat pulse)."
  },
  {
    sceneNumber: 2,
    timecode: "00:25 - 00:55",
    durationSec: 30,
    title: "Kelemahan Patroli Konvensional: Paradigma 'Blind Patrol'",
    visualDirection: "Transisi ke grafik perbandingan: Kapal perang KRI berlayar di laut lepas tanpa panduan, biaya bahan bakar membengkak. Di sudut lain, kapal pencuri ikan asing mematikan sinyal AIS (berubah menjadi bayangan hitam bertuliskan 'DARK VESSEL') di ZEE Natuna Utara.",
    voiceoverText: "Selama puluhan tahun, penegakan hukum kita terjebak dalam paradigma patroli buta. Berpatroli tanpa intelijen presisi hanya membakar solar dan menyisakan kekosongan pengawasan. Terlebih, kapal pencuri ikan kini secara licik mematikan sistem navigasi AIS mereka, bersembunyi di balik awan tebal dan kegelapan malam.",
    sfxAndMusic: "Efek suara radar sonar statik melemah (faint sonar blip) menandakan sasaran hilang kontak."
  },
  {
    sceneNumber: 3,
    timecode: "00:55 - 01:30",
    durationSec: 35,
    title: "Peluncuran Garuda Dome System v3: The Neural Defense Grid",
    visualDirection: "Layar memancarkan grid digital bercahaya emas dan cyan. Teks 'GARUDA DOME SYSTEM v3' tampil kokoh. Diagram arsitektur memancarkan sinar dari satelit SAR, radar pantai Ranai, stasiun seismik, sensor akustik hutan, ke pusat 'Garuda Brain'.",
    voiceoverText: "Inilah jawaban berdaulat bangsa: Garuda Dome System versi 3. Sebuah platform ketahanan nasional terintegrasi multi-domain yang memadukan sensor fusion darat, laut, udara, antariksa, dan siber ke dalam satu otak kecerdasan buatan terpadu. Tak ada lagi kata buta. Tak ada lagi celah yang luput.",
    sfxAndMusic: "Musik bertransisi heroik, nada orkestra naik bersemangat, diselingi efek suara digital 'data stream initialization' yang renyah."
  },
  {
    sceneNumber: 4,
    timecode: "01:30 - 02:05",
    durationSec: 35,
    title: "Demo Kasus 1: Membongkar Dark Vessel IUU Fishing di Natuna",
    visualDirection: "Kamera zoom masuk ke peta taktikal Laut Natuna Utara. Tiba-tiba satelit SAR Sentinel-1 mendeteksi 4 kontak metalik berkecepatan 3,8 knot. AI menyematkan label merah: 'ALERT: DARK VESSEL DETECTED - PAIR TRAWLER'. Pop-up inspeksi membuka data tonase dan estimasi kerugian Rp 14,8 Miliar.",
    voiceoverText: "Mari kita saksikan kehebatannya di perairan Natuna Utara. Ketika empat kapal asing mematikan transponder AIS untuk mencuri ikan karang kita, satelit SAR radar GDS tetap menembus awan tebal mendeteksi pantulan lambung baja mereka. Algoritma AI langsung mengenali pola zig-zag pukat harimau yang terlarang, menghitung rute pelarian, dan menyusun disposisi penindakan dalam tempo kurang dari semenit.",
    sfxAndMusic: "Bunyi alarm taktikal ganda (two-tone alert) diikuti suara ketukan keyboard mekanik saat data telemetri terisi otomatis."
  },
  {
    sceneNumber: 5,
    timecode: "02:05 - 02:40",
    durationSec: 35,
    title: "Demo Kasus 2: Deteksi Dini Pembalakan Liar (Illegal Logging) di Kalimantan",
    visualDirection: "Peta bergeser ke pedalaman Kalimantan Tengah, Taman Nasional Bukit Baka Bukit Raya. Citra radar multi-waktu menampilkan bukaan tajam kanopi seluas 84 Hektar. Gelombang suara akustik biofonik tanah bergetar: 'Chainsaw & Hydraulic Excavator Signature Confirmed'.",
    voiceoverText: "Bukan hanya laut, paru-paru dunia kita kini dijaga ketat. Modul Monitoring Pembalakan Liar mendeteksi bukaan tajam kanopi kayu ulin di pedalaman Bukit Baka Bukit Raya. Sensor biofonik menangkap frekuensi gergaji mesin dan deru ekskavator. Sistem langsung menghubungkan Babinsa dan Brigade Bekantan KLHK melalui helikopter taktis sebelum kayu sempat dirakit ke sungai.",
    sfxAndMusic: "Efek suara desau angin hutan, diikuti frekuensi audio waveform bergetar dan bunyi 'Target Locked' tajam."
  },
  {
    sceneNumber: 6,
    timecode: "02:40 - 03:15",
    durationSec: 35,
    title: "Kekuatan Archipelagic Edge & Human-in-the-Loop Decision Support",
    visualDirection: "Visualisasi 7 Edge Node di pulau terluar (Ranai, Sabang, Miangas, Merauke, Rote). Kabel optik putus disimulasikan, namun node tetap hijau menyala via Satelit LEO. Perwira komando menekan tombol hijau 'SETUJUI DISPOSISI SOP', seketika telegram KRI meluncur.",
    voiceoverText: "Diperkuat dengan Archipelagic Edge Computing, pulau-pulau terluar kita seperti Ranai dan Miangas tetap mampu memproses intelijen mandiri bahkan ketika jalur komunikasi kabel bawah laut terputus. Dan yang terpenting: sistem menjamin prinsip Human-in-the-Loop. Keputusan penindakan akhir tetap berada di bawah otorisasi penuh perwira komando kita.",
    sfxAndMusic: "Efek suara chime konfirmasi militer 'Authorization Confirmed' yang mantap dan tegas."
  },
  {
    sceneNumber: 7,
    timecode: "03:15 - 03:45",
    durationSec: 30,
    title: "Closing: Masa Depan Ketahanan Indonesia Berdaulat",
    visualDirection: "Kembali ke tampilan peta penuh Nusantara yang terlindungi kubah pelindung multi-warna (Garuda Dome). Logo GDS v3, TNI, KLHK, KKP, Bakamla, dan BSSN bersatu di layar penutup dengan semboyan 'Mata dan Pikiran Nusantara'.",
    voiceoverText: "Garuda Dome System v3: Mengubah patroli buta menjadi pukulan presisi. Menyelamatkan triliunan rupiah devisa negara, menjaga kekayaan alam nusantara, dan mengukuhkan Indonesia sebagai poros maritim dunia yang disegani. Siap diuji. Siap beroperasi. Demi kedaulatan Ibu Pertiwi.",
    sfxAndMusic: "Puncak simfoni musik penutup dengan dentuman drum megah dan nada penutup yang elegan dan berwibawa."
  }
];
