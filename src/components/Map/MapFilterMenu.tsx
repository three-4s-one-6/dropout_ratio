'use client';

import { useState } from 'react';
import { ChevronDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useFilter } from '@/providers/FilterProvider';
import { VISUALIZABLE_FIELDS, AMBATTUR_VILLAGE_FIELDS, VisualizableField } from '@/types/migrationData';
import { DISTRICT_MAPPING } from '@/utils/dataPaths';

interface MapFilterMenuProps {
  showAmbatturSchools?: boolean;
  onToggleAmbatturSchools?: (show: boolean) => void;
}

export default function MapFilterMenu({ 
  showAmbatturSchools = false, 
  onToggleAmbatturSchools 
}: MapFilterMenuProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    filter,
    setSelectedField,
    setUseWeightedCalculation,
    resetToDistrictView,
  } = useFilter();

  const handleFieldChange = (field: VisualizableField) => {
    setSelectedField(field);
    //setIsExpanded(false); // Collapse after selection
  };

  const handleWeightedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseWeightedCalculation(event.target.checked);
  };

  const getCurrentViewTitle = () => {
    switch (filter.viewType) {
      case 'district':
        return 'Tamil Nadu Districts';
      case 'taluk':
        const districtName = filter.selectedDistrict 
          ? DISTRICT_MAPPING[filter.selectedDistrict]?.name 
          : 'Unknown District';
        return `${districtName} Taluks`;
      case 'village':
        return `${filter.selectedTaluk} Villages`;
      default:
        return 'Map View';
    }
  };

  return (
    <div className="absolute top-2 left-2 z-10">
      {/* Compact Filter Button */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {VISUALIZABLE_FIELDS[filter.selectedField]}
              </div>
              <div className="text-xs text-gray-500">
                {getCurrentViewTitle()}
              </div>
            </div>
          </div>
          
        </button>

        {/* Expanded Menu */}
        {isExpanded && (
          <div className="border-t border-gray-200 bg-white max-w-[15rem] max-h-[25rem]">
            {/* Navigation Breadcrumb */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <nav className="flex text-xs">
                <button
                  onClick={() => {
                    resetToDistrictView();
                    //setIsExpanded(false);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Districts
                </button>
                {filter.selectedDistrict && (
                  <>
                    <span className="mx-1 text-gray-400">/</span>
                    <span className="text-gray-700">
                      {DISTRICT_MAPPING[filter.selectedDistrict]?.name}
                    </span>
                  </>
                )}
                {filter.selectedTaluk && (
                  <>
                    <span className="mx-1 text-gray-400">/</span>
                    <span className="text-gray-700">{filter.selectedTaluk}</span>
                  </>
                )}
              </nav>
            </div>

            {/* Field Selection based on view type */}
            <div className="px-4 py-3 max-h-60 overflow-y-auto">
              {filter.viewType === 'village' && filter.selectedTaluk === 'Ambattur' ? (
                <div className="space-y-3">
                  {/* Schools Layer Toggle for Ambattur */}
                  <div>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={showAmbatturSchools}
                        onChange={(e) => onToggleAmbatturSchools?.(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-gray-700 font-medium">
                        Show Schools Layer
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Display Ambattur schools on the map
                    </p>
                  </div>
                  
                  {/* Ambattur Village Fields */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">Village Data Fields</h4>
                    <div className="space-y-1">
                      {Object.entries(AMBATTUR_VILLAGE_FIELDS).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => handleFieldChange(key as any)}
                          className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-100 transition-colors duration-150 ${
                            filter.selectedField === key 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {Object.entries(VISUALIZABLE_FIELDS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleFieldChange(key as VisualizableField)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-100 transition-colors duration-150 ${
                        filter.selectedField === key 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weighted Calculation Option */}
            {/*
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filter.useWeightedCalculation}
                  onChange={handleWeightedChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                <span className="text-gray-700">
                  Calculate per school ratio
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Divides total students by unique schools
              </p>
            </div>
            */}
          </div>
        )}
      </div>

      {/* Usage Hint */}
      {!isExpanded && (
        <div className="mt-2 text-xs text-white bg-black/50 backdrop-blur-sm rounded px-2 py-1">
          Click districts/taluks to drill down
        </div>
      )}
    </div>
  );
}