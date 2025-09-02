'use client';

import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useFilter } from '@/providers/FilterProvider';
import { useMigrationData } from '@/hooks/useMigrationData';
import { VISUALIZABLE_FIELDS, AMBATTUR_VILLAGE_FIELDS } from '@/types/migrationData';
import { DISTRICT_MAPPING } from '@/utils/dataPaths';
import { calculateWeightedField } from '@/utils/colorUtils';

interface DashboardProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Dashboard({ isMinimized, onToggleMinimize }: DashboardProps) {
  const { filter } = useFilter();
  const { districtData, talukData, villageData } = useMigrationData();

  // Process state-level data for district view
  const stateData = useMemo(() => {
    if (!districtData) return [];
    
    return districtData.features.map(feature => {
      const props = feature.properties;
      let value;
      
      if (filter.useWeightedCalculation && filter.selectedField === 'student_school_ratio') {
        value = calculateWeightedField(props, 'total_students', 'unique_schools') || 0;
      } else {
        value = props[filter.selectedField] || 0;
      }
      
      return {
        name: props.dist_name,
        value: value,
        total_students: props.total_students || 0,
        unique_schools: props.unique_schools || 0,
        male_students: props.male_students || 0,
        female_students: props.female_students || 0
      };
    }).sort((a, b) => b.value - a.value);
  }, [districtData, filter.selectedField, filter.useWeightedCalculation]);

  // Process district-level data for taluk view
  const districtTalukData = useMemo(() => {
    if (!talukData) return [];
    
    // Map district field names to taluk field names
    const mapDistrictFieldToTalukField = (fieldName: string): string => {
      const fieldMapping: Record<string, string> = {
        'government_schools': 'government_students',
        'private_schools': 'private_students', 
        'fully_aided_schools': 'aided_students'
      };
      return fieldMapping[fieldName] || fieldName;
    };
    
    const processedData = talukData.features.map((feature: any) => {
      const props = feature.properties;
      let value;
      
      if (filter.useWeightedCalculation && filter.selectedField === 'student_school_ratio') {
        value = calculateWeightedField(props, 'total_students', 'unique_schools') || 0;
      } else {
        const talukFieldName = mapDistrictFieldToTalukField(filter.selectedField);
        value = props[talukFieldName] || 0;
      }
      
      return {
        name: props.talukname || props.taluk_name || props.name || 'Unknown Taluk',
        value: value,
        total_students: props.total_students || 0,
        unique_schools: props.unique_schools || 0,
        male_students: props.male_students || 0,
        female_students: props.female_students || 0
      };
    }).sort((a: any, b: any) => b.value - a.value);
    
    return processedData;
  }, [talukData, filter.selectedField, filter.useWeightedCalculation]);

  // Process village data for Ambattur
  const ambatturVillageData = useMemo(() => {
    if (!villageData || filter.selectedTaluk !== 'Ambattur') return [];
    
    return villageData.features.map((feature: any) => {
      const props = feature.properties;
      let value;
      
      if (filter.useWeightedCalculation && filter.selectedField === 'student_school_ratio') {
        value = calculateWeightedField(props, 'total_students', 'unique_schools') || 0;
      } else {
        value = props[filter.selectedField] || 0;
      }
      
      return {
        name: props.vill_name || props.village_name,
        value: value,
        total_students: props.total_students || 0,
        male_students: props.male_students || 0,
        female_students: props.female_students || 0
      };
    }).sort((a, b) => b.value - a.value);
  }, [villageData, filter.selectedField, filter.useWeightedCalculation, filter.selectedTaluk]);

  // Get current field label
  const getFieldLabel = () => {
    if (filter.viewType === 'village' && filter.selectedTaluk === 'Ambattur') {
      return AMBATTUR_VILLAGE_FIELDS[filter.selectedField] || filter.selectedField;
    }
    
    // For taluk view, we need to map the labels appropriately
    if (filter.viewType === 'taluk') {
      const labelMapping: Record<string, string> = {
        'government_schools': 'Government Students',
        'private_schools': 'Private Students',
        'fully_aided_schools': 'Aided Students'
      };
      return labelMapping[filter.selectedField] || VISUALIZABLE_FIELDS[filter.selectedField] || filter.selectedField;
    }
    
    return VISUALIZABLE_FIELDS[filter.selectedField] || filter.selectedField;
  };

