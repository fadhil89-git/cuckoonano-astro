import fs from 'node:fs';
import { locationStates } from '../src/data/locations.js';

const specificAreas = {
  'ayer-hitam': ['Taman Ayer Hitam', 'Kampung Baru Ayer Hitam', 'Jalan Kluang', 'Pusat Bandar Ayer Hitam'],
  'batu-pahat': ['Taman Banang', 'Taman Maju', 'Taman Bukit Pasir', 'Taman Sri Jaya', 'Taman Universiti', 'Peserai', 'Parit Besar', 'Jalan Kluang Batu Pahat'],
  'johor-bahru': ['Taman Pelangi', 'Taman Century', 'Taman Sentosa', 'Kebun Teh', 'Majidee', 'Pelangi Indah', 'Adda Heights', 'Austin Heights', 'Nusa Bestari', 'Taman Johor Jaya'],
  'iskandar-puteri': ['Taman Nusa Idaman', 'Taman Nusa Bayu', 'Taman Nusa Perintis', 'Sunway Iskandar', 'Leisure Farm', 'Gerbang Nusajaya'],
  'kluang': ['Taman Sri Kluang', 'Taman Kluang Perdana', 'Taman Kluang Indah', 'Kampung Melayu Kluang', 'Jalan Mersing', 'Taman Delima'],
  'kota-tinggi': ['Taman Kota Jaya', 'Taman Mawai', 'Jalan Niaga Utama', 'Taman Sri Saujana', 'Taman Daiman Jaya'],
  'kulai': ['Bandar Putra Kulai', 'Taman Muhibbah', 'Taman Desa Baiduri', 'Taman Kulai Besar', 'Taman Sri Kulai Baru', 'Taman Scientex Kulai'],
  'muar': ['Taman Sri Tanjung', 'Taman Sri Maharani', 'Parit Bakar', 'Jalan Bakri', 'Jalan Salleh', 'Sungai Terap'],
  'pasir-gudang': ['Taman Kota Masai', 'Taman Scientex', 'Taman Cendana', 'Taman Mawar', 'Taman Bukit Dahlia', 'Taman Nusa Damai'],
  'skudai': ['Taman Sri Pulai', 'Taman Universiti Indah', 'Taman Teratai', 'Taman Impian Skudai', 'Taman Desa Skudai', 'Tun Aminah'],

  ampang: ['Ampang Point', 'Taman Melawati', 'Taman Cempaka', 'Pandan Jaya', 'Ampang Hilir', 'Jelatek', 'Lembah Jaya', 'Taman Nirwana'],
  bangi: ['Seksyen 2 Bangi', 'Seksyen 5 Bangi', 'Seksyen 6 Bangi', 'Seksyen 16 Bangi', 'Bangi Gateway', 'Bangi Lama', 'Teraskota', 'Bandar Seri Putra'],
  kajang: ['Taman Bukit Mewah', 'Taman Sri Langat', 'Taman Prima Saujana', 'Kajang 2', 'Bandar Teknologi Kajang', 'Taman Kantan Permai', 'Country Heights Kajang'],
  klang: ['Taman Berkeley', 'Taman Eng Ann', 'Taman Chi Liung', 'Bandar Bukit Raja', 'Taman Klang Utama', 'Kampung Jawa Klang', 'Taman Palm Grove', 'Bandar Parklands'],
  'kota-damansara': ['Seksyen 3 Kota Damansara', 'Seksyen 13 Kota Damansara', 'Seksyen 14 Kota Damansara', 'Dataran Sunway', 'Tropicana Gardens', 'PJU 5', 'PJU 6'],
  'petaling-jaya': ['Seksyen 5 PJ', 'Seksyen 6 PJ', 'Seksyen 8 PJ', 'Seksyen 13 PJ', 'Seksyen 16 PJ', 'Taman Paramount', 'Taman SEA', 'Kampung Tunku', 'Tropicana', 'PJS'],
  puchong: ['Puchong Prima', 'Taman Meranti Jaya', 'Taman Puchong Tekali', 'Taman Perindustrian Puchong', 'IOI Boulevard', 'Puchong South', '16 Sierra'],
  rawang: ['Rawang Perdana', 'Taman Desa Mas', 'Bandar Tasik Puteri', 'M Residence', 'Emerald Rawang', 'Saujana Rawang', 'Taman Pelangi Rawang'],
  'setia-alam': ['Apartmen Seri Baiduri', 'Setia Avenue', 'Setia Utama', 'Setia Perdana', 'Setia Indah', 'Alam Nusantara Setia Alam'],
  'shah-alam': ['Seksyen 3', 'Seksyen 4', 'Seksyen 11', 'Seksyen 16', 'Seksyen 17', 'Seksyen 18', 'Seksyen 20', 'Seksyen 25', 'Seksyen 27', 'Seksyen 28', 'Seksyen 30', 'Seksyen 31', 'Seksyen 32', 'Seksyen 33', 'U5', 'U9', 'U12'],
  'subang-jaya': ['SS15 Courtyard', 'Subang Jaya Medical Centre area', 'Taipan USJ', 'USJ 5', 'USJ 13', 'USJ 17', 'USJ 23', 'Putra Avenue'],
  semenyih: ['Taman Semenyih Mewah', 'Taman Semenyih Indah', 'Semenyih Parklands', 'Bandar Rinching', 'Kesuma Lakes', 'Kajang East'],
  sepang: ['Bandar Baru Salak Tinggi', 'Sungai Merab', 'Taman Seroja', 'Taman Dahlia', 'Sepang Putra', 'KLIA2 area'],
  'seri-kembangan': ['Taman Serdang Raya', 'Taman Sri Serdang', 'Bukit Jalil Golf area', 'South City', 'One South', 'Taman Pinggiran Putra'],
  'sungai-buloh': ['Bandar Baru Sungai Buloh Seksyen U20', 'Saujana Utama', 'Taman Saujana Akasia', 'Sierramas', 'Valencia', 'Hospital Sungai Buloh area'],

  bangsar: ['Bangsar Park', 'Bukit Bandaraya', 'Lucky Garden', 'Jalan Maarof', 'Taman SA', 'Telawi'],
  brickfields: ['Tun Sambanthan', 'Bangsar Utama', 'KL Eco City', 'Scott Garden area', 'Jalan Thambipillay'],
  'bukit-bintang': ['Jalan Sultan Ismail', 'Jalan Bukit Bintang', 'Berjaya Times Square', 'Tung Shin area', 'Raja Chulan', 'Jalan Pudu'],
  'bukit-jalil': ['Arena Green', 'Jalil Damai', 'Jalil Sutera', 'The Park Sky Residence', 'Bukit OUG', 'Muhibbah'],
  'cheras-kl': ['Taman Taynton View', 'Taman Yulek', 'Taman Len Seng', 'Taman Supreme', 'Taman Bukit Cheras', 'Bandar Sri Permaisuri'],
  kepong: ['Bandar Menjalara', 'Taman Kepong', 'Kepong Baru Tambahan', 'Taman Bukit Maluri', 'Taman Daya Kepong', 'FRIM area'],
  'old-klang-road': ['Taman Sri Sentosa', 'Taman United', 'Taman Shanghai', 'Taman Goodwood', 'Kampung Pasir', 'Jalan Klang Lama Batu 4'],
  sentul: ['Sentul Raya', 'Sentul Point', 'Bandar Baru Sentul', 'Sentul Boulevard', 'Kampung Chubadak', 'Taman Datuk Senu'],
  setapak: ['Taman Sri Rampai', 'Wangsa Melawati', 'PV area', 'Columbia Asia Setapak area', 'Taman Bunga Raya', 'Kampung Puah'],
  'wangsa-maju': ['Seksyen 6 Wangsa Maju', 'Seksyen 10 Wangsa Maju', 'Wangsa Walk', 'Sri Rampai', 'Wangsa Melawati', 'Desa Setapak'],

  putrajaya: ['Presint 3', 'Presint 4', 'Presint 6', 'Presint 7', 'Presint 10', 'Presint 16', 'Presint 18', 'Presint 19', 'Alamanda area'],

  seremban: ['Seremban 3', 'Seremban Jaya', 'Taman Bukit Chedang', 'Taman Permai', 'Taman Tuanku Jaafar', 'Kampung Baru Rahang', 'Forest Heights'],
  nilai: ['Nilai 3', 'Nilai Springs', 'Desa Cempaka', 'Taman Semarak', 'Taman Melati Nilai', 'Bandar Enstek'],
  'port-dickson': ['Batu 4 Port Dickson', 'Batu 6 Port Dickson', 'Batu 8 Port Dickson', 'Taman Politeknik', 'Bandar Sunggala', 'Bagan Pinang'],

  'melaka-tengah': ['Ayer Keroh', 'Bukit Katil', 'Bukit Serindit', 'Kota Laksamana', 'Melaka Raya', 'Bandar Hilir', 'Duyong', 'Padang Temu'],
  'ayer-keroh': ['Taman Tasik Utama', 'Taman Ayer Keroh Heights', 'Taman Bukit Beruang Utama', 'Taman Muzaffar Syah', 'Hang Tuah Jaya'],
  jasin: ['Taman Maju Jasin', 'Taman Merbau', 'Kesang Pajak', 'Rim', 'Selandar town area'],

  kuantan: ['Tok Sira', 'Bukit Pelindung', 'Tanjung Api', 'Tanjung Lumpur', 'Galing', 'Kota SAS', 'Bukit Rangin', 'Inderapura', 'Taman Selamat', 'Kubang Buaya', 'Alor Akar', 'Teluk Cempedak', 'Sungai Isap', 'Jalan Gambut', 'Bukit Setongkol', 'Permatang Badak', 'Paya Besar', 'Taman Cenderawasih', 'Taman Impianku', 'Taman Mahkota Aman', 'Pusat Bandar Kuantan'],
  bentong: ['Bentong Heights', 'Taman Bukit Indah Bentong', 'Ketari', 'Sungai Marong', 'Chamang', 'Perting'],
  temerloh: ['Taman Temerloh Jaya', 'Kampung Bangau', 'Tanjung Lalang', 'Sanggang', 'Seberang Temerloh', 'Mentakab Star Mall area'],
  pekan: ['Kampung Mengkasar', 'Taman Mentiga', 'Peramu Jaya', 'Pekan Lama', 'Kuala Pahang'],

  ipoh: ['Canning Garden', 'Taman Cempaka', 'Taman Ipoh Jaya', 'Taman Perpaduan', 'Taman Rapat Setia', 'Klebang', 'Bandar Baru Medan Ipoh', 'Station 18', 'Pengkalan', 'Buntong'],
  taiping: ['Tupai', 'Assam Kumbang', 'Taman Simpang', 'Taman Kamunting Jaya', 'Lake Garden area', 'Matang'],
  'teluk-intan': ['Taman Melor', 'Taman Cicely', 'Taman Intanova', 'Anson Bay', 'Jalan Maharajalela', 'Sungai Manik'],
  sitiawan: ['Taman Sejati', 'Taman Samudera', 'Taman Muhibbah Sitiawan', 'Setiawan Sentral', 'Pasir Panjang Laut'],
  manjung: ['Taman Manjung Point', 'Bandar Baru Seri Manjung', 'Lekir', 'Teluk Muroh', 'Sitiawan town area'],

  'george-town': ['Komtar area', 'Lebuh Chulia', 'Lebuh Kimberley', 'Persiaran Gurney', 'Kelawei', 'Batu Lanchang', 'Green Lane', 'Farlim'],
  'bayan-lepas': ['Bukit Jambul', 'Bayan Lepas Industrial Zone', 'Southbay', 'Sungai Tiram', 'Pantai Jerejak', 'Arena Curve'],
  'bukit-mertajam': ['Taman Alma Jaya', 'Taman Kota Permai', 'Taman Desa Damai', 'Berapit', 'Cherok Tok Kun', 'Icon City'],
  butterworth: ['Bagan Luar', 'Bagan Jermal', 'Taman Bagan', 'Mak Mandin', 'Taman Senangan', 'Kampung Gajah Butterworth'],

  'alor-setar': ['Taman PKNK', 'Taman Wira Mergong', 'Suka Menanti', 'Kampung Lubok Peringgi', 'Stadium Darul Aman area', 'City Plaza area'],
  'sungai-petani': ['Bandar Laguna Merbok', 'Cinta Sayang', 'Taman Sejati Indah', 'Taman Ria Jaya', 'Taman Keladi', 'Bakar Arang'],
  kulim: ['Taman Selasih', 'Taman Kenari', 'Taman Mutiara', 'Lunas town area', 'Kulim Square', 'Bandar Putra Kulim'],
  langkawi: ['Kuah Town', 'Ulu Melaka', 'Kedawang', 'Pantai Tengah', 'Datai area', 'Taman Nilam'],

  kangar: ['Taman Sena', 'Taman Kemajuan', 'Taman Sri Pulai', 'Pusat Bandar Kangar', 'Jalan Raja Syed Alwi', 'Kampung Behor Lateh'],
  arau: ['UiTM Arau', 'Jejawi', 'Guar Sanji', 'Kampung Kubang Gajah', 'Pekan Arau'],

  'kota-bharu': ['Wakaf Che Yeh', 'Taman Uda Murni', 'Telipot', 'Bunut Payong', 'Pintu Geng', 'Kota Lama', 'Panji', 'Lundang'],
  'pasir-mas': ['Kampung Gual Tinggi', 'Chetok', 'Kangkong', 'Bunut Susu', 'Tok Uban'],
  bachok: ['Tawang', 'Perupok', 'Melawi', 'Tanjung Jering', 'Repek'],

  'kuala-terengganu': ['Batu Buruk', 'Losong', 'Bukit Besar', 'Kuala Ibai', 'Manir', 'Wakaf Mempelam', 'Pulau Duyong', 'Cabang Tiga'],
  'kuala-nerus': ['Wakaf Tembesu', 'Bukit Tunggal', 'Tepoh', 'Mengabang Telipot', 'Gong Pak Jin'],
  kemaman: ['Binjai', 'Mak Chili', 'Bukit Kuang', 'Geliga', 'Kampung Fikri', 'Cukai Utama'],
  dungun: ['Sura Gate', 'Sura Tengah', 'Balai Besar', 'Rantau Abang', 'Bukit Besi'],

  'kota-kinabalu': ['Api-Api Centre', 'Sembulan', 'Damai Luyang', 'Foh Sang', 'Taman Kingfisher', 'Sepanggar', 'Alamesra', 'Putatan town area'],
  sandakan: ['Bandar Indah', 'Taman Mawar Sandakan', 'Taman Sejati Ujana', 'Mile 8', 'Mile 12', 'Taman Merpati'],
  tawau: ['Taman Megah Jaya', 'Kuhara', 'Tanjung Batu', 'Sabindo', 'Taman Semarak Tawau', 'Apas'],
  penampang: ['Kobusak', 'Kampung Hungab', 'Beverly Hills Penampang', 'Kepayan Ridge', 'Lido'],

  kuching: ['Satok', 'Batu Lintang', 'BDC', 'Tabuan Desa', 'Stampin', 'Pending', 'Stutong', 'Samarahan Expressway area'],
  miri: ['Pelita Commercial Centre', 'Miri Waterfront', 'Taman Tunku', 'Riam', 'Taman Jelita', 'Luak Bay', 'Marina ParkCity'],
  bintulu: ['Medan Jaya', 'Taman Jason', 'Tanjung Batu Bintulu', 'Kemena', 'Assyakirin', 'Kidurong Heights'],
  sibu: ['Rejang Park', 'Salim', 'Taman Permai Sibu', 'Ulu Sungai Merah', 'Sibu Jaya', 'Kampung Nangka'],
  labuan: ['Kampung Patau-Patau', 'Batu Arang Labuan', 'Lajau', 'Sungai Bedaun', 'Taman Mutiara Labuan', 'Taman Perumahan Membedai'],
};

