'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { useCallback } from 'react';

// Import existing map utilities
import { satelliteSource, osmSource, BASEMAP_STR } from '@/map_lib/MapUtils';
import { TAMIL_NADU_CENTER, TAMIL_NADU_EXTENT } from '@/utils/dataPaths';

interface MigrationMapContextProps {
  map: Map;
  activeLayer: string;
  changeActiveLayer: (layer: string) => void;
  isMapReady: boolean;
}

const MigrationMapContext = createContext<MigrationMapContextProps | undefined>(undefined);

export const MigrationMapProvider = ({ 
  children, 
  baseLayer = 'osm' 
}: { 
  children: React.ReactNode;
  baseLayer?: 'satellite' | 'osm';
}) => {
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [activeLayer, setActiveLayer] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Choose base layer source
    let baseLayerSource = baseLayer === 'satellite' ? satelliteSource : osmSource;

    const initialBaseLayer = new TileLayer({
      preload: Infinity,
      source: baseLayerSource,
      properties: { id: BASEMAP_STR },
    });

    // Create map centered on Tamil Nadu without extent constraints
    const newMap = new Map({
      layers: [initialBaseLayer],
      view: new View({
        center: fromLonLat(TAMIL_NADU_CENTER),
        zoom: 7,
        // Removed extent constraint for better navigation experience
      }),
      controls: defaultControls().extend([]),
    });

    setMapInstance(newMap);
    setIsMapReady(true);

    // Cleanup function
    return () => {
      newMap.setTarget(undefined);
    };
  }, [baseLayer]);

  const changeActiveLayer = useCallback((layerId: string) => {
    setActiveLayer(layerId);
  }, []);

  const contextValue: MigrationMapContextProps = {
    map: mapInstance!,
    activeLayer,
    changeActiveLayer,
    isMapReady,
  };

  return (
    <MigrationMapContext.Provider value={contextValue}>
      {children}
    </MigrationMapContext.Provider>
  );
};

export const useMigrationMap = () => {
  const context = useContext(MigrationMapContext);
  if (context === undefined) {
    throw new Error('useMigrationMap must be used within MigrationMapProvider');
  }
  return context;
};