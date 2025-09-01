'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  DistrictFeatureCollection,
  TalukFeatureCollection, 
  SchoolFeatureCollection,
  DistrictMigrationData,
  TalukMigrationData,
  MapViewType 
} from '@/types/migrationData';
import { 
  DATA_PATHS,
  getTalukMigrationPath,
  getSchoolsPath 
} from '@/utils/dataPaths';

interface UseMigrationDataReturn {
  districtData: DistrictFeatureCollection | null;
  talukData: TalukFeatureCollection | null;
  schoolData: SchoolFeatureCollection | null;
  villageData: any | null; // Using any for now since village structure is similar to taluk but not exactly the same
  ambatturSchoolsData: any | null; // Ambattur-specific schools
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadDistrictData: () => Promise<void>;
  loadTalukData: (districtCode: number) => Promise<void>;
  loadSchoolData: (districtCode: number) => Promise<void>;
  loadVillageData: () => Promise<void>; // For Ambattur villages
  loadAmbatturSchools: () => Promise<void>; // For Ambattur schools
  clearTalukData: () => void;
  clearSchoolData: () => void;
  clearVillageData: () => void;
  clearAmbatturSchools: () => void;
}

export function useMigrationData(): UseMigrationDataReturn {
  const [districtData, setDistrictData] = useState<DistrictFeatureCollection | null>(null);
  const [talukData, setTalukData] = useState<TalukFeatureCollection | null>(null);
  const [schoolData, setSchoolData] = useState<SchoolFeatureCollection | null>(null);
  const [villageData, setVillageData] = useState<any | null>(null);
  const [ambatturSchoolsData, setAmbatturSchoolsData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load district-level data
  const loadDistrictData = useCallback(async () => {
    if (districtData) return; // Already loaded

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(DATA_PATHS.DISTRICT_MIGRATION);
      if (!response.ok) {
        throw new Error(`Failed to load district data: ${response.status}`);
      }
      
      const data: DistrictFeatureCollection = await response.json();
      setDistrictData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading district data';
      setError(errorMessage);
      console.error('Error loading district data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [districtData]);

  // Load taluk-level data for a specific district
  const loadTalukData = useCallback(async (districtCode: number) => {
    console.log('Loading taluk data for district:', districtCode);
    setIsLoading(true);
    setError(null);

    try {
      const talukPath = getTalukMigrationPath(districtCode);
      console.log('Taluk data path:', talukPath);
      const response = await fetch(talukPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load taluk data for district ${districtCode}: ${response.status}`);
      }
      
      const data: TalukFeatureCollection = await response.json();
      console.log('Taluk data loaded:', data);
      setTalukData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading taluk data';
      setError(errorMessage);
      console.error(`Error loading taluk data for district ${districtCode}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load school data for a specific district
  const loadSchoolData = useCallback(async (districtCode: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const schoolPath = getSchoolsPath(districtCode);
      const response = await fetch(schoolPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load school data for district ${districtCode}: ${response.status}`);
      }
      
      const data: SchoolFeatureCollection = await response.json();
      setSchoolData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading school data';
      setError(errorMessage);
      console.error(`Error loading school data for district ${districtCode}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load village data for Ambattur
  const loadVillageData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(DATA_PATHS.AMBATTUR_VILLAGES);
      
      if (!response.ok) {
        throw new Error(`Failed to load village data: ${response.status}`);
      }
      
      const data = await response.json();
      setVillageData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading village data';
      setError(errorMessage);
      console.error('Error loading village data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load Ambattur schools data
  const loadAmbatturSchools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(DATA_PATHS.AMBATTUR_SCHOOLS);
      
      if (!response.ok) {
        throw new Error(`Failed to load Ambattur schools data: ${response.status}`);
      }
      
      const data = await response.json();
      setAmbatturSchoolsData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading Ambattur schools data';
      setError(errorMessage);
      console.error('Error loading Ambattur schools data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear taluk data
  const clearTalukData = useCallback(() => {
    setTalukData(null);
  }, []);

  // Clear school data
  const clearSchoolData = useCallback(() => {
    setSchoolData(null);
  }, []);

  // Clear village data
  const clearVillageData = useCallback(() => {
    setVillageData(null);
  }, []);

  // Clear Ambattur schools data
  const clearAmbatturSchools = useCallback(() => {
    setAmbatturSchoolsData(null);
  }, []);

  // Auto-load district data on mount
  useEffect(() => {
    loadDistrictData();
  }, [loadDistrictData]);

  return {
    districtData,
    talukData,
    schoolData,
    villageData,
    ambatturSchoolsData,
    isLoading,
    error,
    loadDistrictData,
    loadTalukData,
    loadSchoolData,
    loadVillageData,
    loadAmbatturSchools,
    clearTalukData,
    clearSchoolData,
    clearVillageData,
    clearAmbatturSchools,
  };
}

/**
 * Helper hook to extract values for a specific field from feature data
 */
export function useFieldValues<T extends DistrictMigrationData | TalukMigrationData>(
  data: { features: Array<{ properties: T }> } | null,
  fieldName: keyof T
): number[] {
  return data?.features
    .map(feature => {
      const value = feature.properties[fieldName];
      return typeof value === 'number' ? value : 0;
    })
    .filter(val => typeof val === 'number' && !isNaN(val)) || [];
}