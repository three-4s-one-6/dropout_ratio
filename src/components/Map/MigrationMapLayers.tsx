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
const VILLAGE_LAYER_ID = 'migration-villages';

interface MigrationMapLayersProps {
  onFeatureClick?: (feature: any, layerType: 'district' | 'taluk' | 'school' | 'village') => void;
  onFeatureDoubleClick?: (feature: any, layerType: 'district' | 'taluk' | 'school' | 'village') => void;
  showAmbatturSchools?: boolean;
}

export default function MigrationMapLayers({ onFeatureClick, onFeatureDoubleClick, showAmbatturSchools = false }: MigrationMapLayersProps) {
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
    villageData,
    ambatturSchoolsData,
    loadTalukData,
    loadVillageData,
    loadAmbatturSchools,
    clearTalukData,
    clearVillageData,
    clearAmbatturSchools 
  } = useMigrationData();
  
  const { 
    filter,
    colorClassification,
    setColorClassification,
    navigateToTalukView,
    navigateToAmbatturVillageView 
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
          const props = feature.getProperties();
          console.log('Taluk double clicked:', props);
          onFeatureDoubleClick(feature, 'taluk');
          
          // Navigate to village view if this is Ambattur taluk
          if (props.taluk_name === 'Ambattur' || props.talukname === 'Ambattur') {
            console.log('Navigating to Ambattur village view');
            navigateToAmbatturVillageView();
            loadVillageData();
          }
        });
      }
    }

    return { layer: features, styleFunction };
  }, [talukData, filter, isMapReady, setColorClassification, onFeatureClick, onFeatureDoubleClick, navigateToAmbatturVillageView, loadVillageData]);

  // Create styled layer for Ambattur schools data
  const createAmbatturSchoolsLayer = useCallback((showLayer: boolean) => {
    console.log('createAmbatturSchoolsLayer called:', { 
      hasAmbatturSchoolsData: !!ambatturSchoolsData, 
      isMapReady, 
      showLayer,
      viewType: filter.viewType
    });
    
    if (!ambatturSchoolsData || !isMapReady || !showLayer || filter.viewType !== 'village') return null;

    const features = LayersFactory.createLayerByGeoJSONObject({
      geoJSONObj: ambatturSchoolsData,
      id: SCHOOL_LAYER_ID,
      name: 'Ambattur Schools'
    });

    // Create style function using StyleFactory (simple point style for schools)
    const styleFunction = (feature: any) => {
      return StyleFactory.migration.schoolStyle(feature);
    };

    if (features instanceof VectorLayer) {
      // Add single click handler for showing details
      if (onFeatureClick) {
        features.set('singleClickHandler', (feature: any) => {
          console.log('Ambattur school single clicked:', feature.getProperties());
          onFeatureClick(feature, 'school');
        });
      }
      
      // Set layerType for easy identification
      features.set('layerType', 'school');
      
      // Add hover style
      features.setStyle((feature: any, resolution: number) => {
        if (feature.get('isHovered')) {
          return StyleFactory.migration.schoolHoverStyle(feature);
        }
        return styleFunction(feature);
      });
    }

    return { layer: features, styleFunction };
  }, [ambatturSchoolsData, isMapReady, filter.viewType, onFeatureClick]);

  // Create styled layer for village data (Ambattur)
  const createVillageLayer = useCallback(() => {
    console.log('createVillageLayer called:', { 
      hasVillageData: !!villageData, 
      isMapReady, 
      viewType: filter.viewType 
    });
    
    if (!villageData || !isMapReady || filter.viewType !== 'village') return null;

    const features = LayersFactory.createLayerByGeoJSONObject({
      geoJSONObj: villageData,
      id: VILLAGE_LAYER_ID,
      name: 'Ambattur Villages'
    });

    // Extract values for classification (similar to taluk data)
    const values = villageData.features.map((feature: any) => {
      const props = feature.properties;
      
      if (filter.useWeightedCalculation && filter.selectedField === 'student_school_ratio') {
        return calculateWeightedField(props, 'total_students', 'unique_schools') || 0;
      }
      
      const value = props[filter.selectedField];
      return typeof value === 'number' ? value : 0;
    });

    // Create color classification
    const classification = createEqualIntervalClassification(
      values,
      filter.selectedField as string
    );
    console.log('Village Classification:', classification, 'Values:', values.slice(0, 5));
    setColorClassification(classification);

    // Create style function using StyleFactory
    const styleFunction = (feature: any) => {
      return StyleFactory.migration.villageStyle(
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
          console.log('Village single clicked:', feature.getProperties());
          onFeatureClick(feature, 'village');
        });
      }
      
      // Set layerType for easy identification
      features.set('layerType', 'village');
    }

    return { layer: features, styleFunction };
  }, [villageData, filter, isMapReady, setColorClassification, onFeatureClick]);

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

  // Load and display village layer (for Ambattur)
  useEffect(() => {
    console.log('Village layer useEffect triggered:', { 
      isMapReady, 
      hasMap: !!map, 
      viewType: filter.viewType, 
      hasVillageData: !!villageData,
      selectedTaluk: filter.selectedTaluk
    });
    
    if (!isMapReady || !map || filter.viewType !== 'village' || filter.selectedTaluk !== 'Ambattur') return;

    // Load village data if not loaded
    if (!villageData) {
      loadVillageData();
      return;
    }

    const result = createVillageLayer();
    console.log('Village layer created:', result);
    
    if (result) {
      addLayer(result.layer, result.styleFunction);
      if (previousMode !== 'village') {
        zoomToLayer(result.layer);
        setPreviousMode('village');
      }
      // Hide other layers
      removeLayer(DISTRICT_LAYER_ID);
      removeLayer(TALUK_LAYER_ID);
      
      // Handle Ambattur schools layer if enabled
      if (showAmbatturSchools) {
        if (!ambatturSchoolsData) {
          loadAmbatturSchools();
        } else {
          const schoolResult = createAmbatturSchoolsLayer(true);
          if (schoolResult) {
            addLayer(schoolResult.layer, schoolResult.styleFunction);
          }
        }
      } else {
        // Remove schools layer if disabled
        removeLayer(SCHOOL_LAYER_ID);
      }
    }

    return () => {
      // Cleanup is handled by the addLayer function
    };
  }, [isMapReady, map, filter.viewType, filter.selectedTaluk, filter.selectedDistrict, villageData, ambatturSchoolsData, showAmbatturSchools, loadVillageData, loadAmbatturSchools, createVillageLayer, createAmbatturSchoolsLayer, addLayer, removeLayer, zoomToLayer]);

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
  
  // Clear Ambattur schools data when switching away from village view
  useEffect(() => {
    if (filter.viewType !== 'village') {
      clearAmbatturSchools();
      removeLayer(SCHOOL_LAYER_ID);
    }
  }, [filter.viewType, clearAmbatturSchools, removeLayer]);
  
  // Clear village data when switching away from village view
  useEffect(() => {
    if (filter.viewType !== 'village') {
      clearVillageData();
      removeLayer(VILLAGE_LAYER_ID);
    }
  }, [filter.viewType, clearVillageData, removeLayer]);

  return null; // This component doesn't render anything directly
}