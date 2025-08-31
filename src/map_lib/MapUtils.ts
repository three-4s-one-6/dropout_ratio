import { all } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import GeoTIFF from "ol/source/GeoTIFF";
import WebGLTile from "ol/layer/WebGLTile";



import { BaseMapState, MapTypes } from "@/types/mapTypes";
import { URL_UTILS, URLS } from "@/utils/urlUtils";
import { LayersFactory } from "@/map_lib/LayerFactory";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import { OSM, TileWMS, XYZ } from "ol/source";
import { Tile } from 'ol/layer'
import { detectProjection } from "@/map_lib/projectionUtils";



export const fetchGeoJson = async (url: string) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch GeoJSON:');
        }

        const data = await response.json();
        return data;
    }
    catch (error: any) {
        throw new Error('Failed to fetch GeoJSON:', error);
    }
}

export const extractFeaturesFromGeoJson = (data: any) => {
    if (!data) return null;
    const { sourceProjection, featureProjection } = detectProjection(
        data.crs?.properties?.name
    );


    return new GeoJSON().readFeatures(data, {
        featureProjection,
        dataProjection: sourceProjection,
    }
    );
}




export const createNewWFSSource = (url: string) => {
    return new VectorSource({
        format: new GeoJSON(),
        url: () => {
            return url;
        },
        strategy: all,
    });
};

export const createNewWFSSourceAsync = async (url:string) => {
    const response = await fetch(url);
    const geojsonData = await response.json();
    return new VectorSource({
        features: new GeoJSON().readFeatures(geojsonData)
    });
};

// Function to create GeoTIFF source
export const createGeoTIFFSource = (url: string) => {
    return new GeoTIFF({
        sources: [
            {
                url: url,
            },
        ],
    });
};

// Function to create GeoTIFF layer
export const createGeoTIFFLayer = (url: string, layerId?: string, layerName?: string, opacity: number = 1) => {
    const source = createGeoTIFFSource(url);
    
    return new WebGLTile({
        source: source,
        opacity: opacity,
        visible: true,
    });
};

// Function to create multiple GeoTIFF layers from an array of URLs
export const createGeoTIFFLayers = (urls: string[], baseLayerId?: string, baseLayerName?: string) => {
    return urls.map((url, index) => {
        const fileName = url.split('/').pop()?.replace('.tif', '') || `layer-${index}`;
        return createGeoTIFFLayer(
            url,
            `${baseLayerId || 'geotiff'}-${index}`,
            `${baseLayerName || 'GeoTIFF'} - ${fileName}`,
            0.8 // Default opacity for multiple layers
        );
    });
};


export const BASEMAP_STR: string = "basemap-layer";

export const osmSource = new OSM();
export const satelliteSource = new XYZ({
    url: URLS.common.baseMapUrls.googleSourceUrl,
    maxZoom: 18,
});

export const esriSource = new XYZ({
    url: URLS.common.baseMapUrls.esriSourceUrl,
    attributions: `Powered by <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a> | 
             <a href="https://www.arcgis.com/home/item.html?id=30e5fe3149c34df1ba922e6f5bbf808f" target="_blank" rel="noopener noreferrer">Esri Community Maps Contributors</a> | 
             <a href="https://www.esri.com/en-us/legal/terms/full-master-agreement" target="_blank" rel="noopener noreferrer">Terms of Use</a>`,
    maxZoom: 18,
});

export const topoSource = new XYZ({
    url: URLS.common.baseMapUrls.topoSourceUrl,
    maxZoom: 18,
});


export const cartoUrl = URLS.common.baseMapUrls.cartoSourceUrl;
export const cartoSource = new XYZ({
    url: cartoUrl,
    attributions: '© <a href="https://carto.com">CARTO</a> ' +
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});



export const satelliteMapStyle = new Style({
    fill: new Fill({
        color: "#00000000",
    }),
    stroke: new Stroke({
        color: "#fff",
        width: 1,
    }),
});

const mapFeatureStyles = {
    defaultMapStyle: {
        normal: new Style({
            fill: new Fill({
                color: "rgba(205, 55, 0, 0)",
            }),
            stroke: new Stroke({
                color: "#555",
                width: 1,
            }),
        }),
        highlighted: new Style({
            fill: new Fill({
                color: "rgba(205, 55, 0, 0.3)",
            }),
            stroke: new Stroke({
                color: "#000",
                width: 1,
            }),
        }),
    },
    satelliteMapStyle: {
        normal: new Style({
            fill: new Fill({
                color: "#00000000",
            }),
            stroke: new Stroke({
                color: "#fff",
                width: 1,
            }),
        }),
        highlighted: new Style({
            fill: new Fill({
                color: "#67C96D33",
            }),
            stroke: new Stroke({
                color: "#67C96D",
                width: 1,
            }),
        }),
    },
    esriMapStyle: {
        normal: new Style(),
        highlighted: new Style(),
    },
    topoMapStyle: {
        normal: new Style(),
        highlighted: new Style(),
    },
};

export const getFeatureStyleBasedOnType = (mapType: MapTypes, isHighlighted: boolean) => {
    switch (mapType) {
        case MapTypes.Default:
            if (isHighlighted) {
                return mapFeatureStyles.defaultMapStyle.highlighted;
            }
            else {
                return mapFeatureStyles.defaultMapStyle.normal;
            }
        case MapTypes.ESRI:
        case MapTypes.TOPO:
        case MapTypes.Satellite:
            if (isHighlighted) {
                return mapFeatureStyles.satelliteMapStyle.highlighted;
            }
            else {
                return mapFeatureStyles.satelliteMapStyle.normal;
            }
    }
}

export const getMapSourceBasedOnType = (baseMapType: BaseMapState) => {
    switch (baseMapType) {
        case "OSM":
            return osmSource;
        case "ESRI":
            return esriSource;
        case "GOOGLE":
            return satelliteSource;
        case "CARTO":
            return cartoSource;
    }
};

export const getWFSLayerBasedOnType = (mapType: MapTypes, source: VectorSource) => {
    return new VectorLayer({
        source: source,
        style: getFeatureStyleBasedOnType(mapType, false),
    });
};
