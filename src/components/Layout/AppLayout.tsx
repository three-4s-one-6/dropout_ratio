'use client';

import React from 'react';
import MapContainer from '../Map/MapContainer';
import Dashboard from '../Dashboard/Dashboard';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const handleFeatureClick = (feature: any, layerType: 'district' | 'taluk' | 'school') => {
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
        </div>
      </div>

      {/* Additional children content */}
      {children}
    </div>
  );
}