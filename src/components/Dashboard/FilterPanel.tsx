'use client';

import { useFilter } from '@/providers/FilterProvider';
import { VISUALIZABLE_FIELDS, VisualizableField } from '@/types/migrationData';
import { DISTRICT_MAPPING } from '@/utils/dataPaths';

interface FilterPanelProps {
  className?: string;
}

export default function FilterPanel({ className = '' }: FilterPanelProps) {
  const {
    filter,
    colorClassification,
    setSelectedField,
    setUseWeightedCalculation,
    resetToDistrictView,
  } = useFilter();

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const field = event.target.value as VisualizableField;
    setSelectedField(field);
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
    <div className={`bg-white p-4 border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Map Filters
        </h2>
        <p className="text-sm text-gray-600">
          {getCurrentViewTitle()}
        </p>
      </div>

      {/* Navigation breadcrumb */}
      <div className="mb-4">
        <nav className="flex text-sm">
          <button
            onClick={resetToDistrictView}
            className="text-blue-600 hover:text-blue-800"
          >
            Districts
          </button>
          {filter.selectedDistrict && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">
                {DISTRICT_MAPPING[filter.selectedDistrict]?.name}
              </span>
            </>
          )}
          {filter.selectedTaluk && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{filter.selectedTaluk}</span>
            </>
          )}
        </nav>
      </div>

      {/* Field selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visualization Field
        </label>
        <select
          value={filter.selectedField}
          onChange={handleFieldChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {Object.entries(VISUALIZABLE_FIELDS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Weighted calculation option */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filter.useWeightedCalculation}
            onChange={handleWeightedChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            Calculate students per school ratio
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Divides total students by number of unique schools
        </p>
      </div>

      {/* Color legend */}
      {colorClassification && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Legend</h3>
          <div className="space-y-2">
            {colorClassification.colors.map((color, index) => {
              const isLast = index === colorClassification.colors.length - 1;
              const min = colorClassification.breaks[index];
              const max = isLast 
                ? colorClassification.breaks[index + 1] 
                : colorClassification.breaks[index + 1];
              
              let label: string;
              if (index === 0 && min === 0) {
                label = 'No data';
              } else if (isLast) {
                label = `${min?.toLocaleString()} - ${max?.toLocaleString()}`;
              } else {
                label = `${min?.toLocaleString()} - ${max?.toLocaleString()}`;
              }

              return (
                <div key={index} className="flex items-center text-xs">
                  <div
                    className="w-4 h-4 border border-gray-300 mr-2 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-600">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Field info */}
      <div className="bg-gray-50 p-3 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-1">
          Selected Field
        </h4>
        <p className="text-sm text-gray-900">
          {VISUALIZABLE_FIELDS[filter.selectedField]}
        </p>
        {filter.useWeightedCalculation && (
          <p className="text-xs text-blue-600 mt-1">
            Showing calculated ratio per school
          </p>
        )}
      </div>

      {/* View type info */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>District view:</strong> Click district to view taluks
        </p>
        <p>
          <strong>Taluk view:</strong> Click taluk to view villages (Ambattur only)
        </p>
      </div>
    </div>
  );
}