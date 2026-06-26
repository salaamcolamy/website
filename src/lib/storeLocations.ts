/**
 * Store locator data — shared by homepage (Supporters) and contact page (StoreLocatorMap).
 * Coordinates use the Malaysia SVG viewBox (50 40 200 280).
 */

export interface StoreLocation {
  id: number
  name: string
  address: string
  contact: string
  state: string
  x: number
  y: number
  /** List grouping override (e.g. Kedah mainland vs Langkawi both use MY02 on map) */
  region?: string
  comingSoon?: boolean
}

export const storeLocations: StoreLocation[] = [
  // Kuala Lumpur
  {
    id: 25,
    name: 'Sssetel Mart, Parlimen Malaysia',
    address: 'Blok Utama Parlimen Malaysia, Jln Parlimen, Kuala Lumpur',
    contact: '017-855 9205',
    state: 'MY14',
    x: 125,
    y: 191,
  },
  {
    id: 101,
    name: 'Riverside Cafe',
    address: 'World Trade Centre Kuala Lumpur, 41, Jalan Tun Ismail, Chow Kit',
    contact: '+603-26146701',
    state: 'MY14',
    x: 127,
    y: 192,
  },
  {
    id: 10,
    name: 'Fennel & Co',
    address: 'Bukit Tunku, Kuala Lumpur',
    contact: '+603-2142-5679',
    state: 'MY14',
    x: 128,
    y: 194,
  },
  {
    id: 2,
    name: 'The Great Chase',
    address: 'Solaris Dutamas, Kuala Lumpur',
    contact: '+603-6201-7890',
    state: 'MY14',
    x: 125,
    y: 195,
  },
  {
    id: 1,
    name: 'Betawi Indonesian Cuisine',
    address: 'TTDI, Kuala Lumpur',
    contact: '+603-7728-3456',
    state: 'MY14',
    x: 118,
    y: 188,
  },
  {
    id: 4,
    name: 'Tepuk Tepung',
    address: 'Hartamas Shopping Centre, Kuala Lumpur',
    contact: '+603-2110-2345',
    state: 'MY14',
    x: 122,
    y: 190,
  },
  {
    id: 14,
    name: 'Duwa Cafe',
    address: 'Taman Melawati, Kuala Lumpur',
    contact: '+603-4100-0001',
    state: 'MY14',
    x: 120,
    y: 186,
  },
  {
    id: 18,
    name: 'One Coffee @ VIOBA',
    address: 'Bukit Bintang, Kuala Lumpur',
    contact: '+603-2144-9867',
    state: 'MY14',
    x: 128,
    y: 194,
  },
  {
    id: 15,
    name: 'Hadramawt Restaurant',
    address: 'Tun Razak City, Kuala Lumpur',
    contact: '+603-4100-0002',
    state: 'MY14',
    x: 126,
    y: 198,
  },
  {
    id: 17,
    name: 'Sahra Savor',
    address: 'Maxim Citylights Sentul, Kuala Lumpur',
    contact: '+603-4100-0004',
    state: 'MY14',
    x: 124,
    y: 192,
  },
  {
    id: 102,
    name: 'Nasi Kerabu Keramat',
    address: 'Sri Rampai, Kuala Lumpur',
    contact: '',
    state: 'MY14',
    x: 121,
    y: 185,
  },
  {
    id: 103,
    name: 'Nasi Kerabu Keramat',
    address: 'Wangsa Maju, Kuala Lumpur',
    contact: '',
    state: 'MY14',
    x: 123,
    y: 187,
  },
  {
    id: 24,
    name: 'Kunafa Crisp',
    address: '51, Jln Sultan Ismail, Bukit Bintang, Kuala Lumpur',
    contact: '011-5155 9488',
    state: 'MY14',
    x: 129,
    y: 193,
  },
  {
    id: 26,
    name: 'High Street Art Cafe',
    address: '8, Lebuh Pudu, Kuala Lumpur',
    contact: '010-2390255',
    state: 'MY14',
    x: 127,
    y: 195,
  },
  {
    id: 27,
    name: 'WOP Pizzeria',
    address: 'H-0-8, Plaza Damas, 60, Jalan Sri Hartamas 1, Sri Hartamas, Kuala Lumpur',
    contact: '03 - 64197530',
    state: 'MY14',
    x: 124,
    y: 191,
  },
  {
    id: 28,
    name: 'YAFA Restaurant',
    address: '7, Lorong Datuk Sulaiman 7, Taman Tun Dr Ismail, Kuala Lumpur',
    contact: '012-607 5852',
    state: 'MY14',
    x: 119,
    y: 189,
  },
  {
    id: 107,
    name: 'Edar Mart',
    address: 'Jalan 2/76c, Desa Pandan, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
    contact: '',
    state: 'MY14',
    x: 131,
    y: 199,
  },
  {
    id: 112,
    name: 'Kapitan Tandoori House @ Taman Tun Dr Ismail',
    address: '50, Jalan Tun Mohd Fuad 1, Taman Tun Dr Ismail, Kuala Lumpur',
    contact: '017-899 7011',
    state: 'MY14',
    x: 117,
    y: 188,
  },
  {
    id: 120,
    name: 'Lutfi Jaya, Plaza City One',
    address: 'No. G20, Ground Floor, Plaza City One, Jalan Munshi Abdullah, Kuala Lumpur',
    contact: '03-2202 8800',
    state: 'MY14',
    x: 127,
    y: 193,
  },
  // Selangor
  {
    id: 6,
    name: 'Karya Kopi Roastery',
    address: 'Shah Alam, Selangor',
    contact: '+603-9000-6789',
    state: 'MY10',
    x: 140,
    y: 205,
  },
  {
    id: 16,
    name: 'Hadramawt Restaurant',
    address: 'Neo Damansara, Petaling Jaya, Selangor',
    contact: '+603-4100-0003',
    state: 'MY10',
    x: 132,
    y: 200,
  },
  {
    id: 5,
    name: 'Food Station Level 1',
    address: 'KLIA Terminal 1, Sepang',
    contact: '+603-8787-1234',
    state: 'MY10',
    x: 135,
    y: 220,
  },
  {
    id: 108,
    name: 'Eraman Express Mart',
    address: 'KLIA 1, Departure, Gate A, Sepang, Selangor',
    contact: '',
    state: 'MY10',
    x: 134,
    y: 221,
  },
  {
    id: 109,
    name: 'Eraman Express Mart',
    address: 'KLIA 2, Sepang, Selangor',
    contact: '',
    state: 'MY10',
    x: 136,
    y: 222,
  },
  {
    id: 29,
    name: 'Hadramawt Putrajaya',
    address: 'M-G-01, Conezion Commercial, Persiaran IRC 3, Putrajaya',
    contact: '017-500 4011',
    state: 'MY10',
    x: 141,
    y: 221,
  },
  {
    id: 30,
    name: 'Shawarma Gaza (Giant Kemuning Utama)',
    address: '22, Jalan Kemuning Prima F33/F, Kemuning Utama, Shah Alam, Selangor',
    contact: '',
    state: 'MY10',
    x: 137,
    y: 204,
  },
  {
    id: 31,
    name: 'Hilal Resources',
    address: 'No 28 Tingkat Bawah Blok 4, Bangunan Worldwide, Seksyen 13, Shah Alam, Selangor',
    contact: '012-220 2712',
    state: 'MY10',
    x: 135,
    y: 201,
  },
  {
    id: 110,
    name: 'Nasi Kandar Budak Mamaks',
    address: 'Lot 3A, Jln Utara, Pjs 52, 46200 Petaling Jaya, Selangor',
    contact: '012-377 2276',
    state: 'MY10',
    x: 133,
    y: 202,
  },
  {
    id: 111,
    name: "Mozer's Restaurant",
    address: "03-0G-01, D'Vida Business Centre, Jalan Bazar U8/101, Bukit Jelutong, Shah Alam, Selangor",
    contact: '03-7734 1783',
    state: 'MY10',
    x: 136,
    y: 203,
  },
  {
    id: 113,
    name: 'Amir Damascus Restaurant',
    address: 'D3-G-01, Block D3, Jln Atelier 2A, Edusphere, Cyberjaya, Selangor',
    contact: '011-5556 0008',
    state: 'MY10',
    x: 143,
    y: 218,
  },
  {
    id: 118,
    name: 'Salam Point Mart',
    address: 'I-G-6, Kelana Jaya Parklane Commercial Hub, Jalan SS 7/26, SS7, Petaling Jaya, Selangor',
    contact: '03-3142 2666',
    state: 'MY10',
    x: 133,
    y: 197,
  },
  {
    id: 119,
    name: 'Kurma Madinah 2',
    address: '11-1, Jalan USJ Heights 1/1B, USJ Heights, Subang Jaya, Selangor',
    contact: '011-6936 9984',
    state: 'MY10',
    x: 127,
    y: 207,
  },
  // Pulau Pinang
  {
    id: 32,
    name: 'Kapitan Tandoori House @ Sungai Ara',
    address: 'R-01-05 Setia Triangle, Persiaran Kelicap, Sungai Ara, Bayan Lepas, Pulau Pinang',
    contact: '010-268 7011',
    state: 'MY07',
    x: 76,
    y: 113,
  },
  {
    id: 33,
    name: 'Kapitan Tandoori House @ Bandar Perda',
    address: 'G36, Jalan Perda Selatan, De\'Rendezuous, Bukit Mertajam, Pulau Pinang',
    contact: '010-256 7011',
    state: 'MY07',
    x: 86,
    y: 99,
  },
  {
    id: 34,
    name: 'Khalifah Eksklusif',
    address: '2, Tingkat Ciku 1, Taman Ciku, Bukit Mertajam, Pulau Pinang',
    contact: '019-288 2786',
    state: 'MY07',
    x: 88,
    y: 101,
  },
  // Kedah (mainland)
  {
    id: 35,
    name: 'Kapitan Tandoori House @ Lunas Kulim',
    address: '28, Jalan Saujana 2, Taman Industri Saujana, Lunas, Kedah',
    contact: '010-396 7011',
    state: 'MY02',
    region: 'Kedah',
    x: 100,
    y: 116,
  },
  // Negeri Sembilan
  {
    id: 7,
    name: 'Lot 15 Cafe',
    address: 'Nilai, Negeri Sembilan',
    contact: '+606-601-0123',
    state: 'MY05',
    x: 158,
    y: 224,
  },
  {
    id: 12,
    name: 'Mujua Cafe & Company',
    address: 'Nilai, Negeri Sembilan',
    contact: '+606-601-0125',
    state: 'MY05',
    x: 156,
    y: 222,
  },
  {
    id: 13,
    name: 'Kopi dan Kita Kafe',
    address: 'Nilai, Negeri Sembilan',
    contact: '+606-601-0126',
    state: 'MY05',
    x: 160,
    y: 226,
  },
  {
    id: 8,
    name: 'Tiga Tujuh Cafe',
    address: 'Seremban, Negeri Sembilan',
    contact: '+606-601-0124',
    state: 'MY05',
    x: 162,
    y: 228,
    comingSoon: true,
  },
  // Melaka
  {
    id: 114,
    name: 'Ben Salleh',
    address: '26, Jln TMS 8, Taman Tanjung Minyak Setia, Melaka',
    contact: '017-374 6398',
    state: 'MY04',
    x: 168,
    y: 248,
  },
  // Johor
  {
    id: 115,
    name: 'Kedai Kurma',
    address: "34, Jalan Gambir 2, Bandar Baru Bukit Gambir, Bukit Gambir, Tangkak, Johor Darul Ta'zim",
    contact: '019-726 0855',
    state: 'MY01',
    x: 188,
    y: 248,
  },
  // Kelantan
  {
    id: 116,
    name: 'Jaffar Rawas Tunjung',
    address: 'Pt 510–515 Tingkat 1, Jalan Kuala Krai, Bandar Baharu Tunjung, Kota Bharu, Kelantan',
    contact: '017-542 4011',
    state: 'MY03',
    x: 155,
    y: 115,
  },
  {
    id: 117,
    name: 'Jaffar Rawas Kota Bharu',
    address: '18T-B, Jalan Dato Pati, Kota Bharu, Kelantan',
    contact: '011-1535 2347',
    state: 'MY03',
    x: 162,
    y: 112,
  },
  // Langkawi
  {
    id: 19,
    name: 'Redsky Cafe @ Villa Molek',
    address: 'Jalan Teluk Baru, Pantai Tengah, Langkawi',
    contact: '04-952 3641',
    state: 'MY02',
    region: 'Langkawi',
    x: 54,
    y: 52,
  },
  {
    id: 20,
    name: 'Koperasi Kakitangan Tropical Charters Berhad',
    address: '12-3, Langkawi Boulevard Langkawi City, Jalan Mahawangsa 1, Kuah, Langkawi',
    contact: '04-952 3641',
    state: 'MY02',
    region: 'Langkawi',
    x: 56,
    y: 54,
  },
  {
    id: 104,
    name: 'Tasik Dayang Bunting',
    address: 'Kuah, Langkawi',
    contact: '03-26164488',
    state: 'MY02',
    region: 'Langkawi',
    x: 58,
    y: 55,
  },
  {
    id: 105,
    name: 'Telaga Seafood Restaurant',
    address: 'Jalan Pantai Chenang, Kampung Lubok Buaya, Langkawi',
    contact: '013-350 8171',
    state: 'MY02',
    region: 'Langkawi',
    x: 55,
    y: 58,
  },
  {
    id: 106,
    name: 'Angrik Kopi',
    address: 'Simpang Perana, Mukim, Perana, Langkawi',
    contact: '018-9479288',
    state: 'MY02',
    region: 'Langkawi',
    x: 60,
    y: 56,
  },
]

