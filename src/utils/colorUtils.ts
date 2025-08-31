/**
 * Color utilities for data classification and map styling
 */

import { ColorClassification } from '@/types/migrationData';

/**
 * Red color palette from white to dark red (5 bands)
 */
export const RED_COLOR_PALETTE = [
  '#ffffff', // Band 0: White (no data/minimum)
  '#ffcccc', // Band 1: Very light red
  '#ff9999', // Band 2: Light red  
  '#ff4d4d', // Band 3: Medium red
  '#cc0000'  // Band 4: Dark red
] as const;

/**
 * Alternative red gradient palette
 */
export const RED_GRADIENT_PALETTE = [
  '#fef0f0', // Almost white
  '#fcbba1', // Light pink-red
  '#fc9272', // Pink-red
  '#fb6a4a', // Red
  '#cb181d'  // Dark red
] as const;

/**
 * Creates color classification breaks using equal intervals
 */
export function createEqualIntervalClassification(
  values: number[],
  fieldName: string,
  numClasses: number = 5
): ColorClassification {
  // Filter out null, undefined, and non-numeric values
  const validValues = values.filter(val => 
    typeof val === 'number' && !isNaN(val) && isFinite(val)
  );
  
  if (validValues.length === 0) {
    return {
      min: 0,
      max: 0,
      breaks: [0],
      colors: [RED_COLOR_PALETTE[0]],
      field: fieldName
    };
  }
  
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  
  // Handle case where all values are the same
  if (min === max) {
    return {
      min,
      max,
      breaks: [min, max],
      colors: [RED_COLOR_PALETTE[0], RED_COLOR_PALETTE[numClasses - 1]],
      field: fieldName
    };
  }
  
  // Calculate equal intervals
  const interval = (max - min) / (numClasses - 1);
  const breaks: number[] = [];
  
  for (let i = 0; i < numClasses; i++) {
    breaks.push(min + (interval * i));
  }
  
  // Ensure the last break is exactly the maximum
  breaks[numClasses - 1] = max;
  
  return {
    min,
    max,
    breaks,
    colors: RED_COLOR_PALETTE.slice(0, numClasses),
    field: fieldName
  };
}

/**
 * Creates color classification using quantile method
 */
export function createQuantileClassification(
  values: number[],
  fieldName: string,
  numClasses: number = 5
): ColorClassification {
  const validValues = values.filter(val => 
    typeof val === 'number' && !isNaN(val) && isFinite(val)
  ).sort((a, b) => a - b);
  
  if (validValues.length === 0) {
    return {
      min: 0,
      max: 0,
      breaks: [0],
      colors: [RED_COLOR_PALETTE[0]],
      field: fieldName
    };
  }
  
  const min = validValues[0];
  const max = validValues[validValues.length - 1];
  
  if (min === max) {
    return {
      min,
      max,
      breaks: [min, max],
      colors: [RED_COLOR_PALETTE[0], RED_COLOR_PALETTE[numClasses - 1]],
      field: fieldName
    };
  }
  
  const breaks: number[] = [min];
  
  // Calculate quantile breaks
  for (let i = 1; i < numClasses - 1; i++) {
    const quantileIndex = Math.floor((validValues.length * i) / (numClasses - 1));
    breaks.push(validValues[quantileIndex]);
  }
  
  breaks.push(max);
  
  return {
    min,
    max,
    breaks,
    colors: RED_COLOR_PALETTE.slice(0, numClasses),
    field: fieldName
  };
}

/**
 * Gets the appropriate color for a value based on classification
 */
export function getColorForValue(
  value: number | null | undefined,
  classification: ColorClassification
): string {
  // Handle null/undefined/invalid values
  if (value == null || isNaN(value) || !isFinite(value)) {
    return classification.colors[0]; // Return white for no data
  }
  
  const { breaks, colors } = classification;
  
  // Handle edge cases
  if (value <= breaks[0]) return colors[0];
  if (value >= breaks[breaks.length - 1]) return colors[colors.length - 1];
  
  // Find the appropriate color band
  for (let i = 0; i < breaks.length - 1; i++) {
    if (value >= breaks[i] && value < breaks[i + 1]) {
      return colors[i];
    }
  }
  
  // Default to last color
  return colors[colors.length - 1];
}

/**
 * Creates a legend configuration for the classification
 */
export interface LegendItem {
  color: string;
  label: string;
  min: number;
  max: number;
}

export function createLegend(classification: ColorClassification): LegendItem[] {
  const { breaks, colors, field } = classification;
  const legend: LegendItem[] = [];
  
  for (let i = 0; i < colors.length - 1; i++) {
    const min = breaks[i];
    const max = breaks[i + 1];
    
    let label: string;
    if (i === 0 && min === 0) {
      label = `No data`;
    } else if (i === colors.length - 2) {
      label = `${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else {
      label = `${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    
    legend.push({
      color: colors[i],
      label,
      min,
      max
    });
  }
  
  return legend;
}

/**
 * Calculate weighted field (students per school)
 */
export function calculateWeightedField<T extends Record<string, any>>(
  feature: T,
  numeratorField: keyof T,
  denominatorField: keyof T
): number | null {
  const numerator = feature[numeratorField];
  const denominator = feature[denominatorField];
  
  if (typeof numerator !== 'number' || typeof denominator !== 'number' || 
      numerator == null || denominator == null || 
      denominator === 0 || isNaN(numerator) || isNaN(denominator)) {
    return null;
  }
  
  return numerator / denominator;
}

/**
 * Formats number for display in legends and tooltips
 */
export function formatNumberForDisplay(value: number | null | undefined): string {
  if (value == null || isNaN(value) || !isFinite(value)) {
    return 'No data';
  }
  
  if (value < 1) {
    return value.toFixed(2);
  } else if (value < 1000) {
    return Math.round(value).toLocaleString();
  } else {
    return value.toLocaleString();
  }
}