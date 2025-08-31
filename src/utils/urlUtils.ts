/**
 * URL utilities for map base layers and external resources
 */

export const URLS = {
  common: {
    baseMapUrls: {
      googleSourceUrl: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      esriSourceUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      topoSourceUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      cartoSourceUrl: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    },
  },
};

export const URL_UTILS = {
  // Add any URL utility functions here if needed
};