'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import FilterPanel from './FilterPanel';
import { useFilter } from '@/providers/FilterProvider';
import { useMigrationData } from '@/hooks/useMigrationData';

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className = '' }: DashboardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { filter, colorClassification } = useFilter();
  const { districtData, talukData, isLoading, error } = useMigrationData();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Get current data summary
  const getCurrentDataSummary = () => {
    if (filter.viewType === 'district' && districtData) {
      return {
        type: 'Districts',
        count: districtData.features.length,
        title: 'Tamil Nadu Districts'
      };
    } else if (filter.viewType === 'taluk' && talukData) {
      return {
        type: 'Taluks',
        count: talukData.features.length,
        title: `District Taluks`
      };
    }
    return null;
  };

  const dataSummary = getCurrentDataSummary();

  return (
    <div className={`relative bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-0' : 'w-80'
    } ${className}`}>
      
      {/* Toggle button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-r-md px-1 py-2 hover:bg-gray-50 z-10"
        title={isCollapsed ? 'Open dashboard' : 'Close dashboard'}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Dashboard content */}
      <div className={`h-full flex flex-col transition-opacity duration-300 ${
        isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Migration Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Tamil Nadu Student Migration Analysis
          </p>
        </div>

        {/* Data summary */}
        {dataSummary && (
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dataSummary.count}
              </div>
              <div className="text-sm text-blue-700">
                {dataSummary.type} Loaded
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center text-sm text-yellow-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              Loading data...
            </div>
          </div>
        )}

        {/* Filter panel */}
        <div className="flex-1 overflow-y-auto">
          <FilterPanel />
        </div>

        {/* Simple stats section */}
        {colorClassification && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Data Range
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Min:</span>
                <span className="ml-1 font-medium">
                  {colorClassification.min.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Max:</span>
                <span className="ml-1 font-medium">
                  {colorClassification.max.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Click on map features to drill down
          </p>
        </div>
      </div>
    </div>
  );
}