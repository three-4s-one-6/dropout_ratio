'use client';

import { useEffect, useCallback } from 'react';
import { Style, Fill, Stroke, Text } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';

// Import existing map utilities
import { useLayers } from '@/map_lib/useLayers';
import { LayersFactory } from '@/map_lib/LayerFactory';
import { StyleFactory } from '@/map_lib/StyleFactory';
import { useMigrationMap } from '@/providers/MigrationMapProvider';
import { useMigrationData } from '@/hooks/useMigrationData';
import { useFilter } from '@/providers/FilterProvider';
import { 
  createEqualIntervalClassification,
  getColorForValue,
  calculateWeightedField,
  createQuantileClassification
} from '@/utils/colorUtils';
import { 
  DistrictMigrationData,
  TalukMigrationData,
  VisualizableField 
} from '@/types/migrationData';
import { MapViewType } from '@/types/migrationData';
import { useState } from 'react';

// Layer IDs
const DISTRICT_LAYER_ID = 'migration-districts';
const TALUK_LAYER_ID = 'migration-taluks';
const SCHOOL_LAYER_ID = 'migration-schools';

interface MigrationMapLayersProps {
  onFeatureClick?: (feature: any, layerType: 'district' | 'taluk' | 'school') => void;
  onFeatureDoubleClick?: (feature: any, layerType: 'district' | 'taluk' | 'school') => void;
}

