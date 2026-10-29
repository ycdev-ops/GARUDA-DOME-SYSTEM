import { Incident, EdgeNode, CrossDomainCorrelation, SimulationScenario } from '../types/gds';

export const INITIAL_INCIDENTS: Incident[] = [
  // 1. ILLEGAL FISHING (IUU FISHING) - NATUNA
  {
    id: 'INC-IUU-01',
    code: 'GDS-MAR-7729',
    title: 'Flotila Dark Vessel (Non-AIS) Trawler Asing di ZEE Natuna Utara',
    domain: 'illegal_fishing',
    threatLevel: 'CRITICAL',
    status: 'DETECTED',
    timestamp: '2026-10-29 13:42 WIB',
    coordinates: [4.82, 108.75], // Laut Natuna Utara Blok D-Alpha
    locationName: 'ZEE Indonesia, Laut Natuna Utara (Landas Kontinen)',
    region: 'WIB',
    description: 'Sensor SAR Sentinel-1 & Radar Pantai Ranai mendeteksi 4 target metalik berkecepatan 3.8 knot dengan formasi pair-trawling di perairan kaya ikan Natuna. AIS dalam posisi mati (Dark Vessel). Garuda Brain mengidentifikasi profil tangkapan pukat harimau terlarang berpotensi mencuri 120 ton ikan pelagis.',
    sensorsInvolved: ['Sentinel-1 SAR Radar', 'Coastal Radar IMSS Ranai', 'AIS Anomaly Filter', 'Drone Intai PUNA MALE'],
    confidenceScore: 97.8,
    affectedAgency: ['TNI AL (Koarmada I)', 'Bakamla RI', 'KKP PSDKP'],
    estimatedLossIDR: 'Rp 14,8 Miliar / Siklus',
    maritimeDetails: {
      vesselType: 'Twin Pair Trawler Steel Hull (350 GT)',
      flagState: 'Bendera Asing / Non-Registered',
      isDarkVessel: true,
      speedKnots: 3.8,
      headingDeg: 142,
      estimatedTonnageGT: 350,
      anomalyType: 'Penangkapan Ikan Tanpa Izin'
    },
    correlationLinks: ['INC-CYB-01', 'INC-NAR-01'],
    prescriptiveAction: {
      sopCode: 'SOP-GDS-MAR-08B',
      recommendedAsset: 'KRI Bung Tomo-357 & KN Tanjung Datu-1101 + Helikopter Panther AS565',
      operatingUnit: 'Guspurla Koarmada I / Pangkalan TNI AL Ranai',
      leadAgency: 'TNI Angkatan Laut',
      supportingAgencies: ['Bakamla RI', 'Ditjen PSDKP KKP'],
      etaMinutes: 38,
      actionPlan: 'Manuver pencegatan taktis (interdiction), luncurkan RHIB tim VBSS untuk pemeriksaan fisik kapal, amankan muatan dan sita alat tangkap pukat harimau ilegal.',
      legalBasis: 'UU No. 45/2009 tentang Perikanan & UNCLOS 1982 Pasal 73 (Penegakan Kedaulatan ZEE)'
    }
  },

  // 2. ILLEGAL FISHING - ARAFURA TRANSSHIPMENT
  {
    id: 'INC-IUU-02',
    code: 'GDS-MAR-7840',
    title: 'Transshipment Ilegal Muatan Ikan & BBM di Laut Arafura (WPPNRI 718)',
    domain: 'illegal_fishing',
    threatLevel: 'HIGH',
    status: 'VERIFYING',
    timestamp: '2026-10-29 14:10 WIT',
    coordinates: [-6.85, 136.20], // Laut Arafura
    locationName: 'Perairan Arafura, Zona Konservasi Perikanan Udang & Kakap',
    region: 'WIT',
    description: 'AI mendeteksi anomali pertemuan dua kapal kargo berbobot 1.200 GT dan kapal penangkap lokal yang berdempetan (loitering side-by-side) selama 3 jam di tengah laut lepas tanpa status pelaporan port clearance. Dugaan transfer hasil tangkapan tanpa bea cukai (transshipment gelap).',
    sensorsInvolved: ['Kombinasi AIS S-Band', 'Satelit Optik Gaofen', 'Patroli Udara Maritim TNI AL C-295'],
    confidenceScore: 94.2,
    affectedAgency: ['KKP', 'TNI AL (Koarmada III)', 'Bea Cukai'],
    estimatedLossIDR: 'Rp 28,5 Miliar',
    maritimeDetails: {
      vesselType: 'Reefer Vessel (Kargo Pendingin) + Wooden Catcher',
      flagState: 'Bendera Kemudahan (Flag of Convenience)',
      isDarkVessel: false,
      speedKnots: 0.5,
      headingDeg: 85,
      estimatedTonnageGT: 1250,
      anomalyType: 'Transshipment Ilegal'
    },
    correlationLinks: [],
    prescriptiveAction: {
      sopCode: 'SOP-GDS-MAR-12A',
      recommendedAsset: 'KRI Teluk Bintuni-520 & Kapal Pengawas Orca 05 KKP',
      operatingUnit: 'Lantamal XI Merauke & PSDKP Tual',
      leadAgency: 'KKP Ditjen PSDKP',
      supportingAgencies: ['TNI AL Koarmada III', 'Ditjen Bea Cukai'],
      etaMinutes: 65,
      actionPlan: 'Penghentian operasional alih muatan di laut, inspeksi dokumen manifest logistik pendingin, dan pengawalan menuju dermaga Pangkalan TNI AL Merauke.',
      legalBasis: 'Permen KP No. 58/PERMEN-KP/2020 tentang Larangan Transshipment Tanpa Izin'
    }
  },

  // 3. ILLEGAL LOGGING - TAMAN NASIONAL BUKIT BAKA BUKIT RAYA
  {
    id: 'INC-LOG-01',
    code: 'GDS-FOR-3310',
    title: 'Pembukaan Koridor Jalan Ilegal & Deforestasi Masif di Jantung Kalimantan',
    domain: 'illegal_logging',
    threatLevel: 'CRITICAL',
    status: 'DETECTED',
    timestamp: '2026-10-29 11:15 WIB',
    coordinates: [-0.62, 112.65], // TN Bukit Baka Bukit Raya
    locationName: 'Taman Nasional Bukit Baka Bukit Raya, Perbatasan Kalbar-Kalteng',
    region: 'WIB',
    description: 'Analisis time-series Sentinel-1 SAR Coherence Loss mendeteksi bukaan tajam kanopi seluas 84,6 Hektar hutan primer ulin dan meranti dalam 48 jam terakhir. Sensor akustik biofonik tanah merekam suara mesin gergaji mesin (chainsaw) dan pergerakan alat berat ekskavator hidrolik.',
    sensorsInvolved: ['Sentinel-1 C-Band SAR', 'Acoustic Mesh TN Guardian', 'PlanetScope Dove Constellation', 'Drone Thermal KLHK'],
    confidenceScore: 98.6,
    affectedAgency: ['Balai Gakkum KLHK', 'TNI AD (Kodam XII/Tanjungpura)', 'Polres Melawi'],
    estimatedLossIDR: 'Rp 63,2 Miliar (Valuasi Ekologis & Kayu Langka)',
    loggingDetails: {
      deforestedHa: 84.6,
      canopyLossRate: '42.3 Ha / Hari (Akut)',
      detectionMethod: 'Sentinel-1 SAR Radar',
      targetSpecies: 'Kayu Ulin (Eusideroxylon zwageri) & Meranti Merah',
      heavyMachineryDetected: true,
      protectedAreaType: 'Taman Nasional'
    },
    correlationLinks: ['INC-FIR-01', 'INC-RES-01'],
    prescriptiveAction: {
      sopCode: 'SOP-GDS-FOR-03',
      recommendedAsset: 'Tim Reaksi Cepat SPORC Brigade Bekantan + Babinsa Kodim 1205/Sintang via Heli Bell 412',
      operatingUnit: 'Balai Penegakan Hukum KLHK Kalimantan & Korem 121/ABW',
      leadAgency: 'KLHK Ditjen Gakkum',
      supportingAgencies: ['TNI AD (Kodam XII)', 'Polri Ditreskrimsus'],
      etaMinutes: 45,
      actionPlan: 'Penerjunan tim gabungan taktis untuk penyergapan basecamp pembalak, penyitaan 3 unit alat berat ekskavator, pemblokiran jalan koridor kayu, dan penangkapan cukong log kayu ilegal.',
      legalBasis: 'UU No. 18 Tahun 2013 tentang Pencegahan dan Pemberantasan Perusakan Hutan (P3H)'
    }
  },

  // 4. ILLEGAL LOGGING - HUTAN LINDUNG RIAU PESISIR
  {
    id: 'INC-LOG-02',
    code: 'GDS-FOR-3325',
    title: 'Perambahan Hutan Mangrove & Penyelundupan Kayu Bakau via Muara Riau',
    domain: 'illegal_logging',
    threatLevel: 'HIGH',
    status: 'VERIFYING',
    timestamp: '2026-10-29 12:50 WIB',
    coordinates: [1.85, 102.15], // Pesisir Bengkalis Riau
    locationName: 'Kawasan Hutan Lindung Mangrove Selat Rupat, Bengkalis, Riau',
    region: 'WIB',
    description: 'AI mendeteksi bukaan hutan mangrove pesisir seluas 32 Ha yang dikonversi menjadi jalur kanal kayu arang ilegal. Citra satelit optik menunjukkan akumulasi rakit gelondongan kayu bakau siap muat ke kapal tongkang menuju perairan internasional.',
    sensorsInvolved: ['Satelit Landsat-9', 'Patroli Drone FLIR', 'Kamera AIS Pos Pengamat TNI AL'],
    confidenceScore: 92.1,
    affectedAgency: ['KLHK', 'Polairud Polda Riau', 'Lanal Dumai'],
    estimatedLossIDR: 'Rp 11,5 Miliar + Degradasi Pesisir Abrasi',
    loggingDetails: {
      deforestedHa: 32.0,
      canopyLossRate: '8.0 Ha / Minggu',
      detectionMethod: 'Drone PUNA Male',
      targetSpecies: 'Bakau Mangrove (Rhizophora apiculata)',
      heavyMachineryDetected: false,
      protectedAreaType: 'Hutan Lindung'
    },
    correlationLinks: ['INC-NAR-01', 'INC-FIR-02'],
    prescriptiveAction: {
      sopCode: 'SOP-GDS-FOR-07',
      recommendedAsset: 'Kapal Patroli KAL Dumai & Sea Rider Polairud',
      operatingUnit: 'Posal Bengkalis & Ditpolairud Riau',
      leadAgency: 'Polairud & Balai KSDA Riau',
      supportingAgencies: ['TNI AL Lanal Dumai', 'Gakkum KLHK'],
      etaMinutes: 25,
      actionPlan: 'Pencegatan tongkang di muara kanal kayu arang, penutupan parit bukaan liar dengan bronjong karung pasir, penegakan hukum terhadap pemilik dapur arang ilegal.',
      legalBasis: 'UU Perlindungan Pengelolaan Lingkungan Hidup No. 32/2009'
    }
  },

  // 5. PERTAHANAN UDARA & ADIZ (AIR DEFENSE)
  {
    id: 'INC-AIR-01',
    code: 'GDS-AIR-1092',
    title: 'Sasaran Anomali Udara (LSA) Melanggar ADIZ di Atas Kepulauan Natuna',
    domain: 'air_defense',
    threatLevel: 'CRITICAL',
    status: 'INTERCEPTING',
    timestamp: '2026-10-29 14:22 WIB',
    coordinates: [4.45, 107.95],
    locationName: 'Koridor Udara Ranai, ADIZ Sektor I Natuna',
    region: 'WIB',
    description: 'Radar Satrad 212 Ranai & radar pasif mencatat kontak udara bergerak pada ketinggian Flight Level 360 kecepatan 540 knots tanpa flight plan terdaftar dan transponder Mode-S IFF non-responsif. Garuda Brain menetapkan klasifikasi Unknown / Hostile Potential.',
    sensorsInvolved: ['Satrad 212 Ranai', 'Radar MSSR Kemenhub', 'Sistem Pasif ESM TNI AU', 'Satelit EW'],
    confidenceScore: 99.1,
    affectedAgency: ['TNI AU (Koopsud I)', 'Kohanudnas / Kosek I', 'Kemenhub Perhubungan Udara'],
    maritimeDetails: undefined,
    correlationLinks: ['INC-IUU-01'],
    prescriptiveAction: {
      sopCode: 'SOP-KOS-AIR-01A',
      recommendedAsset: '2x Jet Tempur Sukhoi Su-30MK2 Skadron Udara 14 / F-16 C/D Pekanbaru',
      operatingUnit: 'Lanud Roesmin Nurjadin & Lanud Raden Sadjad',
      leadAgency: 'TNI Angkatan Udara (Koopsud I)',
      supportingAgencies: ['AirNav Indonesia', 'Kementerian Luar Negeri'],
      etaMinutes: 12,
      actionPlan: 'Prosedur Scramble pencegatan udara, visual identification (VisId), peringatan radio frekuensi darurat 121.5 MHz, dan pemaksaan mendarat (force down) jika tidak koperatif.',
      legalBasis: 'PP No. 4 Tahun 2018 tentang Pengamanan Wilayah Udara RI'
    }
  },

  // 6. KARHUTLA & KUALITAS UDARA
  {
    id: 'INC-FIR-01',
    code: 'GDS-FIR-5512',
    title: 'Klaster Hotspot FRP Tinggi & Kebakaran Gambut Dangkal di Kubu Raya',
    domain: 'karhutla',
    threatLevel: 'HIGH',
    status: 'DISPATCHED',
    timestamp: '2026-10-29 13:05 WIB',
    coordinates: [-0.18, 109.45], // Kubu Raya Kalbar
    locationName: 'Lahan Gambut Rasau Jaya, Kubu Raya, Kalimantan Barat',
    region: 'WIB',
    description: 'Satelit Terra/Aqua MODIS dan VIIRS SNPP mengonfirmasi 18 titik panas dengan Fire Radiative Power (FRP) > 85 MW. Angin bertiup ke arah barat daya berpotensi menyebarkan kabut asap pekat ke Bandara Supadio Pontianak.',
    sensorsInvolved: ['Satelit VIIRS 375m', 'MODIS Aqua/Terra', 'Stasiun ISPU KLHK Pontianak', 'CCTV Pemantau Asap Menara'],
    confidenceScore: 96.0,
    affectedAgency: ['BPBD Kalbar', 'Manggala Agni KLHK', 'TNI AD (Kodim 1207/Pontianak)', 'BNPB'],
    estimatedLossIDR: 'Rp 4,2 Miliar / Hari Gangguan Penerbangan',
    correlationLinks: ['INC-LOG-01'],
    prescriptiveAction: {
      sopCode: 'SOP-GDS-FIR-04',
      recommendedAsset: 'Heli Water Bombing Kamov Ka-32 BNPB & Tim Darat Manggala Agni',
      operatingUnit: 'Satgas Gabungan Karhutla Kalbar',
      leadAgency: 'BPBD & Manggala Agni',
      supportingAgencies: ['TNI AD', 'TNI AU (TMC Hujan Buatan)', 'Polres Kubu Raya'],
      etaMinutes: 30,
      actionPlan: 'Operasi pengeboman air terfokus di episentrum titik api gambut kubah dalam, pembasahan kanal sekat (canal blocking), dan patroli penegakan hukum pembakar lahan.',
      legalBasis: 'Inpres No. 3 Tahun 2020 tentang Penanggulangan Kebakaran Hutan dan Lahan'
    }
  },

  // 7. SIBER & DISINFORMASI (BSSN & KOMINFO)
  {
    id: 'INC-CYB-01',
    code: 'GDS-CYB-9901',
    title: 'Serangan DDoS & Injeksi GPS Jamming Spoofing AIS di Selat Malaka',
    domain: 'cyber_defense',
    threatLevel: 'HIGH',
    status: 'CONTAINED',
    timestamp: '2026-10-29 14:02 WIB',
    coordinates: [1.25, 103.45],
    locationName: 'Infrastruktur VTS Selat Malaka & Batam Node Hub',
    region: 'WIB',
    description: 'Pusat Operasi Keamanan Siber BSSN mendeteksi anomali paket data banjir 450 Gbps yang menargetkan server stasiun penerima Vessel Traffic Services (VTS). Secara simultan terjadi sinyal spoofing GPS yang memalsukan koordinat kapal nelayan Indonesia.',
    sensorsInvolved: ['Sensor SOC BSSN Honeynet', 'Sensor Spektrum Balmon Frekuensi', 'Log Gateway AIS Hub'],
    confidenceScore: 98.4,
    affectedAgency: ['BSSN', 'Kemenkominfo', 'Disinfolahta TNI', 'Navigasi Perhubungan Laut'],
    correlationLinks: ['INC-IUU-01', 'INC-AIR-01'],
    prescriptiveAction: {
      sopCode: 'SOP-BSSN-CSIRT-02',
      recommendedAsset: 'Mitigasi Scrubbing Center BSSN Cyber Shield & Failover ke Edge Node Ranai',
      operatingUnit: 'National Cyber Coordination Center (NC3) BSSN',
      leadAgency: 'Badan Siber dan Sandi Negara (BSSN)',
      supportingAgencies: ['Satsiber TNI', 'Subdit Cyber Crime Bareskrim Polri'],
      etaMinutes: 5,
      actionPlan: 'Aktivasi geo-blocking traffic asing berbahaya, pengalihan protokol sinkronisasi ke enkripsi militer satelit ku-band terenkripsi, sinkronisasi jam atom PNT alternatif.',
      legalBasis: 'Perpres No. 82 Tahun 2022 tentang Tata Kelola Perlindungan Infrastruktur Informasi Vital'
    }
  },

  // 8. BORDER NARCOTICS & PENYELUNDUPAN (BNN & POLRI)
  {
    id: 'INC-NAR-01',
    code: 'GDS-NAR-4411',
    title: 'Penyusupan Speedboat Siluman "Jalur Tikus" Selat Malaka Menuju Asahan',
    domain: 'narcotics_border',
    threatLevel: 'CRITICAL',
    status: 'INTERCEPTING',
    timestamp: '2026-10-29 14:35 WIB',
    coordinates: [3.10, 100.12], // Selat Malaka off Asahan
    locationName: 'Perairan Tanjung Balai Asahan, Selat Malaka',
    region: 'WIB',
    description: 'Radar pengintai pantai mendeteksi kontak kecil bertenaga 4x250 HP bergerak dengan kecepatan ekstrem 38 knot tanpa lampu navigasi pada koordinat rawan penyelundupan. Informasi intelijen BNN mengonfirmasi adanya kurir narkotika transnasional 150 kg Methamphetamine.',
    sensorsInvolved: ['Radar Pesisir Coastal Surveillance', 'Kamera Night-Vision Optronik FLIR', 'SIGINT Intercept Frekuensi'],
    confidenceScore: 95.7,
    affectedAgency: ['BNN RI', 'TNI AL (Lanal Tanjung Balai Asahan)', 'Bea Cukai Kepri', 'Polairud'],
    estimatedLossIDR: 'Penyelamatan 750.000 Jiwa Generasi Muda',
    maritimeDetails: {
      vesselType: 'Custom High-Speed Interceptor Boat (Fiberglass 40ft)',
      flagState: 'Tanpa Bendera',
      isDarkVessel: true,
      speedKnots: 38.2,
      headingDeg: 215,
      estimatedTonnageGT: 12,
      anomalyType: 'Pelanggaran ZEE'
    },
    correlationLinks: ['INC-IUU-01', 'INC-LOG-02'],
    prescriptiveAction: {
      sopCode: 'SOP-BNN-SEA-09',
      recommendedAsset: 'Sea Rider Patkamla TNI AL & Fast Patrol Boat BC 15048 Bea Cukai',
      operatingUnit: 'Satgas Maritim Terpadu Pesisir Timur Sumatera',
      leadAgency: 'Badan Narkotika Nasional (BNN)',
      supportingAgencies: ['TNI AL Lanal TBA', 'Kantor Wilayah Bea Cukai Khusus Kepri'],
      etaMinutes: 18,
      actionPlan: 'Penjepitan taktis kapal cepat dari dua arah, pencegahan pembuangan barang bukti ke laut dengan pengawasan drone malam hari, penangkapan awak di muara sungai.',
      legalBasis: 'UU No. 35 Tahun 2009 tentang Narkotika'
    }
  },

  // 9. MITIGASI BENCANA & TSUNAMI (BNPB & BMKG)
  {
    id: 'INC-DIS-01',
    code: 'GDS-DIS-6603',
    title: 'Gempa Megathrust M 7.1 Selat Sunda - Aktivasi Peringatan Dini InaTEWS',
    domain: 'disaster',
    threatLevel: 'HIGH',
    status: 'VERIFYING',
    timestamp: '2026-10-29 14:18 WIB',
    coordinates: [-6.42, 105.15],
    locationName: 'Zona Subduksi Selat Sunda, Barat Daya Ujung Kulon',
    region: 'WIB',
    description: 'Sensor Seismometer BMKG & Buoy Tsunami Selat Sunda mencatat gempa tektonik kedalaman 22 km. Algoritma perambatan gelombang tsunami GDS memprediksi potensi hempasan gelombang 1,8 meter di pesisir barat Pandeglang dan Kalianda dalam 28 menit.',
    sensorsInvolved: ['Sensor Seismik InaTEWS BMKG', 'Buoy Tsunami Akustik BPPT/BRIN', 'Sensor Pasut Tide Gauge Cilegon'],
    confidenceScore: 99.8,
    affectedAgency: ['BNPB', 'BMKG', 'Basarnas', 'TNI AD Korem 064/Maulana Yusuf'],
    correlationLinks: [],
    prescriptiveAction: {
      sopCode: 'SOP-INA-TSU-01',
      recommendedAsset: 'Sirine Tsunami Sirens Pesisir Banten-Lampung & Broadcast SMS Blast Darurat',
      operatingUnit: 'Pusdalops BNPB & BPBD Provinsi Banten/Lampung',
      leadAgency: 'Badan Nasional Penanggulangan Bencana (BNPB)',
      supportingAgencies: ['BMKG', 'Basarnas Kansar Banten', 'TNI / Polri Siaga Bencana'],
      etaMinutes: 8,
      actionPlan: 'Pembunyian sirine evakuasi mandiri ke Tempat Evakuasi Sementara (TES), penghentian operasional penyeberangan Bakauheni-Merak sementara, aktivasi pos komando taktis darurat.',
      legalBasis: 'UU No. 24 Tahun 2007 tentang Penanggulangan Bencana'
    }
  },

  // 10. PEMANTAUAN SUMBER DAYA & PERTAMBANGAN ILEGAL
  {
    id: 'INC-RES-01',
    code: 'GDS-RES-8812',
    title: 'Anomali Pertambangan Tanpa Izin (PETI) & Limpasan Merkuri DAS Kahayan',
    domain: 'resource_mining',
    threatLevel: 'HIGH',
    status: 'DETECTED',
    timestamp: '2026-10-29 10:40 WIB',
    coordinates: [-1.45, 113.80], // Kalteng
    locationName: 'Daerah Aliran Sungai (DAS) Kahayan Hulu, Kalimantan Tengah',
    region: 'WIB',
    description: 'Sensor multispektral satelit Sentinel-2 mendeteksi peningkatan kekeruhan sedimen sungai (turbidity) hingga 380 NTU akibat aktivitas 14 rakit penyedot emas ilegal (dredging rafts). Pembuangan limbah merkuri mengancam pasokan air minum 4 kecamatan.',
    sensorsInvolved: ['Sentinel-2 MSI Turbidity Index', 'Drone Sensor Spektral KLHK', 'Pemantau Kualitas Air DAS'],
    confidenceScore: 93.5,
    affectedAgency: ['KLHK', 'Kementerian ESDM', 'Polres Gunung Mas', 'Kodim 1016/Palangka Raya'],
    estimatedLossIDR: 'Rp 22,0 Miliar (Kerusakan Ekosistem Sungai)',
    correlationLinks: ['INC-LOG-01'],
    prescriptiveAction: {
      sopCode: 'SOP-GDS-MIN-02',
      recommendedAsset: 'Satgas Penegakan Hukum PETI Terpadu (SPORC + Reskrimsus)',
      operatingUnit: 'Balai Gakkum LHK Wilayah Kalimantan & Ditreskrimsus Polda Kalteng',
      leadAgency: 'Kementerian ESDM & KLHK',
      supportingAgencies: ['Polri Polda Kalteng', 'TNI AD Kodim Palangka Raya'],
      etaMinutes: 60,
      actionPlan: 'Penyegelan dan pembongkaran rakit sedot tambang ilegal, pengamanan bahan kimia berbahaya sianida/merkuri, rehabilitasi sempadan sungai.',
      legalBasis: 'UU No. 3 Tahun 2020 tentang Pertambangan Mineral dan Batubara'
    }
  }
];