const auditedLargeAreas = {
  mersing: ['Taman Mersing Kanan', 'Taman Wawasan Mersing', 'Jemaluang', 'Endau', 'Penyabong', 'Pulau Sibu jetty area'],
  pontian: ['Pontian Besar', 'Pontian Kecil', 'Ayer Baloi', 'Benut', 'Rambah', 'Pekan Nanas'],
  segamat: ['Bandar Utama Segamat', 'Taman Yayasan', 'Buloh Kasap', 'Jementah', 'Batu Anam', 'Genuang'],
  tangkak: ['Taman Tangkak Jaya', 'Taman Sentosa Tangkak', 'Sagil', 'Bukit Gambir', 'Grisek', 'Kesang'],

  balakong: ['Taman Balakong Jaya', 'Taman Impian Ehsan', 'Taman Cheras Jaya', 'Kawasan Perindustrian Balakong', 'The Mines', 'Jalan Balakong'],
  banting: ['Taman Banting Baru', 'Taman Seri Putra Banting', 'Kanchong Darat', 'Jugra', 'Telok Datok', 'Sungai Manggis'],
  'batang-kali': ['Taman Batang Kali', 'Bukit Beruntung', 'Bukit Sentosa', 'Rasa', 'Ulu Yam Bharu', 'Kampung Kuantan Batang Kali'],
  'batu-caves': ['Taman Sri Gombak', 'Taman Selayang Baru', 'Taman Samudra', 'Bandar Baru Selayang', 'Kampung Nakhoda', 'Sri Batu Caves'],
  'damansara-damai': ['Damansara Damai Apartment', 'Idaman Apartment', 'Armanee Terrace', 'Perdana Exclusive', 'Jalan PJU 10/1', 'Jalan PJU 10/3'],
  'damansara-jaya': ['SS22', 'Atria area', 'Jalan SS22/23', 'Jalan SS22/25', 'Taman Megah', 'Damansara Kim'],
  'damansara-perdana': ['Metropolitan Square', 'Ritze Perdana', 'Empire Damansara', 'Perdana View', 'Flora Damansara', 'Neo Damansara'],
  'damansara-utama': ['Uptown Damansara', 'SS21', 'Jalan SS21/1A', 'Jalan SS21/37', 'Starling Mall area', 'Taman Tun Dr Ismail border'],
  'denai-alam': ['Jalan Elektron', 'Jalan Metafasa', 'Jalan U16/50', 'Denai Alam Rimbun', 'Alam Suria', 'Elmina Green'],
  dengkil: ['Taman Dengkil Jaya', 'Taman Baiduri Dengkil', 'Jenderam Hilir', 'Jenderam Hulu', 'Kampung Dato Abu Bakar Baginda', 'Putrajaya Precinct 14 border'],
  'gamuda-gardens': ['Valeria Garden Homes', 'Monarc Gamuda Gardens', 'Jade Hills Gardens', 'Gaia Residences', 'Waterlily Gamuda Gardens', 'Kundang Jaya'],
  glenmarie: ['Temasya Glenmarie', 'Hicom Glenmarie', 'U1 Shah Alam', 'Glenmarie Cove', 'Utropolis Glenmarie', 'Jalan Jurunilai U1'],
  gombak: ['Taman Greenwood', 'Taman Melati', 'Gombak Setia', 'Batu 8 Gombak', 'UIA Gombak area', 'Sungai Pusu'],
  'hulu-selangor': ['Kuala Kubu Bharu', 'Bukit Beruntung', 'Bukit Sentosa', 'Serendah', 'Rasa', 'Kerling'],
  kapar: ['Pekan Kapar', 'Meru Klang', 'Bukit Kapar', 'Tok Muda', 'Sementa', 'Rantau Panjang Klang'],
  'kota-warisan': ['Warisan Puteri', 'Warisan Indah', 'Taman Seroja', 'Taman Mawar Salak Tinggi', 'KIP Mall Kota Warisan area', 'Bandar Baru Salak Tinggi'],
  'kuala-selangor': ['Pasir Penambang', 'Bukit Melawati', 'Bandar Malawati', 'Taman Bendahara', 'Tanjong Karang', 'Ijok'],
  'port-klang': ['Pandamaran', 'Pulau Indah', 'Telok Gong', 'Bandar Sultan Suleiman', 'Kampung Raja Uda', 'Northport area'],
  selayang: ['Selayang Baru', 'Selayang Jaya', 'Taman Selayang Utama', 'Taman Selayang Mulia', 'Selayang Heights', 'Pasar Borong Selayang area'],
  'telok-panglima-garang': ['Taman Dato Hormat', 'Kampung Medan', 'Kampung Jenjarom', 'Kampung Kebun Baru', 'Bandar Rimbayu', 'Eco Sanctuary'],

  'damansara-heights': ['Jalan Beringin', 'Jalan Setiabakti', 'Jalan Damanlela', 'Plaza Damansara', 'Bukit Damansara', 'Semantan'],
  'desa-pandan': ['Jalan Kampung Pandan', 'Taman Nirwana', 'Ampang Hilir', 'Pandan Jaya', 'Taman Cempaka', 'Cochrane border'],
  'desa-petaling': ['Taman Castlefield', 'Kuchai Lama border', 'Salak Selatan Baru', 'Bandar Tasik Selatan', 'Jalan 1/125', 'Sri Petaling border'],
  'jalan-ipoh': ['Sentul West', 'Batu 3 Jalan Ipoh', 'Batu 4 Jalan Ipoh', 'Taman Million', 'Kampung Batu', 'Segambut border'],
  klcc: ['Jalan Ampang', 'Jalan P Ramlee', 'Persiaran KLCC', 'Kampung Baru border', 'Lorong Kuda', 'Binjai area'],
  'kampung-baru': ['Jalan Raja Muda Musa', 'Jalan Raja Abdullah', 'Chow Kit', 'Kampung Baru LRT area', 'Titiwangsa border', 'Jalan Tun Razak border'],
  keramat: ['Dato Keramat', 'Taman Keramat', 'Jelatek', 'Setiawangsa', 'AU1 Keramat', 'AU2 Keramat'],
  'kuchai-lama': ['Kuchai Entrepreneurs Park', 'Taman Gembira', 'Kuchai Avenue', 'Jalan Kuchai Lama', 'Taman Lian Hoe', 'Happy Garden'],
  'mont-kiara': ['Solaris Mont Kiara', 'Arcoris', 'Kiara 163', 'Desa Sri Hartamas', 'Verve Suites area', 'Jalan Kiara'],
  oug: ['Taman OUG', 'Happy Garden', 'Jalan Hujan Rahmat', 'Jalan Awan Besar', 'Bukit Jalil border', 'Sri Petaling border'],
  pudu: ['Jalan Pudu', 'Pudu Ulu', 'Chan Sow Lin', 'Taman Miharja', 'Cochrane', 'Imbi border'],
  segambut: ['Segambut Dalam', 'Segambut Luar', 'Sri Sinar', 'Dutamas', 'Jalan Duta', 'Taman Kok Doh'],
  'sri-petaling': ['Bandar Baru Sri Petaling', 'Endah Parade area', 'Jalan Radin Anum', 'Jalan Radin Bagus', 'Bukit Jalil border', 'Happy Garden'],
  ttdi: ['Jalan Burhanuddin Helmi', 'Jalan Aminuddin Baki', 'Jalan Leong Yew Koh', 'Kiara Park', 'Zaaba area', 'Damansara Kim border'],
  'taman-desa': ['Jalan Desa Bakti', 'Jalan Desa Utama', 'Faber Towers area', 'Danau Desa', 'Seputeh border', 'Old Klang Road border'],
  titiwangsa: ['Tasik Titiwangsa', 'Pekeliling', 'Jalan Pahang', 'Chow Kit border', 'Kampung Baru border', 'Sentul border'],
  'salak-selatan': ['Salak South Garden', 'Bandar Tasik Selatan', 'Kuchai Lama border', 'Sungai Besi border', 'Taman Salak Selatan', 'Sri Petaling border'],
  seputeh: ['Mid Valley area', 'Taman Seputeh', 'Taman Desa border', 'Bangsar South border', 'Jalan Syed Putra', 'Robson Heights'],
  setiawangsa: ['Bukit Setiawangsa', 'Jalan Setiawangsa 11', 'Jalan Setiawangsa 13', 'AU Keramat border', 'Wangsa Maju border', 'Jelatek border'],
  'sungai-besi': ['Bandar Tasik Selatan', 'Taman Sungai Besi', 'Desa Tun Razak', 'Terminal Bersepadu Selatan area', 'Salak Selatan border', 'Serdang Raya border'],
  'taman-maluri': ['Jalan Jejaka', 'Sunway Velocity area', 'Cochrane border', 'Pandan Jaya border', 'Taman Pertama', 'Jalan Peel'],

  rembau: ['Pekan Rembau', 'Pedas', 'Chembong', 'Kota Rembau', 'Tanjung Kling Rembau', 'Chengkau'],
  tampin: ['Bandar Tampin', 'Gemencheh', 'Repah', 'Pulau Sebang', 'Ayer Kuning', 'Taman Clonlee'],
  sendayan: ['Bandar Sri Sendayan', 'Matrix Global Schools area', 'Suriaman', 'Hijayu', 'Ara Sendayan', 'Seremban 2 border'],
  jelebu: ['Kuala Klawang', 'Titi', 'Pertang', 'Simpang Pertang', 'Petaling Jelebu', 'Gelang Terusan'],
  jempol: ['Bahau', 'Bandar Seri Jempol', 'Serting', 'Rompin Negeri Sembilan', 'Batu Kikir', 'Mahsan'],
  'kuala-pilah': ['Juasseh', 'Seri Menanti', 'Tanjung Ipoh', 'Dangi', 'Parit Tinggi', 'Ampang Tinggi'],
  'alor-gajah': ['Kelemak', 'Pulau Sebang', 'Durian Tunggal', 'Rembia', 'Simpang Ampat Melaka', 'Taman Seri Bayu'],
  'masjid-tanah': ['Tanjung Bidara', 'Lubok China', 'Sungai Udang', 'Pengkalan Balak', 'Kuala Sungai Baru', 'Ayer Limau'],
  merlimau: ['Pekan Merlimau', 'Merlimau Utara', 'Serkam', 'Sempang', 'Sebatu', 'Umbai'],

  'cameron-highlands': ['Tanah Rata', 'Brinchang', 'Ringlet', 'Kea Farm', 'Tringkap', 'Kuala Terla'],
  bera: ['Triang', 'Teriang', 'Kemayan', 'Mengkarak', 'Kerayong', 'Bandar 32 Bera'],
  jerantut: ['Taman Jerantut Jaya', 'Taman Wawasan Jerantut', 'Kuala Tembeling', 'Temin', 'Damai Jerantut', 'Padang Piol'],
  lipis: ['Benta', 'Padang Tengku', 'Chegar Perah', 'Mela', 'Merapoh', 'Tanjung Lipis'],
  maran: ['Pusat Bandar Maran', 'Chenor', 'Jengka', 'Sri Jaya', 'Luit', 'Kampung Awah'],
  mentakab: ['Taman Saga Mentakab', 'Taman Bukit Bendera', 'Taman Rimba', 'Taman Mentakab Indah', 'Jalan Temerloh Mentakab', 'Mentakab town area'],
  raub: ['Taman Raub Jaya', 'Bandar Raub Perdana', 'Sungai Ruan', 'Cheroh', 'Sega', 'Tras'],
  rompin: ['Kuala Rompin', 'Muadzam Shah', 'Tioman', 'Endau Rompin', 'Bandar Tun Razak Rompin', 'Tanjung Gemok'],

  'bagan-serai': ['Simpang Empat Semanggol', 'Alor Pongsu', 'Gunung Semanggol', 'Selinsing', 'Taman Serai Jaya', 'Parit Buntar border'],
  'batu-gajah': ['Pusing', 'Tronoh', 'Siputeh', 'Taman Batu Gajah Perdana', 'Kinta Valley area', 'Tanjung Tualang'],
  gerik: ['Pengkalan Hulu', 'Lenggong border', 'Banding', 'Temengor', 'Kerunai', 'Kampung Padang Gerik'],
  kampar: ['Bandar Baru Kampar', 'Taman Kampar Jaya', 'Taman Bandar Baru', 'Mambang Diawan', 'Malim Nawar', 'UTAR Kampar area'],
  'kuala-kangsar': ['Bukit Chandan', 'Sayong', 'Manong', 'Sauk', 'Talang', 'Jalan Taiping Kuala Kangsar'],
  lenggong: ['Kota Tampan', 'Kampung Sumpitan', 'Temelong', 'Kuak', 'Sauk border', 'Lenggong town area'],
  lumut: ['Teluk Batik', 'Marina Island', 'Pangkor jetty area', 'Manjung border', 'Sitiawan border', 'Taman Lumut Indah'],
  'parit-buntar': ['Tanjung Piandang', 'Kuala Kurau', 'Bagan Tiang', 'Simpang Lima Parit Buntar', 'Nibong Tebal border', 'Taman Kerian Permai'],
  'seri-iskandar': ['Bandar Seri Iskandar', 'Tronoh', 'Bota', 'Universiti Teknologi PETRONAS area', 'Taman Maju Seri Iskandar', 'Taman Iskandar Perdana'],
  'slim-river': ['Behrang', 'Trolak', 'Sungkai', 'Slim Village', 'Proton City border', 'Taman Slim Permai'],
  'sungai-siput': ['Jalong', 'Lintang', 'Kati', 'Karai', 'Taman Muhibbah Sungai Siput', 'Chemor border'],
  'tanjung-malim': ['Proton City', 'Behrang 2020', 'Taman Universiti', 'Ulu Bernam', 'Slim River border', 'Taman Ketoyong'],
  tapah: ['Tapah Road', 'Bidor', 'Chenderiang', 'Temoh', 'Ayer Kuning Perak', 'Taman Tapah Indah'],

  'balik-pulau': ['Teluk Bahang', 'Pulau Betong', 'Sungai Rusa', 'Pondok Upeh', 'Kongsi Balik Pulau', 'Air Putih'],
  'kepala-batas': ['Bertam', 'Penaga', 'Tasek Gelugor', 'Paya Keladi', 'Lahar Yooi', 'Pongsu Seribu'],
  'nibong-tebal': ['Sungai Bakap', 'Jawi', 'Valdor', 'Simpang Ampat Penang', 'Taman Pekaka Nibong Tebal', 'Parit Buntar border'],
  perai: ['Chai Leng Park', 'Taman Inderawasih', 'Perai Industrial Estate', 'Megamall Pinang area', 'Seberang Jaya border', 'Juru border'],
  'permatang-pauh': ['Kubang Semang', 'Pauh Jaya', 'Bukit Mertajam border', 'Seberang Jaya border', 'Penanti', 'Taman Pauh'],
  'seberang-jaya': ['Sunway Carnival area', 'Taman Sembilang', 'Taman Pauh Jaya', 'Hospital Seberang Jaya area', 'Perai border', 'Permatang Pauh border'],

  gurun: ['Guar Chempedak', 'Bedong', 'Taman Gurun Jaya', 'Jeniang border', 'Sungai Petani border', 'Kawasan Industri Gurun'],
  jitra: ['Taman Tunku Sarina', 'Taman Mahsuri', 'Kepala Batas Kedah', 'Changlun', 'Kodiang', 'Bukit Kayu Hitam'],
  'kuala-nerang': ['Padang Terap', 'Naka', 'Pedu', 'Kampung Barokhas', 'Pekan Kuala Nerang', 'Belimbing Kanan'],
  'kubang-pasu': ['Jitra', 'Changlun', 'Kodiang', 'Bukit Kayu Hitam', 'Sintok', 'Ayer Hitam Kedah'],
  pendang: ['Tobiar', 'Kobah', 'Tanah Merah Kedah', 'Bukit Raya Pendang', 'Pekan Pendang', 'Guar Kepayang'],
  sik: ['Jeniang', 'Gulau', 'Batu Lima Sik', 'Sungai Pau', 'Kampung Tupai Sik', 'Pekan Sik'],
  baling: ['Kupang', 'Kuala Ketil', 'Tawar', 'Bongor', 'Pulai Baling', 'Kampung Lalang Baling'],
  yan: ['Guar Chempedak', 'Gurun', 'Sungai Limau', 'Dulang', 'Singkir', 'Titi Hayun'],

  'kuala-perlis': ['Simpang Empat Perlis', 'Pekan Kuala Perlis', 'Kampung Seberang Ramai', 'Kampung Wai', 'Kangar border', 'Kurong Tengar'],
  'padang-besar': ['Beseri', 'Chuping', 'Kaki Bukit', 'Titi Tinggi', 'Wang Kelian', 'Taman Padang Besar'],

  'gua-musang': ['Bandar Baru Gua Musang', 'Bertam Kelantan', 'Chiku', 'Limau Kasturi', 'Paloh Gua Musang', 'Rantau Manis'],
  jeli: ['Ayer Lanas', 'Kuala Balah', 'Bukit Bunga', 'Dabong border', 'Kampung Gemang', 'Pekan Jeli'],
  'kuala-krai': ['Manek Urai', 'Dabong', 'Pahi', 'Telekong', 'Mengkebang', 'Guchil'],
  machang: ['Pulau Chondong', 'Temangan', 'Labu Machang', 'Pangkal Meleret', 'Hamzah Machang', 'Tok Bok'],
  'pasir-puteh': ['Tok Bali', 'Semerak', 'Cherang Ruku', 'Bukit Jawa', 'Selising', 'Padang Pak Amat'],
  'tanah-merah': ['Bukit Panau', 'Jedok', 'Kusial', 'Gual Ipoh', 'Batang Merbau', 'Kemahang'],
  tumpat: ['Wakaf Bharu', 'Pengkalan Kubor', 'Chabang Empat', 'Kok Keli', 'Kampung Laut', 'Geting'],

  besut: ['Jerteh', 'Kampung Raja', 'Kuala Besut', 'Bukit Keluang', 'Pasir Akar', 'Tembila'],
  'hulu-terengganu': ['Kuala Berang', 'Ajil', 'Telemong', 'Wakaf Tapai border', 'Pengkalan Ajal', 'Kampung Gaung'],
  kerteh: ['Paka', 'Kemasik', 'Kerteh Industrial Area', 'Rantau Petronas', 'Santong', 'Kampung Baru Kerteh'],
  marang: ['Bukit Payong', 'Wakaf Tapai', 'Rusila', 'Pulau Kerengga', 'Merchang', 'Seberang Marang'],
  setiu: ['Bandar Permaisuri', 'Penarik', 'Merang', 'Chalok', 'Sungai Tong', 'Guntung'],

  beaufort: ['Membakut', 'Weston', 'Klias', 'Gadong Beaufort', 'Lumat Beaufort', 'Pekan Beaufort'],
  keningau: ['Apin-Apin', 'Bingkor', 'Sook', 'Taman Bandukan', 'Taman Fajar Keningau', 'Pekan Keningau'],
  'kota-belud': ['Tempasuk', 'Kuala Abai', 'Kampung Siasai', 'Kampung Pirasan', 'Usukan', 'Taginambur'],
  'kota-marudu': ['Tandek', 'Langkon', 'Bandau', 'Goshen', 'Pitas border', 'Kampung Popok'],
  kudat: ['Matunggong', 'Sikuati', 'Tanjung Kapor', 'Tomborungus', 'Karakit border', 'Kudat town area'],
  'lahad-datu': ['Silam', 'Segama', 'Taman Aman Jaya', 'Taman Warisan', 'Bandar Sri Perdana', 'Fajar Centre'],
  papar: ['Kinarut', 'Kimani', 'Benoni', 'Lok Kawi', 'Pengalat', 'Taman Pantai Lok Kawi'],
  putatan: ['Ketiau', 'Kepayan Ridge', 'Lok Kawi border', 'Petagas', 'Kota Kinabalu border', 'Taman Pasir Putih Putatan'],
  ranau: ['Kundasang', 'Poring', 'Mesilau', 'Liwan', 'Lohan', 'Pekan Ranau'],
  semporna: ['Bum-Bum', 'Kampung Bangau-Bangau', 'Taman Sempaul', 'Kampung Bubul', 'Taman Sutera Semporna', 'Kampung Sri Melor'],
  sipitang: ['Sindumin', 'Melamam', 'Mesapol', 'Mendulong', 'Long Pasia route', 'Pekan Sipitang'],
  tenom: ['Kemabong', 'Melalap', 'Lagud Seberang', 'Pangi', 'Taman Pertama Tenom', 'Pekan Tenom'],
  tuaran: ['Tamparuli', 'Kiulu', 'Sulaman', 'Mengkabong', 'Telipok', 'Gayang'],

  betong: ['Saratok', 'Pusa', 'Spaoh', 'Debak', 'Maludam', 'Layar Betong'],
  kapit: ['Song', 'Belaga', 'Nanga Merit', 'Baleh', 'Pelagus', 'Kapit town area'],
  lawas: ['Trusan', 'Sundar', 'Merapok', 'Awat-Awat', 'Long Tuma', 'Lawas town area'],
  limbang: ['Nanga Medamit', 'Tedungan', 'Pandaruan', 'Bukit Kota', 'Limbang town area', 'Kampung Patiambun'],
  samarahan: ['Muara Tuang', 'Asajaya', 'Uni Garden', 'Samarindah', 'Tabuan Jaya border', 'Stakan'],
  sarikei: ['Bintangor', 'Julau', 'Meradong', 'Jakar', 'Rejang Sarikei', 'Sarikei town area'],
  'sri-aman': ['Simanggang', 'Lingga', 'Pantu', 'Lachau', 'Undop', 'Melugu'],
  mukah: ['Dalat', 'Balingian', 'Oya', 'Tellian', 'Matadeng', 'Mukah New Township'],
  serian: ['Tebedu', 'Siburan', 'Tapah Serian', 'Balai Ringin', 'Tarum', 'Kampung Pichin'],
};