export const highlightedStates = ['MY10', 'MY14', 'MY05', 'MY02', 'MY07', 'MY03', 'MY04', 'MY01']

export const hiddenStates = ['MY12', 'MY13']

export const stateLabels = [
  { id: 'MY09', name: 'Perlis', x: 73.4, y: 55.2 },
  { id: 'MY02', name: 'Kedah', x: 93.7, y: 80.9 },
  { id: 'MY07', name: 'Pulau Pinang', x: 83.1, y: 106.1 },
  { id: 'MY08', name: 'Perak', x: 108.6, y: 128.6 },
  { id: 'MY03', name: 'Kelantan', x: 156.5, y: 118.5 },
  { id: 'MY11', name: 'Terengganu', x: 196.7, y: 122 },
  { id: 'MY06', name: 'Pahang', x: 174.6, y: 183.5 },
  { id: 'MY10', name: 'Selangor', x: 131.5, y: 198.2 },
  { id: 'MY14', name: 'Kuala Lumpur', x: 140.3, y: 210.9 },
  { id: 'MY16', name: 'Putrajaya', x: 140.6, y: 220.8 },
  { id: 'MY05', name: 'Negeri Sembilan', x: 164.6, y: 226.1 },
  { id: 'MY04', name: 'Melaka', x: 170.3, y: 249.2 },
  { id: 'MY01', name: 'Johor', x: 219.2, y: 262.2 },
]

export const LIST_REGION_ORDER = [
  'Kuala Lumpur',
  'Selangor',
  'Negeri Sembilan',
  'Melaka',
  'Johor',
  'Pulau Pinang',
  'Kedah',
  'Kelantan',
  'Langkawi',
] as const

export function getListRegion(loc: StoreLocation): string {
  if (loc.region) return loc.region
  switch (loc.state) {
    case 'MY14':
      return 'Kuala Lumpur'
    case 'MY10':
      return 'Selangor'
    case 'MY07':
      return 'Pulau Pinang'
    case 'MY05':
      return 'Negeri Sembilan'
    case 'MY04':
      return 'Melaka'
    case 'MY01':
      return 'Johor'
    case 'MY03':
      return 'Kelantan'
    case 'MY02':
      return 'Langkawi'
    default:
      return 'Other'
  }
}

export function groupLocationsByRegion(
  locations: StoreLocation[]
): Record<string, StoreLocation[]> {
  return locations.reduce((acc, loc) => {
    const region = getListRegion(loc)
    if (!acc[region]) acc[region] = []
    acc[region].push(loc)
    return acc
  }, {} as Record<string, StoreLocation[]>)
}