  // Get summary statistics
  const getSummaryStats = () => {
    let data: any[] = [];
    
    switch (filter.viewType) {
      case 'district':
        data = stateData;
        break;
      case 'taluk':
        data = districtTalukData;
        break;
      case 'village':
        data = ambatturVillageData;
        break;
    }
    
    if (data.length === 0) return null;
    
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    const avgValue = totalValue / data.length;
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));
    
    return {
      total: totalValue,
      average: avgValue,
      max: maxValue,
      min: minValue,
      count: data.length
    };
  };

  const summaryStats = getSummaryStats();

  if (isMinimized) {
    return (
      <button
        onClick={onToggleMinimize}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-r-lg p-2 shadow-lg hover:bg-gray-50 z-20"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600">
            {filter.viewType === 'district' && 'Tamil Nadu State Overview'}
            {filter.viewType === 'taluk' && `${DISTRICT_MAPPING[filter.selectedDistrict]?.name} District`}
            {filter.viewType === 'village' && `${filter.selectedTaluk} Villages`}
          </p>
        </div>
        <button
          onClick={onToggleMinimize}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Summary Statistics */}
        {summaryStats && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              {getFieldLabel()} - Summary
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{summaryStats.total.toLocaleString()}</div>
                <div className="text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{Math.round(summaryStats.average).toLocaleString()}</div>
                <div className="text-gray-600">Average</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{summaryStats.max.toLocaleString()}</div>
                <div className="text-gray-600">Highest</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{summaryStats.min.toLocaleString()}</div>
                <div className="text-gray-600">Lowest</div>
              </div>
            </div>
          </div>
        )}

        {/* State Level Charts (District View) */}
        {filter.viewType === 'district' && stateData.length > 0 && (
          <>
            {/* Top 10 Districts Bar Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Top 10 Districts - {getFieldLabel()}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stateData.slice(0, 10)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), getFieldLabel()]}
                    labelStyle={{ fontSize: '12px' }}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Distribution Pie Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Gender Distribution (State Total)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: 'Male Students',
                        value: stateData.reduce((sum, item) => sum + item.male_students, 0),
                        fill: '#3B82F6'
                      },
                      {
                        name: 'Female Students',
                        value: stateData.reduce((sum, item) => sum + item.female_students, 0),
                        fill: '#EC4899'
                      }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#EC4899" />
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Students']}
                    contentStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* District Level Charts (Taluk View) */}
        {filter.viewType === 'taluk' && districtTalukData.length > 0 && (
          <>
            {/* Taluk Comparison Bar Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Taluks in {DISTRICT_MAPPING[filter.selectedDistrict]?.name} - {getFieldLabel()}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={districtTalukData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), getFieldLabel()]}
                    labelStyle={{ fontSize: '12px' }}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line chart showing progression */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Taluk Progression
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={districtTalukData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), getFieldLabel()]}
                    labelStyle={{ fontSize: '12px' }}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Ambattur Specific Charts (Village View) */}
        {filter.viewType === 'village' && filter.selectedTaluk === 'Ambattur' && ambatturVillageData.length > 0 && (
          <>
            {/* Village Comparison Area Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Ambattur Villages - {getFieldLabel()}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={ambatturVillageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), getFieldLabel()]}
                    labelStyle={{ fontSize: '12px' }}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F59E0B" 
                    fill="#FEF3C7" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Distribution for Ambattur Villages */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Ambattur Gender Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: 'Male Students',
                        value: ambatturVillageData.reduce((sum, item) => sum + item.male_students, 0),
                        fill: '#3B82F6'
                      },
                      {
                        name: 'Female Students',
                        value: ambatturVillageData.reduce((sum, item) => sum + item.female_students, 0),
                        fill: '#EC4899'
                      }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#EC4899" />
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Students']}
                    contentStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Villages Bar Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Top Villages by {getFieldLabel()}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ambatturVillageData.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), getFieldLabel()]}
                    labelStyle={{ fontSize: '12px' }}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="value" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* No data message */}
        {((filter.viewType === 'district' && stateData.length === 0) ||
          (filter.viewType === 'taluk' && districtTalukData.length === 0) ||
          (filter.viewType === 'village' && ambatturVillageData.length === 0)) && (
          <div className="text-center py-8 text-gray-500">
            <p>No data available for current selection</p>
            <p className="text-sm">Try selecting a different area or field</p>
          </div>
        )}
      </div>
    </div>
  );
}