export const EDGE_NODES: EdgeNode[] = [
  {
    id: 'NODE-01',
    name: 'Edge Node Ranai Natuna',
    code: 'GDS-EDGE-NTN',
    location: 'Ranai, Kepulauan Natuna',
    coordinates: [3.95, 108.38],
    status: 'NOMINAL',
    role: 'Frontline Defense & Maritime IUU Surveillance Blok Utara',
    coverageRadiusKm: 420,
    localLatencyMs: 14,
    meshUplink: 'SATELIT_LEO',
    aiModelVersion: 'GarudaBrain-Edge v3.2.1-Maritime',
    activeSensors: 24
  },
  {
    id: 'NODE-02',
    name: 'Edge Node Sabang / Pulau Rondo',
    code: 'GDS-EDGE-SBG',
    location: 'Sabang, D.I. Aceh',
    coordinates: [5.89, 95.32],
    status: 'NOMINAL',
    role: 'Gerbang Barat Selat Malaka & Pengawasan Narkoba / ALKI I',
    coverageRadiusKm: 380,
    localLatencyMs: 18,
    meshUplink: 'FIBER_OPTIK',
    aiModelVersion: 'GarudaBrain-Edge v3.2.1-Strait',
    activeSensors: 19
  },
  {
    id: 'NODE-03',
    name: 'Edge Node Miangas',
    code: 'GDS-EDGE-MNG',
    location: 'Pulau Miangas, Sulawesi Utara',
    coordinates: [5.55, 126.58],
    status: 'NOMINAL',
    role: 'Perbatasan Utara Pasifik / Filipina & Early Warning Lintas Batas',
    coverageRadiusKm: 350,
    localLatencyMs: 22,
    meshUplink: 'SATELIT_LEO',
    aiModelVersion: 'GarudaBrain-Edge v3.2.1-Pacific',
    activeSensors: 16
  },
  {
    id: 'NODE-04',
    name: 'Edge Node Merauke',
    code: 'GDS-EDGE-MRK',
    location: 'Merauke, Papua Selatan',
    coordinates: [-8.49, 140.40],
    status: 'NOMINAL',
    role: 'Pengawasan Laut Arafura (WPPNRI 718) & Perbatasan Darat PNG',
    coverageRadiusKm: 450,
    localLatencyMs: 25,
    meshUplink: 'SATELIT_LEO',
    aiModelVersion: 'GarudaBrain-Edge v3.2.1-Arafura',
    activeSensors: 21
  },
  {
    id: 'NODE-05',
    name: 'Edge Node Rote Ndao',
    code: 'GDS-EDGE-RTE',
    location: 'Pulau Rote, NTT',
    coordinates: [-10.73, 123.12],
    status: 'NOMINAL',
    role: 'Front Samudera Hindia & Celah Timor (People Smuggling & IUU)',
    coverageRadiusKm: 390,
    localLatencyMs: 20,
    meshUplink: 'SATELIT_LEO',
    aiModelVersion: 'GarudaBrain-Edge v3.2.1-Oceanic',
    activeSensors: 14
  },
  {
    id: 'NODE-06',
    name: 'Edge Node Mobile KRI REM-331',
    code: 'GDS-EDGE-REM',
    location: 'Armada Taktis Laut Jawa / ALKI II',
    coordinates: [-3.20, 116.80],
    status: 'NOMINAL',
    role: 'Mobile Naval Command Node & Combat Management System Sync',
    coverageRadiusKm: 280,
    localLatencyMs: 12,
    meshUplink: 'HF_TACTICAL_RADIO',
    aiModelVersion: 'GarudaBrain-Edge v3.2.1-Naval',
    activeSensors: 32
  },
  {
    id: 'NODE-07',
    name: 'Edge Node Kosekhanudnas I Jakarta',
    code: 'GDS-EDGE-JKT',
    location: 'Halim Perdanakusuma, Jakarta',
    coordinates: [-6.26, 106.89],
    status: 'NOMINAL',
    role: 'Central High-Performance Neural Brain Cluster & Multi-Agency Gateway',
    coverageRadiusKm: 600,
    localLatencyMs: 4,
    meshUplink: 'FIBER_OPTIK',
    aiModelVersion: 'GarudaBrain-Core Cluster v3.8.0',
    activeSensors: 88
  }
];