export default function MigrationMapLayers({ onFeatureClick, onFeatureDoubleClick }: MigrationMapLayersProps) {
  const { map, isMapReady } = useMigrationMap();
  const { 
    addLayer, 
    removeLayer, 
    zoomToLayer, 
    getLayer,
    hideAllLayers,
    showLayer 
  } = useLayers(map);
  const [previousMode, setPreviousMode] = useState<MapViewType>('district');
  
  const { 
    districtData,
    talukData,
    schoolData,
    loadTalukData,
    clearTalukData 
  } = useMigrationData();
  
  const { 
    filter,
    colorClassification,
    setColorClassification,
    navigateToTalukView 
  } = useFilter();

  // Create styled layer for district data
  const createDistrictLayer = useCallback(() => {
    console.log('createDistrictLayer called:', { 
      hasDistrictData: !!districtData, 
      isMapReady 
    });
    
    if (!districtData || !isMapReady) return null;

    const features = LayersFactory.createLayerByGeoJSONObject({
      geoJSONObj: districtData,
      id: DISTRICT_LAYER_ID,
      name: 'Tamil Nadu Districts'
    });

    // Extract values for classification
    const values = districtData.features.map(feature => {
      const props = feature.properties;
      
      if (filter.useWeightedCalculation && filter.selectedField === 'student_school_ratio') {
        return calculateWeightedField(props, 'total_students', 'unique_schools') || 0;
      }
      
      const value = props[filter.selectedField as keyof DistrictMigrationData];
      return typeof value === 'number' ? value : 0;
    });

    // Create color classification
    const classification = createQuantileClassification(
      values,
      filter.selectedField as string
    );
    console.log('District Classification:', classification, 'Values:', values.slice(0, 5));
    setColorClassification(classification);

    // Create style function using StyleFactory
    const styleFunction = (feature: any) => {
      debugger
      return StyleFactory.migration.districtStyle(
        feature, 
        classification, 
        filter.selectedField, 
        filter.useWeightedCalculation
      );
    };

    if (features instanceof VectorLayer) {
      // Add single click handler for showing details
      if (onFeatureClick) {
        features.set('singleClickHandler', (feature: any) => {
          console.log('District single clicked:', feature.getProperties());
          onFeatureClick(feature, 'district');
        });
      }
      
      // Add double click handler for navigation
      if (onFeatureDoubleClick) {
        features.set('doubleClickHandler', (feature: any) => {
          const districtCode = feature.getProperties().district_c;
          console.log('District double clicked - navigating:', { districtCode, feature: feature.getProperties() });
          onFeatureDoubleClick(feature, 'district');
          navigateToTalukView(districtCode);
          loadTalukData(districtCode);
        });
      }
    }

    return { layer: features, styleFunction };
  }, [districtData, filter, isMapReady, setColorClassification, onFeatureClick, onFeatureDoubleClick, navigateToTalukView, loadTalukData]);

  // Create styled layer for taluk data
  const createTalukLayer = useCallback(() => {
    console.log('createTalukLayer called:', { 
      hasTalukData: !!talukData, 
      isMapReady, 
      viewType: filter.viewType 
    });
    
    if (!talukData || !isMapReady || filter.viewType !== 'taluk') return null;

    const features = LayersFactory.createLayerByGeoJSONObject({
      geoJSONObj: talukData,
      id: TALUK_LAYER_ID,
      name: 'District Taluks'
    });

    // Extract values for classification
    const values = talukData.features.map(feature => {
      const props = feature.properties;
      
      if (filter.useWeightedCalculation && filter.selectedField === 'student_school_ratio') {
        return calculateWeightedField(props, 'total_students', 'unique_schools') || 0;
      }
      
      const value = props[filter.selectedField as keyof TalukMigrationData];
      return typeof value === 'number' ? value : 0;
    });

    // Create color classification
    const classification = createEqualIntervalClassification(
      values,
      filter.selectedField as string
    );
    console.log('Taluk Classification:', classification, 'Values:', values.slice(0, 5));
    setColorClassification(classification);

    // Create style function using StyleFactory
    const styleFunction = (feature: any) => {
      return StyleFactory.migration.talukStyle(
        feature, 
        classification, 
        filter.selectedField, 
        filter.useWeightedCalculation
      );
    };

    if (features instanceof VectorLayer) {
      // Add single click handler for showing details
      if (onFeatureClick) {
        features.set('singleClickHandler', (feature: any) => {
          console.log('Taluk single clicked:', feature.getProperties());
          onFeatureClick(feature, 'taluk');
        });
      }
      
      // Add double click handler for village view (Ambattur only)
      if (onFeatureDoubleClick) {
        features.set('doubleClickHandler', (feature: any) => {
          console.log('Taluk double clicked:', feature.getProperties());
          onFeatureDoubleClick(feature, 'taluk');
          // Village view will be implemented later if needed
        });
      }
    }

    return { layer: features, styleFunction };
  }, [talukData, filter, isMapReady, setColorClassification, onFeatureClick, onFeatureDoubleClick]);

  // Load and display district layer
  useEffect(() => {
    console.log('District layer useEffect triggered:', { 
      isMapReady, 
      hasMap: !!map, 
      viewType: filter.viewType, 
      hasDistrictData: !!districtData 
    });
    
    if (!isMapReady || !map || filter.viewType !== 'district') return;

    const result = createDistrictLayer();
    console.log('District layer created:', result);

    if (result) {
      addLayer(result.layer, result.styleFunction);
      // Zoom to Tamil Nadu district boundaries on initial load
      if (previousMode !== 'district') {
        zoomToLayer(result.layer);
        setPreviousMode('district');
      }
      // Hide other layers
      removeLayer(TALUK_LAYER_ID);
      removeLayer(SCHOOL_LAYER_ID);
    }

    return () => {
      // Cleanup is handled by the addLayer function (removes existing layers with same ID)
    };
  }, [isMapReady, map, filter.viewType, filter.selectedField, filter.useWeightedCalculation, createDistrictLayer, addLayer, removeLayer, zoomToLayer, districtData]);

  // Load and display taluk layer
  useEffect(() => {
    console.log('Taluk layer useEffect triggered:', { 
      isMapReady, 
      hasMap: !!map, 
      viewType: filter.viewType, 
      hasTalukData: !!talukData 
    });
    
    if (!isMapReady || !map || filter.viewType !== 'taluk') return;

    const result = createTalukLayer();
    console.log('Taluk layer created:', result);
    
    if (result) {
      addLayer(result.layer, result.styleFunction);
      if (previousMode !== 'taluk') {
        zoomToLayer(result.layer);
        setPreviousMode('taluk');
      }
      // Hide other layers
      removeLayer(DISTRICT_LAYER_ID);
      removeLayer(SCHOOL_LAYER_ID);
    }

    return () => {
      // Cleanup is handled by the addLayer function
    };
  }, [isMapReady, map, filter.viewType, filter.selectedField, filter.useWeightedCalculation, createTalukLayer, addLayer, removeLayer, zoomToLayer, talukData]);

  // Monitor view type changes
  useEffect(() => {
    console.log('View type changed to:', filter.viewType);
  }, [filter.viewType]);

  // Clear taluk data when switching back to district view
  useEffect(() => {
    if (filter.viewType === 'district') {
      clearTalukData();
      removeLayer(TALUK_LAYER_ID);
    }
  }, [filter.viewType, clearTalukData, removeLayer]);

  return null; // This component doesn't render anything directly
}