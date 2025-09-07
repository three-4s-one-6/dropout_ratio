'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

interface MigrationDataContextValue {
  // Data state
  districtData: DistrictFeatureCollection | null;
  talukData: TalukFeatureCollection | null;
  schoolData: SchoolFeatureCollection | null;
  villageData: any | null;
  ambatturSchoolsData: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadDistrictData: () => Promise<void>;
  loadTalukData: (districtCode: number) => Promise<void>;
  loadSchoolData: (districtCode: number) => Promise<void>;
  loadVillageData: () => Promise<void>;
  loadAmbatturSchools: () => Promise<void>;
  clearTalukData: () => void;
  clearSchoolData: () => void;
  clearVillageData: () => void;
  clearAmbatturSchools: () => void;
}

const MigrationDataContext = createContext<MigrationDataContextValue | undefined>(undefined);

interface MigrationDataProviderProps {
  children: React.ReactNode;
}

export function MigrationDataProvider({ children }: MigrationDataProviderProps) {
  // Central data state
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
      console.log('🏢 [MigrationDataProvider] Loading district data...');
      const response = await fetch(DATA_PATHS.DISTRICT_MIGRATION);
      if (!response.ok) {
        throw new Error(`Failed to load district data: ${response.status}`);
      }
      
      const data: DistrictFeatureCollection = await response.json();
      setDistrictData(data);
      console.log('✅ [MigrationDataProvider] District data loaded:', {
        featuresCount: data.features?.length || 0,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading district data';
      setError(errorMessage);
      console.error('❌ [MigrationDataProvider] Error loading district data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [districtData]);

  // Load taluk-level data for a specific district
  const loadTalukData = useCallback(async (districtCode: number) => {
    console.log('🏘️ [MigrationDataProvider] Loading taluk data for district:', districtCode);
    setIsLoading(true);
    setError(null);

    try {
      const talukPath = getTalukMigrationPath(districtCode);
      console.log('📂 [MigrationDataProvider] Taluk data path:', talukPath);
      const response = await fetch(talukPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load taluk data for district ${districtCode}: ${response.status}`);
      }
      
      const data: TalukFeatureCollection = await response.json();
      setTalukData(data);
      console.log('✅ [MigrationDataProvider] Taluk data loaded and set in central state:', {
        districtCode,
        featuresCount: data.features?.length || 0,
        firstFeature: data.features?.[0]?.properties?.talukname || 'Unknown',
        timestamp: new Date().toISOString(),
        dataReference: data
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading taluk data';
      setError(errorMessage);
      console.error(`❌ [MigrationDataProvider] Error loading taluk data for district ${districtCode}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load school data for a specific district
  const loadSchoolData = useCallback(async (districtCode: number) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🏫 [MigrationDataProvider] Loading school data for district:', districtCode);
      const schoolPath = getSchoolsPath(districtCode);
      const response = await fetch(schoolPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load school data for district ${districtCode}: ${response.status}`);
      }
      
      const data: SchoolFeatureCollection = await response.json();
      setSchoolData(data);
      console.log('✅ [MigrationDataProvider] School data loaded:', {
        districtCode,
        featuresCount: data.features?.length || 0
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading school data';
      setError(errorMessage);
      console.error(`❌ [MigrationDataProvider] Error loading school data for district ${districtCode}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load village data for Ambattur
  const loadVillageData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🏘️ [MigrationDataProvider] Loading village data...');
      const response = await fetch(DATA_PATHS.AMBATTUR_VILLAGES);
      
      if (!response.ok) {
        throw new Error(`Failed to load village data: ${response.status}`);
      }
      
      const data = await response.json();
      setVillageData(data);
      console.log('✅ [MigrationDataProvider] Village data loaded:', {
        featuresCount: data.features?.length || 0
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading village data';
      setError(errorMessage);
      console.error('❌ [MigrationDataProvider] Error loading village data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load Ambattur schools data
  const loadAmbatturSchools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🏫 [MigrationDataProvider] Loading Ambattur schools data...');
      const response = await fetch(DATA_PATHS.AMBATTUR_SCHOOLS);
      
      if (!response.ok) {
        throw new Error(`Failed to load Ambattur schools data: ${response.status}`);
      }
      
      const data = await response.json();
      setAmbatturSchoolsData(data);
      console.log('✅ [MigrationDataProvider] Ambattur schools data loaded:', {
        featuresCount: data.features?.length || 0
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading Ambattur schools data';
      setError(errorMessage);
      console.error('❌ [MigrationDataProvider] Error loading Ambattur schools data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear functions
  const clearTalukData = useCallback(() => {
    console.log('🧹 [MigrationDataProvider] Clearing taluk data');
    setTalukData(null);
  }, []);

  const clearSchoolData = useCallback(() => {
    console.log('🧹 [MigrationDataProvider] Clearing school data');
    setSchoolData(null);
  }, []);

  const clearVillageData = useCallback(() => {
    console.log('🧹 [MigrationDataProvider] Clearing village data');
    setVillageData(null);
  }, []);

  const clearAmbatturSchools = useCallback(() => {
    console.log('🧹 [MigrationDataProvider] Clearing Ambattur schools data');
    setAmbatturSchoolsData(null);
  }, []);

  // Auto-load district data on mount
  useEffect(() => {
    console.log('🚀 [MigrationDataProvider] Provider mounted, loading district data');
    loadDistrictData();
  }, [loadDistrictData]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('📊 [MigrationDataProvider] District data state updated:', {
      hasData: !!districtData,
      featuresCount: districtData?.features?.length || 0,
      timestamp: new Date().toISOString()
    });
  }, [districtData]);

  useEffect(() => {
    console.log('📊 [MigrationDataProvider] Taluk data state updated:', {
      hasData: !!talukData,
      featuresCount: talukData?.features?.length || 0,
      timestamp: new Date().toISOString()
    });
  }, [talukData]);

  useEffect(() => {
    console.log('📊 [MigrationDataProvider] Village data state updated:', {
      hasData: !!villageData,
      featuresCount: villageData?.features?.length || 0,
      timestamp: new Date().toISOString()
    });
  }, [villageData]);

  const value: MigrationDataContextValue = {
    // Data state
    districtData,
    talukData,
    schoolData,
    villageData,
    ambatturSchoolsData,
    isLoading,
    error,
    
    // Actions
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

  return (
    <MigrationDataContext.Provider value={value}>
      {children}
    </MigrationDataContext.Provider>
  );
}

// Custom hook to use the migration data context
export function useMigrationData() {
  const context = useContext(MigrationDataContext);
  if (context === undefined) {
    throw new Error('useMigrationData must be used within a MigrationDataProvider');
  }
  return context;
}

// Helper hook to extract values for a specific field from feature data  
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