'use client';

import { useEffect, useRef } from 'react';
import { useMigrationMap } from '@/providers/MigrationMapProvider';
import MigrationMapLayers from './MigrationMapLayers';
import MapLegend from './MapLegend';
import MapFilterMenu from './MapFilterMenu';

interface MapContainerProps {
  className?: string;
  onFeatureClick?: (feature: any, layerType: 'district' | 'taluk' | 'school') => void;
  onFeatureDoubleClick?: (feature: any, layerType: 'district' | 'taluk' | 'school') => void;
}

export default function MapContainer({ 
  className = '',
  onFeatureClick,
  onFeatureDoubleClick 
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, isMapReady } = useMigrationMap();

  // Initialize map target
  useEffect(() => {
    if (map && mapRef.current && isMapReady) {
      map.setTarget(mapRef.current);
      
      let handleSingleClick: any = null;
      let handleDoubleClick: any = null;
      
      // Add single click handler for showing feature details
      if (onFeatureClick) {
        handleSingleClick = (event: any) => {
          console.log('Map single clicked at pixel:', event.pixel);
          map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
            console.log('Feature found on single click:', feature, 'Layer:', layer);
            const singleClickHandler = layer?.get('singleClickHandler');
            if (singleClickHandler && typeof singleClickHandler === 'function') {
              console.log('Calling single click handler for feature:', feature.getProperties());
              singleClickHandler(feature);
            }
          });
        };

        map.on('singleclick', handleSingleClick);
      }
      
      // Add double click handler for navigation
      if (onFeatureDoubleClick) {
        handleDoubleClick = (event: any) => {
          console.log('Map double clicked at pixel:', event.pixel);
          map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
            console.log('Feature found on double click:', feature, 'Layer:', layer);
            const doubleClickHandler = layer?.get('doubleClickHandler');
            if (doubleClickHandler && typeof doubleClickHandler === 'function') {
              console.log('Calling double click handler for feature:', feature.getProperties());
              doubleClickHandler(feature);
            }
          });
        };

        map.on('dblclick', handleDoubleClick);
      }

      // Cleanup
      return () => {
        if (handleSingleClick) map.un('singleclick', handleSingleClick);
        if (handleDoubleClick) map.un('dblclick', handleDoubleClick);
      };
    }
  }, [map, isMapReady, onFeatureClick, onFeatureDoubleClick]);

  // Cleanup map target on unmount
  useEffect(() => {
    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, [map]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gray-100"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map layers component */}
      {isMapReady && (
        <MigrationMapLayers 
          onFeatureClick={onFeatureClick}
          onFeatureDoubleClick={onFeatureDoubleClick}
        />
      )}
      
      {/* Map Filter Menu Overlay */}
      {isMapReady && <MapFilterMenu />}
      
      {/* Map Legend Overlay */}
      {isMapReady && <MapLegend />}
      
      {/* Loading indicator */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}