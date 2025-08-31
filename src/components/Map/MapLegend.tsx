'use client';

import { useFilter } from '@/providers/FilterProvider';
import { VISUALIZABLE_FIELDS } from '@/types/migrationData';
import { createLegend } from '@/utils/colorUtils';

export default function MapLegend() {
  const { filter, colorClassification } = useFilter();

  if (!colorClassification) return null;

  const legendItems = createLegend(colorClassification);

  return (
    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs z-10">
      {/* Legend Title */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          {VISUALIZABLE_FIELDS[filter.selectedField]}
        </h3>
        {filter.useWeightedCalculation && (
          <p className="text-xs text-blue-600">
            Per School Ratio
          </p>
        )}
      </div>

      {/* Legend Items */}
      <div className="space-y-1.5">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center text-xs">
            <div
              className="w-4 h-4 border border-gray-300 mr-2 flex-shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700 leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Data Range Summary */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Min:</span>
            <span className="ml-1 font-medium text-gray-700">
              {colorClassification.min.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Max:</span>
            <span className="ml-1 font-medium text-gray-700">
              {colorClassification.max.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}