for (const [slug, areas] of Object.entries(auditedLargeAreas)) {
  specificAreas[slug] = [...(specificAreas[slug] || []), ...areas];
}

const finalAreaTopUps = {
  'yong-peng': ['Taman Kota Yong Peng', 'Taman Sembrong'],
  ijok: ['Bukit Badong', 'Kampung Ijok'],
  jenjarom: ['Kampung Jenjarom', 'Bandar Saujana Putra'],
  jeram: ['Bukit Kuching', 'Jalan Kapar Jeram', 'Kampung Bukit Hijau'],
  'kuala-kubu-bharu': ['Taman KKB Utama', 'Kerling', 'Ampang Pecah'],
  morib: ['Pantai Kelanang', 'Kampung Endah', 'Sungai Lang'],
  'sabak-bernam': ['Sungai Air Tawar', 'Pekan Sabak Bernam'],
  'salak-tinggi': ['Taman Dahlia Salak Tinggi', 'Taman Mawar Salak Tinggi'],
  'saujana-putra': ['Taman Lestari Putra', 'SP Saujana'],
  sekinchan: ['Kampung Site A', 'Kampung Site B'],
  serendah: ['Taman Serendah Makmur', 'Kampung Dato Harun', 'Bukit Beruntung border'],
  segambut: ['Taman Segambut Damai'],
  jelebu: ['Kampung Chennah'],
  jempol: ['Felda Palong'],
  'cameron-highlands': ['Kampung Raja Cameron'],
  maran: ['Sungai Jerik'],
  'kubang-pasu': ['Tunjang'],
  besut: ['Alor Lintang'],
  'hulu-terengganu': ['Kampung Tok Randok'],
  setiu: ['Langkap Setiu'],
};

