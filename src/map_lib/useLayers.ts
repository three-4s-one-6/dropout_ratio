import { BASEMAP_STR } from "@/map_lib/MapUtils";
import { Fill, Stroke, Style } from "ol/style";
import Layer from "ol/layer/Layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import WebGLTile from "ol/layer/WebGLTile";
import { StyleFactory } from "@/map_lib/StyleFactory";
import { useCallback } from "react";

export function useLayers(mapInstance?: any) {
    // Accept map instance as parameter for flexibility
    const map = mapInstance;

    // Create default style
    const defaultStyle = StyleFactory.general.defaultStyle;

    // Get a layer by its ID
    const getLayer = useCallback(
        (layerId: string): Layer | undefined => {
            if (!map) return undefined;
            return map
                .getAllLayers()
                .find((layer) => layer.get("id") === layerId);
        },
        [map],
    );

    // Set up event listeners for a layer
    const setListeners = useCallback((layer: Layer): void => {
        const handleVisibilityChange = (e: any) => {
            console.log(e);
        };

        layer.on("change:visible", handleVisibilityChange);
    }, []);

    // Create a new vector layer from a source
    const getLayerBySource = useCallback(
        (source: VectorSource, id: string, name: string): Layer => {
            return new VectorLayer({
                source: source,
                properties: {
                    id: id,
                    name: name,
                },
                style: defaultStyle,
            });
        },
        [defaultStyle],
    );

    // Zoom to fit a single layer
    const zoomToLayer = useCallback(
        (layer: Layer | undefined, customPadding?: any): void => {
            if (!map || !layer) return;

            if (layer instanceof VectorLayer) {
                // Handle vector layers
                const source = layer.getSource() as VectorSource;

                const zoomToSource = () => {
                    if (source.getFeatures().length) {
                        const extent = source.getExtent();
                        if (
                            extent &&
                            extent.some(
                                (coord) =>
                                    coord !== Infinity && coord !== -Infinity,
                            )
                        ) {
                            map.getView().fit(extent, {
                                padding: customPadding || [100, 100, 100, 50],
                                duration: 500,
                            });
                        }
                    }
                };

                if (source?.getState() === "ready") {
                    zoomToSource();
                    source?.once("change", zoomToSource);
                } else {
                    source?.once("change", () => {
                        zoomToSource();
                    });
                }
            } else if (layer instanceof WebGLTile) {
                // Handle GeoTIFF/raster layers
                const source = layer.getSource();

                const zoomToRasterSource = async () => {
                    try {
                        // For GeoTIFF, we need to get the view asynchronously
                        const view = await source?.getView();
                        if (view && view.extent) {
                            const extent = view.extent;
                            if (extent && extent.length === 4) {
                                map.getView().fit(extent, {
                                    padding: customPadding || [100, 100, 100, 50],
                                    duration: 500,
                                });
                            }
                        }
                    } catch (error) {
                        console.warn('Could not zoom to GeoTIFF layer extent:', error);
                    }
                };

                // GeoTIFF sources load differently, check if already loaded
                if (source) {
                    source.once('change', zoomToRasterSource);
                    // Also try immediately in case it's already loaded
                    setTimeout(zoomToRasterSource, 100);
                }
            }
        },
        [map],
    );

    // Remove a layer by its ID
    const removeLayer = useCallback(
        (layerId: string): void => {
            if (!map) return;

            const layer = getLayer(layerId);
            if (layer) {
                map.removeLayer(layer);
            }
        },
        [map, getLayer],
    );

    // Add a single layer to the map
    const addLayer = useCallback(
        (
            layer: Layer,
            style?: ((feature: any, resolution: any) => void) | Style,
        ): void => {
            if (!map) return;

            const layerId = layer.get("id");

            if (!layerId) {
                console.error("Layer must have an 'id' property.");
                return;
            }

            // If there is a layer with same id, remove it
            removeLayer(layerId);

            if (layer instanceof VectorLayer) {
                const vectorLayer = layer as VectorLayer<VectorSource>;

                // Apply the default style to the vector layer
                vectorLayer.setStyle(style || defaultStyle);

                map.addLayer(layer);
                setListeners(layer);
            } else if (layer instanceof WebGLTile) {
                // Handle GeoTIFF/satellite layers
                const rasterLayer = layer as WebGLTile;

                // Add the raster layer to map (no styling needed for raster data)
                map.addLayer(rasterLayer);
                setListeners(rasterLayer);

                console.log(`Added satellite/raster layer: ${layer.get("name") || layerId}`);
            } else {
                // Handle other layer types
                map.addLayer(layer);
                setListeners(layer);
                console.log(`Added layer of type: ${layer.constructor.name}`);
            }
        },
        [map, defaultStyle, removeLayer, setListeners],
    );

    // Add multiple layers at once
    const addMultiLayers = useCallback(
        (layers: Layer[]): void => {
            if (!map) return;

            layers.forEach((layer) => {
                addLayer(layer);
            });
            // TODO: implement zooming logic to cover all layers
        },
        [map, addLayer],
    );

    // Add a layer and zoom to its extent
    const addAndZoomToLayer = useCallback(
        (
            layer: Layer,
            style?: ((feature: any, resolution: any) => void) | Style,
        ): void => {
            if (!map) return;

            addLayer(layer, style || defaultStyle);
            zoomToLayer(layer);
        },
        [map, addLayer, defaultStyle, zoomToLayer],
    );

    // Add a tile layer to the map
    const addTileLayer = useCallback(
        (layer: Layer) => {
            if (!map) return;

            map.addLayer(layer);
            setListeners(layer);
        },
        [map, setListeners],
    );

    // Create and add a layer from a source
    const addLayerBySource = useCallback(
        (source: VectorSource, id: string, name: string): void => {
            if (!map) return;

            addLayer(getLayerBySource(source, id, name));
        },
        [map, addLayer, getLayerBySource],
    );

    const reorderLayers = useCallback(
        (layerIds: string[]): void => {
            if (!map) return;

            const layers = map.getLayers();
            const layerArray = layers.getArray();

            // Create a map of layerId to layer object for quick lookup
            const layerMap = new Map<string, any>();
            let baseMapLayer: any;

            layerArray.forEach((layer) => {
                const id = layer.get("id");
                if (id) {
                    if (id === BASEMAP_STR) {
                        baseMapLayer = layer;
                    } else {
                        layerMap.set(id, layer);
                    }
                }
            });

            // Validate all layerIds exist (excluding basemap)
            const missingIds = layerIds.filter(
                (id) => id !== BASEMAP_STR && !layerMap.has(id),
            );
            if (missingIds.length > 0) {
                console.warn(
                    `The following layer IDs were not found: ${missingIds.join(
                        ", ",
                    )}`,
                );
            }

            // Remove all layers except basemap
            const layersToReorder = layerIds
                .filter((id) => id !== BASEMAP_STR)
                .map((id) => layerMap.get(id))
                .filter((layer): layer is Layer => !!layer);

            layersToReorder.forEach((layer) => {
                map.removeLayer(layer);
            });

            // Ensure basemap is at the bottom (index 0)
            if (baseMapLayer) {
                map.removeLayer(baseMapLayer);
                map.getLayers().insertAt(0, baseMapLayer);
            }

            // Add other layers back in the specified order
            layersToReorder.forEach((layer) => {
                map.addLayer(layer);
            });
        },
        [map],
    );

    // Remove all layers from the map
    const removeAllLayers = useCallback((): void => {
        if (!map) return;

        map.getAllLayers().forEach((layer) => {
            removeLayer(layer.get("id"));
        });
    }, [map, removeLayer]);

    // Remove all layers except the specified one
    const removeAllLayersExcept = useCallback(
        (layerId: string): void => {
            if (!map) return;

            map.getAllLayers().forEach((layer) => {
                if (
                    layer.get("id") != "basemap-layer" &&
                    layer.get("id") != layerId
                ) {
                    removeLayer(layer.get("id"));
                }
            });
        },
        [map, removeLayer],
    );

    // Hide a layer by its ID
    const hideLayer = useCallback(
        (layerId: string): void => {
            if (!map) return;

            const layer = getLayer(layerId);
            if (layer) {
                layer.setVisible(false);
            }
        },
        [map, getLayer],
    );

    // Hide all layers
    const hideAllLayers = useCallback((): void => {
        if (!map) return;

        map.getAllLayers().forEach((layer) => hideLayer(layer.get("id")));
    }, [map, hideLayer]);

    const hideLayersExcept = useCallback(
        (layers:Array<string>): void => {
            if (!map) return;

            map.getAllLayers().forEach((layer) => {
                const layerId = layer.get("id");
    
                // Hide all static layers and the new layer
                if (!layers.includes(layerId)) {
                    hideLayer(layerId);
                }
            });
        },
        [map, hideLayer],
    );

    // Show a layer by its ID
    const showLayer = useCallback(
        (layerId: string): void => {
            if (!map) return;

            const layer = getLayer(layerId);
            if (layer) {
                layer.setVisible(true);
            }
        },
        [map, getLayer],
    );

    // Show all layers
    const showAllLayers = useCallback((): void => {
        if (!map) return;

        map.getAllLayers().forEach((layer) => showLayer(layer.get("id")));
    }, [map, showLayer]);

    // Check if a layer is visible
    const isVisible = useCallback(
        (layerId: string): boolean => {
            if (!map) return false;

            const layer = getLayer(layerId);
            if (layer) {
                return layer.getVisible();
            }
            return false;
        },
        [map, getLayer],
    );

    // Check if the map contains a layer with the specified ID
    const containsLayer = useCallback(
        (layerId: string): boolean => {
            if (!map) return false;

            const curLayer = map
                .getAllLayers()
                .find((layer) => layer.get("id") === layerId);

            return curLayer ? true : false;
        },
        [map],
    );

    // Zoom to fit all vector layers
    const zoomToAllLayers = useCallback((): void => {
        if (!map) return;
    }, [map]);

    const zoomToLayerWithId = useCallback(
        (layerId: string) => {
            if (!map) return;

            const layer = map
                .getAllLayers()
                .find((layer) => layer.get("id") === layerId);
            if (layer) {
                zoomToLayer(layer);
            }
        },
        [map, zoomToLayer],
    );

    // Change layer color
    const changeColor = useCallback(
        (layerId: string, color: { hex: string }) => {
            if (!layerId || !color?.hex) return;

            const layer = getLayer(layerId);
            const source = layer?.getSource();
            if (layer instanceof VectorLayer) {
                layer.setStyle(
                    new Style({
                        fill: new Fill({
                            color: "#ffffff00",
                        }),
                        stroke: new Stroke({
                            color: color.hex,
                            width: 2,
                        }),
                    }),
                );

                if (source instanceof VectorSource) {
                    source?.getFeatures().forEach((feature) => {
                        feature.set("color", color?.hex);
                    });
                }
            }
        },
        [getLayer],
    );

    const getAllLayers = useCallback((): Layer[] | undefined => {
        if (!map) return undefined;
        return map.getAllLayers();
    }, [map]);

    const getAllLayersFilterBase = useCallback((): Layer[] | undefined => {
        if (!map) return undefined;
        return map
            .getAllLayers()
            .filter((layer) => layer.get("id") !== "basemap-layer");
    }, [map]);

    // Create a style function based on provided stroke color, fill color, and stroke width
    const createLayerStyle = useCallback((options: {
        strokeColor?: string;
        fillColor?: string;
        strokeWidth?: number;
    }) => {
        return () => new Style({
            fill: new Fill({
                color: options.fillColor || "rgba(255,255,255, 0)",
            }),
            stroke: new Stroke({
                color: options.strokeColor || "#ffffff",
                width: options.strokeWidth || 2,
            }),
        });
    }, []);

    // Update layer style with new styling options
    const updateLayerStyle = useCallback((layerId: string, options: {
        strokeColor?: string;
        fillColor?: string;
        strokeWidth?: number;
    }) => {
        if (!map) return;

        const layer = getLayer(layerId);
        if (layer instanceof VectorLayer) {
            const newStyle = createLayerStyle(options);
            layer.setStyle(newStyle);
            console.log(`Updated style for layer ${layerId}:`, options);
        }
    }, [map, getLayer, createLayerStyle]);

    return {
        addLayer,
        addMultiLayers,
        addAndZoomToLayer,
        addTileLayer,
        addLayerBySource,
        reorderLayers,
        removeLayer,
        removeAllLayers,
        removeAllLayersExcept,
        hideLayer,
        hideAllLayers,
        showLayer,
        showAllLayers,
        isVisible,
        containsLayer,
        getLayerBySource,
        zoomToAllLayers,
        zoomToLayer,
        zoomToLayerWithId,
        changeColor,
        hideLayersExcept,
        getLayer,
        getAllLayers,
        getAllLayersFilterBase,
        createLayerStyle,
        updateLayerStyle,
    };
}

export default useLayers;
