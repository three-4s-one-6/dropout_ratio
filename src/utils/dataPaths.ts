/**
 * Central configuration for data file paths
 * All GeoJSON files are served from the public/data directory
 */

export const DATA_PATHS = {
  // Main Tamil Nadu district migration data
  DISTRICT_MIGRATION: '/data/students_data/tamilnadu_district_migration_map.geojson',
  
  // District-wise taluk migration maps (1.geojson through 38.geojson)
  TALUK_MIGRATION_BASE: '/data/students_data/district_wise_migration_maps',
  
  // Schools by district (01_schools.geojson through 38_schools.geojson) 
  SCHOOLS_BASE: '/data/students_data/schools_by_district',
  
  // Village data for Ambattur
  AMBATTUR_VILLAGES: '/data/students_data/ambattur_village_migration_map.geojson',
  
  // Ambattur schools data
  AMBATTUR_SCHOOLS: '/data/students_data/ambattur_schools.geojson',
} as const;

/**
 * Generate path for taluk migration data by district code
 */
export const getTalukMigrationPath = (districtCode: number): string => {
  return `${DATA_PATHS.TALUK_MIGRATION_BASE}/${districtCode}.geojson`;
};

/**
 * Generate path for schools data by district code (with zero-padding)
 */
export const getSchoolsPath = (districtCode: number): string => {
  const paddedCode = districtCode.toString().padStart(2, '0');
  return `${DATA_PATHS.SCHOOLS_BASE}/${paddedCode}_schools.geojson`;
};

/**
 * District codes and names mapping for Tamil Nadu
 * Based on the data structure observed
 */
export const DISTRICT_MAPPING: Record<number, { name: string; code: string }> = {
  1: { name: 'Tiruvallur', code: '01' },
  2: { name: 'Chennai', code: '02' },
  3: { name: 'Kanchipuram', code: '03' },
  4: { name: 'Vellore', code: '04' },
  5: { name: 'Tiruvannamalai', code: '05' },
  6: { name: 'Viluppuram', code: '06' },
  7: { name: 'Salem', code: '07' },
  8: { name: 'Namakkal', code: '08' },
  9: { name: 'Erode', code: '09' },
  10: { name: 'The Nilgiris', code: '10' },
  11: { name: 'Dindigul', code: '11' },
  12: { name: 'Karur', code: '12' },
  13: { name: 'Trichy', code: '13' },
  14: { name: 'Perambalur', code: '14' },
  15: { name: 'Ariyalur', code: '15' },
  16: { name: 'Cuddalore', code: '16' },
  17: { name: 'Nagapattinam', code: '17' },
  18: { name: 'Thiruvarur', code: '18' },
  19: { name: 'Thanjavur', code: '19' },
  20: { name: 'Pudukkottai', code: '20' },
  21: { name: 'Sivaganga', code: '21' },
  22: { name: 'Madurai', code: '22' },
  23: { name: 'Theni', code: '23' },
  24: { name: 'Virudhunagar', code: '24' },
  25: { name: 'Ramanathapuram', code: '25' },
  26: { name: 'Thoothukudi', code: '26' },
  27: { name: 'Tirunelveli', code: '27' },
  28: { name: 'Kanniyakumari', code: '28' },
  29: { name: 'Dharmapuri', code: '29' },
  30: { name: 'Krishnagiri', code: '30' },
  31: { name: 'Coimbatore', code: '31' },
  32: { name: 'Tirupur', code: '32' },
  33: { name: 'Ranipet', code: '33' },
  34: { name: 'Tirupattur', code: '34' },
  35: { name: 'Chengalpattu', code: '35' },
  36: { name: 'Tenkasi', code: '36' },
  37: { name: 'Kallakurichi', code: '37' },
  38: { name: 'Mayiladuthurai', code: '38' }
};

/**
 * Tamil Nadu bounding box for initial map extent
 * [minLon, minLat, maxLon, maxLat]
 */
export const TAMIL_NADU_EXTENT: number[] = [76.23, 8.07, 80.33, 13.57];

/**
 * Default map center (approximately center of Tamil Nadu)
 */
export const TAMIL_NADU_CENTER: number[] = [78.28, 10.82];

/**
 * Check if district has Ambattur taluk (Chennai district)
 */
export const hasAmbatturTaluk = (districtCode: number): boolean => {
  return districtCode === 2; // Chennai district
};