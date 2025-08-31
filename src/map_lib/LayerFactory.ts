import { Feature } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { detectProjection } from "@/map_lib/projectionUtils";

export const LayersFactory = {
    createLayerByFeatures: (features: Feature[]) => {
        const source = new VectorSource({
            features: features,
        });
        return new VectorLayer({
            source: source,
            properties: {
                id: `Layer-id-${Date.now()}`,
                name: "new-layer",
            },
        });
    },
    createLayerByGeoJSONObject: ({ geoJSONObj, id, name }: { geoJSONObj: any, id?: string, name?: string }) => {
        const { sourceProjection, featureProjection } = detectProjection(
            geoJSONObj?.crs?.properties?.name
        );

        const features = new GeoJSON().readFeatures(geoJSONObj, {
            featureProjection: featureProjection,
            dataProjection: sourceProjection,
        });

        const source = new VectorSource({
            features: features,
        });

        return new VectorLayer({
            source: source,
            properties: {
                id: id || `Layer-id-${Date.now()}`,
                name: name || "new layer",
            },
        });
    },
    createVectorLayer(source: VectorSource, id: string, name: string) {
        return new VectorLayer({
            source,
            properties: { id, name },
        });
    },
};