for (const [slug, areas] of Object.entries(finalAreaTopUps)) {
  specificAreas[slug] = [...(specificAreas[slug] || []), ...areas];
}

function normalizeArea(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^Perkampungan\s+/i, '');
}

function isSpecificArea(area) {
  const lower = area.toLowerCase();
  return ![
    /^kawasan sekitar /,
    /^dan kawasan sekitar /,
    /^kawasan berdekatan /,
    /^kampung sekitar /,
    /^perkampungan sekitar /,
    /^taman perumahan sekitar /,
    /^kedai dan pejabat sekitar /,
  ].some((pattern) => pattern.test(lower));
}

function uniq(values) {
  const seen = new Set();
  const output = [];

  for (const value of values) {
    const clean = normalizeArea(value);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) continue;
    seen.add(key);
    output.push(clean);
  }

  return output;
}

for (const state of locationStates) {
  let stateTier3 = 0;
  for (const location of state.locations) {
    delete location.type;
    delete location.note;

    const extras = specificAreas[location.slug] || [];
    location.areas = uniq([
      ...location.areas,
      ...extras,
    ]).filter(isSpecificArea);
    stateTier3 += location.areas.length;
  }
  state.tier2Count = state.locations.length;
  state.tier3Count = stateTier3;
}

const output = `// Generated location data for Astro pages.\n// Areas are rendered as coverage bubbles inside each location page.\n\nexport const locationStates = ${JSON.stringify(locationStates, null, 2)};\n`;

fs.writeFileSync('src/data/locations.js', output);

console.log(JSON.stringify({
  states: locationStates.length,
  locations: locationStates.reduce((total, state) => total + state.locations.length, 0),
  areas: locationStates.reduce((total, state) => total + state.tier3Count, 0),
  kuantan: locationStates.find((state) => state.slug === 'pahang').locations.find((location) => location.slug === 'kuantan').areas,
}, null, 2));
