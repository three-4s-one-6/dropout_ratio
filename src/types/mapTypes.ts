/**
 * Map-related types and enums
 */

export enum MapTypes {
  Default = 'default',
  Satellite = 'satellite',
  ESRI = 'esri',
  TOPO = 'topo',
}

export type BaseMapState = 'OSM' | 'GOOGLE' | 'ESRI' | 'CARTO';