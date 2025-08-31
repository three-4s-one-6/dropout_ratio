import { Map, View } from "ol";
import { defaults as defaultControls } from "ol/control";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import React, { createContext, useContext, useEffect, useState } from "react";

import { satelliteSource, osmSource } from "../utils/MapUtils";
import { BASEMAP_STR } from "../utils/MapUtils";
import { useCallback } from "react";

interface MapContextProps {
    map: Map;
    activeLayer: string;
    changeActiveLayer: (layer: string) => void;
}
const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children, baseLayer }: { children: any, baseLayer?: "satellite" | "osm"  }) => {
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [activeLayer, setActiveLayer] = useState("");

    useEffect(() => {
        let baseLayerSource = satelliteSource;
        if (baseLayer) {
            baseLayerSource = baseLayer === "satellite" ? satelliteSource : osmSource;
        }

        const initialBaseLayer = new TileLayer({
            preload: Infinity,
            source: baseLayerSource,
            properties: { id: BASEMAP_STR },
        });

        const newMap = new Map({
            layers: [initialBaseLayer],
            view: new View({
                center: fromLonLat([78.0, 12]),
                zoom: 7,
            }),
            controls: defaultControls().extend([]),
        });

        setMapInstance(newMap);
    }, []);

    const changeActiveLayer = useCallback((layerId: string) => {
        setActiveLayer(layerId);
    }, [setActiveLayer]);

    return (
        <MapContext.Provider value={{ map: mapInstance, activeLayer: activeLayer, changeActiveLayer: changeActiveLayer }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = () => {
    const context = useContext(MapContext);
    if (context === undefined) {
        throw new Error('Map object not created properly!!!');
    }
    return context;
};