export const CROSS_DOMAIN_CORRELATIONS: CrossDomainCorrelation[] = [
  {
    id: 'CORR-01',
    title: 'Korelasi Pembalakan Liar -> Kerentanan Karhutla Gambut (Kalimantan Barat)',
    primaryDomain: 'illegal_logging',
    secondaryDomain: 'karhutla',
    incidentIds: ['INC-LOG-01', 'INC-FIR-01'],
    confidence: 96.2,
    compoundRisk: 'KRITIS',
    narrative: 'AI mendeteksi pembukaan koridor jalan logging ilegal di TN Bukit Baka Bukit Raya menyebabkan kanalisasi drainase air gambut secara masif. Tanah gambut yang mengering memicu percepatan titik panas (hotspot FRP > 85 MW) di Kubu Raya dalam radius 120 km. Asap berisiko menutup koridor penerbangan internasional Pontianak-Kuching.',
    synergisticIntervention: 'Satgas Terpadu Gakkum KLHK & Manggala Agni diarahkan melakukan penutupan kanal (canal blocking) secara bersamaan dengan pemadaman udara water bombing.'
  },
  {
    id: 'CORR-02',
    title: 'Operasi Samaran Maritim: Dark Vessel IUU Natuna + Gangguan Siber AIS',
    primaryDomain: 'illegal_fishing',
    secondaryDomain: 'cyber_defense',
    incidentIds: ['INC-IUU-01', 'INC-CYB-01'],
    confidence: 94.7,
    compoundRisk: 'KRITIS',
    narrative: 'Kemunculan flotila dark vessel trawler asing di Natuna terjadi serentak dengan serangan denial-of-service (DDoS) dan sinyal spoofing pada stasiun pemantau navigasi AIS Selat Malaka-Natuna. Analisis sinyal Garuda Brain membuktikan ini adalah taktik pengalihan perhatian (hybrid distraction maneuver) untuk meloloskan armada penangkap ikan tanpa terdeteksi.',
    synergisticIntervention: 'BSSN mengaktifkan filtering satelit militer terenkripsi sementara KRI Bung Tomo-357 dikerahkan langsung berdasarkan koordinat SAR Sentinel-1 tanpa mengandalkan AIS komersial.'
  },
  {
    id: 'CORR-03',
    title: 'Jalur Log Gelap Pesisir Selat Malaka Digunakan Sebagai Rute Narkotika',
    primaryDomain: 'illegal_logging',
    secondaryDomain: 'narcotics_border',
    incidentIds: ['INC-LOG-02', 'INC-NAR-01'],
    confidence: 91.5,
    compoundRisk: 'TINGGI',
    narrative: 'Kanal bukaan liar hutan bakau di pesisir Bengkalis-Asahan diidentifikasi berfungsi ganda sebagai jalur tikus pendaratan speedboat penyelundup sabu transnasional. Cukong kayu dan jaringan kartel berbagi dermaga rahasia yang sama.',
    synergisticIntervention: 'Operasi gabungan TNI AL Lanal TBA + Ditpolairud dan BNN menyisir muara kanal bakau secara simultan untuk memotong rantai logistik kayu dan narkotika sekaligus.'
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'SCENARIO-01',
    title: 'Krisis Maritim Gabungan Natuna Utara',
    codename: 'GARUDA JALASENA-XXVI',
    category: 'Multi-Domain Kedaulatan Laut & Pertahanan Udara',
    threatLevel: 'CRITICAL',
    brief: 'Simulasi intrusi simultan 4 kapal penangkap ikan asing tanpa AIS (dark vessel) di Laut Natuna Utara didukung provokasi pesawat intai asing di ADIZ Sektor I dan serangan siber DDoS ke radar pantai.',
    incidentIds: ['INC-IUU-01', 'INC-AIR-01', 'INC-CYB-01'],
    keyInsight: 'Garuda Brain membuktikan efektivitas sensor fusion radar militer + citra SAR satelit + AI Edge Ranai yang tetap mampu melacak sasaran meski AIS dipadamkan dan stasiun sipil diganggu.'
  },
  {
    id: 'SCENARIO-02',
    title: 'Bencana Ekologis Jantung Borneo',
    codename: 'GARUDA WANASETA-IV',
    category: 'Lingkungan, Pembalakan Liar & Karhutla',
    threatLevel: 'HIGH',
    brief: 'Simulasi deteksi dini sindikat pembalakan liar bersenjata alat berat di Taman Nasional Bukit Baka Bukit Raya yang memicu kebakaran lahan gambut lintas batas.',
    incidentIds: ['INC-LOG-01', 'INC-FIR-01', 'INC-RES-01'],
    keyInsight: 'Deteksi real-time SAR radar menghemat waktu pelaporan dari yang sebelumnya 14 hari menjadi 15 menit, mencegah hilangnya tutupan kanopi seluas 500 Ha senilai Rp 300 Miliar.'
  },
  {
    id: 'SCENARIO-03',
    title: 'Pencegatan Hibrida Pesisir Selat Malaka',
    codename: 'GARUDA SATYA-MALAKA',
    category: 'Transnational Crime & Keamanan Jalur ALKI I',
    threatLevel: 'CRITICAL',
    brief: 'Simulasi penyusupan speedboat berkecepatan tinggi penyelundup narkotika memanfaatkan kanal liar hutan mangrove dan pengaburan sinyal navigasi maritim.',
    incidentIds: ['INC-NAR-01', 'INC-LOG-02'],
    keyInsight: 'Korelasi lintas instansi (BNN + TNI AL + Gakkum KLHK) menghasilkan waktu tanggap (response time) 18 menit, memotong jalur tikus sebelum barang haram mendarat.'
  },
  {
    id: 'SCENARIO-04',
    title: 'Mitigasi Bencana Megathrust & Resiliensi Edge Komunikasi',
    codename: 'GARUDA TANGGUH-SUNDA',
    category: 'Bencana Geodinamika & Resiliensi Infrastruktur',
    threatLevel: 'HIGH',
    brief: 'Simulasi gempa M 7.1 Selat Sunda dengan kabel optik bawah laut putus, mendemonstrasikan sistem failover otomatis ke Archipelagic Edge Nodes dan satelit LEO tanpa blackout sistem komando.',
    incidentIds: ['INC-DIS-01'],
    keyInsight: 'Arsitektur terdistribusi GDS menjamin peringatan dini tsunami dan perintah evakuasi tetap terkirim ke masyarakat dalam tempo kurang dari 3 menit saat jaringan pusat offline.'
  }
];
