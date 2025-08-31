'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { MapViewType, FilterConfig, VisualizableField, ColorClassification } from '@/types/migrationData';

interface FilterContextValue {
  // Filter state
  filter: FilterConfig;
  
  // Color classification
  colorClassification: ColorClassification | null;
  
  // Actions
  setSelectedField: (field: VisualizableField) => void;
  setViewType: (viewType: MapViewType) => void;
  setSelectedDistrict: (districtCode: number | undefined) => void;
  setSelectedTaluk: (talukName: string | undefined) => void;
  setUseWeightedCalculation: (useWeighted: boolean) => void;
  setColorClassification: (classification: ColorClassification | null) => void;
  
  // Convenience methods
  resetToDistrictView: () => void;
  navigateToTalukView: (districtCode: number) => void;
  navigateToVillageView: (districtCode: number, talukName: string) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
  children: React.ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [filter, setFilter] = useState<FilterConfig>({
    selectedField: 'total_students',
    viewType: 'district',
    selectedDistrict: undefined,
    selectedTaluk: undefined,
    useWeightedCalculation: false,
  });
  
  const [colorClassification, setColorClassification] = useState<ColorClassification | null>(null);
  
  // Individual field setters
  const setSelectedField = useCallback((field: VisualizableField) => {
    setFilter(prev => ({
      ...prev,
      selectedField: field as any, // Type assertion needed due to union complexity
    }));
  }, []);
  
  const setViewType = useCallback((viewType: MapViewType) => {
    setFilter(prev => ({
      ...prev,
      viewType,
    }));
  }, []);
  
  const setSelectedDistrict = useCallback((districtCode: number | undefined) => {
    setFilter(prev => ({
      ...prev,
      selectedDistrict: districtCode,
      // Reset taluk when district changes
      selectedTaluk: undefined,
    }));
  }, []);
  
  const setSelectedTaluk = useCallback((talukName: string | undefined) => {
    setFilter(prev => ({
      ...prev,
      selectedTaluk: talukName,
    }));
  }, []);
  
  const setUseWeightedCalculation = useCallback((useWeighted: boolean) => {
    setFilter(prev => ({
      ...prev,
      useWeightedCalculation: useWeighted,
    }));
  }, []);
  
  // Convenience navigation methods
  const resetToDistrictView = useCallback(() => {
    setFilter(prev => ({
      ...prev,
      viewType: 'district',
      selectedDistrict: undefined,
      selectedTaluk: undefined,
    }));
    setColorClassification(null);
  }, []);
  
  const navigateToTalukView = useCallback((districtCode: number) => {
    console.log('Navigating to taluk view for district:', districtCode);
    setFilter(prev => {
      const newFilter = {
        ...prev,
        viewType: 'taluk' as MapViewType,
        selectedDistrict: districtCode,
        selectedTaluk: undefined,
      };
      console.log('Filter updated:', newFilter);
      return newFilter;
    });
    setColorClassification(null);
  }, []);
  
  const navigateToVillageView = useCallback((districtCode: number, talukName: string) => {
    setFilter(prev => ({
      ...prev,
      viewType: 'village' as MapViewType,
      selectedDistrict: districtCode,
      selectedTaluk: talukName,
    }));
    setColorClassification(null);
  }, []);
  
  const value: FilterContextValue = {
    filter,
    colorClassification,
    setSelectedField,
    setViewType,
    setSelectedDistrict,
    setSelectedTaluk,
    setUseWeightedCalculation,
    setColorClassification,
    resetToDistrictView,
    navigateToTalukView,
    navigateToVillageView,
  };
  
  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}