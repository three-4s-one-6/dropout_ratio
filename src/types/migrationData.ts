/**
 * TypeScript types for Tamil Nadu Student Migration Data
 */

// Base interface for common geographic properties
interface BaseGeographicData {
  dist_name: string;
  district_c: number;
  district_name: string;
}

// Common student statistics interface
interface StudentStatistics {
  total_students: number;
  male_students: number;
  female_students: number;
  gender_ratio: number;
  min_class: number;
  max_class: number;
  avg_class: number;
  class_range: number;
}

// Migration analysis interface
interface MigrationAnalysis {
  primary_dropout_reason: string;
  dropout_reasons_count: number;
}

// School infrastructure interface
interface SchoolInfrastructure {
  primary_school_type: string;
  school_categories_count: number;
  communities_count: number;
  unique_schools: number;
  students_per_school: number;
}

// Geographic distribution interface
interface GeographicDistribution {
  urban_students: number;
  rural_students: number;
  urban_percentage: number;
  size_category: string;
}

/**
 * District-level migration data structure
 */
export interface DistrictMigrationData extends 
  BaseGeographicData,
  StudentStatistics, 
  MigrationAnalysis,
  SchoolInfrastructure,
  GeographicDistribution {
  
  // School type breakdown (district level)
  government_schools: number;
  private_schools: number;
  fully_aided_schools: number;
  partially_aided_schools: number;
}

/**
 * Taluk-level migration data structure
 */
export interface TalukMigrationData extends 
  BaseGeographicData,
  StudentStatistics,
  MigrationAnalysis,
  GeographicDistribution {
  
  // Taluk-specific properties
  talukname: string;
  dist_id: number;
  taluk_id: number;
  Taluk_code: number;
  
  // Source/target identification
  source_district_code: string;
  source_district_name: string;
  district_code: string;
  taluk_code: number;
  
  // School distribution (different structure than district)
  government_students: number;
  private_students: number;
  aided_students: number;
  
  // Common with districts but separate tracking
  communities_count: number;
  unique_schools: number;
  students_per_school: number;
  size_category: string;
}

/**
 * School point data structure
 */
export interface SchoolPointData {
  // Identification
  id: string;
  object_id: number;
  dept_code: string;
  tngis_id: string | null;
  layer_id: number;
  
  // Geographic classification
  district: string;
  district_c: string;
  block: string;
  education_district: string;
  
  // Administrative boundaries
  assembly: string;
  parliament: string;
  localbody: string;
  town_municipality: string | null;
  habitation: string | null;
  cluster: string;
  
  // School details
  name: string;
  managing_department: string;
  management: string; // "Government", "Un-aided", "Fully Aided", etc.
  category: string;
  category_group: string;
  directorate: string;
  
  // Geographic coordinates
  latitute: number;
  longitude: number;
  
  // Status
  status: boolean;
  created_by: string | null;
  
  // Migration data (mostly null for individual schools)
  dist_name: string | null;
  district_name: string | null;
  total_students: number | null;
  male_students: number | null;
  female_students: number | null;
  gender_ratio: number | null;
  primary_dropout_reason: string | null;
  dropout_reasons_count: number | null;
  primary_school_type: string | null;
  government_schools: number | null;
  private_schools: number | null;
  fully_aided_schools: number | null;
  partially_aided_schools: number | null;
  school_categories_count: number | null;
  communities_count: number | null;
  urban_students: number | null;
  rural_students: number | null;
  urban_percentage: number | null;
  unique_schools: number | null;
  students_per_school: number | null;
  size_category: string | null;
}

/**
 * Village data structure (for Ambattur - placeholder)
 */
export interface VillageData extends BaseGeographicData {
  village_name: string;
  village_code: string;
  taluk_name: string;
  taluk_code: number;
  // Additional village-specific properties can be added
}

/**
 * GeoJSON Feature types
 */
export interface DistrictFeature {
  type: 'Feature';
  properties: DistrictMigrationData;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

export interface TalukFeature {
  type: 'Feature';
  properties: TalukMigrationData;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

export interface SchoolFeature {
  type: 'Feature';
  properties: SchoolPointData;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface VillageFeature {
  type: 'Feature';
  properties: VillageData;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

/**
 * GeoJSON FeatureCollection types
 */
export interface DistrictFeatureCollection {
  type: 'FeatureCollection';
  name: string;
  crs: {
    type: 'name';
    properties: {
      name: string;
    };
  };
  features: DistrictFeature[];
}

export interface TalukFeatureCollection {
  type: 'FeatureCollection';
  name: string;
  crs: {
    type: 'name';
    properties: {
      name: string;
    };
  };
  xy_coordinate_resolution?: number;
  features: TalukFeature[];
}

export interface SchoolFeatureCollection {
  type: 'FeatureCollection';
  name: string;
  crs: {
    type: 'name';
    properties: {
      name: string;
    };
  };
  features: SchoolFeature[];
}

/**
 * Map view types
 */
export type MapViewType = 'district' | 'taluk' | 'village' | 'school';

/**
 * Filter configuration for map visualization
 */
export interface FilterConfig {
  selectedField: keyof DistrictMigrationData | keyof TalukMigrationData | "student_school_ratio";
  viewType: MapViewType;
  selectedDistrict?: number;
  selectedTaluk?: string;
  useWeightedCalculation: boolean; // for total_students / unique_schools
}

/**
 * Color classification for map styling
 */
export interface ColorClassification {
  min: number;
  max: number;
  breaks: number[];
  colors: string[];
  field: string;
}

/**
 * Available fields for visualization (filtered list)
 */
export const VISUALIZABLE_FIELDS = {
  // Student demographics
  total_students: 'Total Students',
  male_students: 'Male Students', 
  female_students: 'Female Students',
  
  // Geographic distribution
  urban_students: 'Urban Students',
  rural_students: 'Rural Students', 
  urban_percentage: 'Urban Percentage',
  
  // School infrastructure
  government_schools: 'Government Schools',
  private_schools: 'Private Schools',
  fully_aided_schools: 'Fully Aided Schools',
  students_per_school: 'Students per School',
} as const;

export type VisualizableField = keyof typeof VISUALIZABLE_FIELDS | 'student_school_ratio';

/**
 * Fields available for Ambattur village visualization
 */
export const AMBATTUR_VILLAGE_FIELDS = {
  total_students: 'Total Students',
  male_students: 'Male Students', 
  female_students: 'Female Students',
  gender_ratio: 'Gender Ratio',
  min_class: 'Minimum Class',
  max_class: 'Maximum Class',
  avg_class: 'Average Class',
  class_range: 'Class Range',
  unique_schools: 'Number of Schools',
  students_per_school: 'Students per School'
} as const;