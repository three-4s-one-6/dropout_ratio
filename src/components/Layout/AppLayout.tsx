'use client';

import { useState } from 'react';
import MapContainer from '../Map/MapContainer';
import Dashboard from '../Dashboard/Dashboard';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const handleFeatureClick = (feature: any, layerType: 'district' | 'taluk' | 'school') => {
    setSelectedFeature({ feature, layerType });
    
    // Log feature click for debugging
    console.log(`Single clicked ${layerType}:`, feature.getProperties());
  };

  const handleFeatureDoubleClick = (feature: any, layerType: 'district' | 'taluk' | 'school') => {
    // Log feature double click for debugging
    console.log(`Double clicked ${layerType} - navigating:`, feature.getProperties());
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Tamil Nadu Student Migration Analysis
            </h1>
            <p className="text-sm text-gray-600">
              Interactive visualization of student dropout and migration patterns
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-IN')}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">        
        {/* Full-screen Map container */}
        <div className="flex-1 relative">
          <MapContainer 
            onFeatureClick={handleFeatureClick}
            onFeatureDoubleClick={handleFeatureDoubleClick}
            className="w-full h-full"
          />
          
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
                    <p><strong>Students per School:</strong> {selectedFeature.feature.getProperties().students_per_school?.toLocaleString()}</p>
                    <p className="text-blue-600 text-xs mt-2">Double-click to view taluks</p>
                  </>
                )}
                {selectedFeature.layerType === 'taluk' && (
                  <>
                    <p><strong>Taluk:</strong> {selectedFeature.feature.getProperties().talukname}</p>
                    <p><strong>District:</strong> {selectedFeature.feature.getProperties().dist_name}</p>
                    <p><strong>Total Students:</strong> {selectedFeature.feature.getProperties().total_students?.toLocaleString()}</p>
                    <p><strong>Schools:</strong> {selectedFeature.feature.getProperties().unique_schools?.toLocaleString()}</p>
                    <p><strong>Students per School:</strong> {selectedFeature.feature.getProperties().students_per_school?.toLocaleString()}</p>
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
        </div>
      </div>

      {/* Additional children content */}
      {children}
    </div>
  );
}