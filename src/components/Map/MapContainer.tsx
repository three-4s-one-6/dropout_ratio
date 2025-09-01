'use client';

import { useEffect, useRef, useState } from 'react';
import { useMigrationMap } from '@/providers/MigrationMapProvider';
import { useFilter } from '@/providers/FilterProvider';
import { VISUALIZABLE_FIELDS } from '@/types/migrationData';
import MigrationMapLayers from './MigrationMapLayers';
import MapLegend from './MapLegend';
import MapFilterMenu from './MapFilterMenu';

interface MapContainerProps {
  className?: string;
  onFeatureClick?: (feature: any, layerType: 'district' | 'taluk' | 'school' | 'village') => void;
  onFeatureDoubleClick?: (feature: any, layerType: 'district' | 'taluk' | 'school' | 'village') => void;
}

export default function MapContainer({ 
  className = '',
  onFeatureClick,
  onFeatureDoubleClick 
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, isMapReady } = useMigrationMap();
  const { filter } = useFilter();
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [showAmbatturSchools, setShowAmbatturSchools] = useState(false);

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
              const layerType = layer?.get('layerType') || 'district';
              setSelectedFeature({ feature, layerType });
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
          showAmbatturSchools={showAmbatturSchools}
        />
      )}
      
      {/* Map Filter Menu Overlay */}
      {isMapReady && (
        <MapFilterMenu 
          showAmbatturSchools={showAmbatturSchools}
          onToggleAmbatturSchools={setShowAmbatturSchools}
        />
      )}
      
      {/* Map Legend Overlay */}
      {isMapReady && <MapLegend />}
      
      {/* Selected feature info overlay */}
      {selectedFeature && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-medium text-gray-900 mb-2">
            Selected {selectedFeature.layerType}
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {selectedFeature.layerType === 'district' && (
              <>
                <p><strong>District:</strong> {selectedFeature.feature.getProperties().dist_name}</p>
                <p><strong>Total Students:</strong> {selectedFeature.feature.getProperties().total_students?.toLocaleString()}</p>
                <p><strong>Schools:</strong> {selectedFeature.feature.getProperties().unique_schools?.toLocaleString()}</p>
                <p><strong>{VISUALIZABLE_FIELDS[filter.selectedField]}:</strong> {selectedFeature.feature.getProperties()[filter.selectedField]?.toLocaleString()}</p>
                <p className="text-blue-600 text-xs mt-2">Double-click to view taluks</p>
              </>
            )}
            {selectedFeature.layerType === 'taluk' && (
              <>
                <p><strong>Taluk:</strong> {selectedFeature.feature.getProperties().talukname}</p>
                <p><strong>District:</strong> {selectedFeature.feature.getProperties().dist_name}</p>
                <p><strong>Total Students:</strong> {selectedFeature.feature.getProperties().total_students?.toLocaleString()}</p>
                <p><strong>Schools:</strong> {selectedFeature.feature.getProperties().unique_schools?.toLocaleString()}</p>
                <p><strong>{VISUALIZABLE_FIELDS[filter.selectedField]}:</strong> {selectedFeature.feature.getProperties()[filter.selectedField]?.toLocaleString()}</p>
              </>
            )}
            {selectedFeature.layerType === 'school' && (
              <>
                <p><strong>School:</strong> {selectedFeature.feature.getProperties().name}</p>
                <p><strong>District:</strong> {selectedFeature.feature.getProperties().district}</p>
                <p><strong>Block:</strong> {selectedFeature.feature.getProperties().block}</p>
                <p><strong>Management:</strong> {selectedFeature.feature.getProperties().management}</p>
                <p><strong>Category:</strong> {selectedFeature.feature.getProperties().category}</p>
                <p><strong>Students:</strong> {(selectedFeature.feature.getProperties().total_students || 'Data unavailable')}</p>
              </>
            )}
            {selectedFeature.layerType === 'village' && (
              <>
                <p><strong>Village:</strong> {selectedFeature.feature.getProperties().vill_name || selectedFeature.feature.getProperties().village_name}</p>
                <p><strong>Taluk:</strong> {selectedFeature.feature.getProperties().taluk_name}</p>
                <p><strong>District:</strong> {selectedFeature.feature.getProperties().district_name}</p>
                <p><strong>Total Students:</strong> {selectedFeature.feature.getProperties().total_students?.toLocaleString()}</p>
                <p><strong>Male Students:</strong> {selectedFeature.feature.getProperties().male_students?.toLocaleString()}</p>
                <p><strong>Female Students:</strong> {selectedFeature.feature.getProperties().female_students?.toLocaleString()}</p>
              </>
            )}
          </div>
          <button
            onClick={() => setSelectedFeature(null)}
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      )}
      
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