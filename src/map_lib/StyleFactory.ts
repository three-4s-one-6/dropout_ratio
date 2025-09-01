import { Circle, Fill, RegularShape, Stroke, Style, Text } from "ol/style";

export const isMediaPresentInFeature = (feature: any) => {
    if (
        feature.get('image_1') !== null ||
        feature.get('image_2') !== null ||
        feature.get('image_3') !== null ||
        feature.get('image_4') !== null ||
        feature.get('video_1') !== null ||
        feature.get('video_2') !== null
    ) {
        return true;
    }
    return false;
}

export const isAgriLand = (feature: any) => {
    if (feature.get("class") === "agriculture")
        return true;
    return false;
}

export const getColorBasedOnClassification = (feature: any) => {
    if (feature.get("classification") && feature.get("classification") === null)
        return "#FFFFFF";
    const classification = feature.get("classification");
    switch (classification) {
        case "agriculture": return "#00FF00";
        case "non-agriculture": return "#FFFFFF";
        case "building": return "#FF0000";
        default: return "#FFFFFF";
    }
}

export const StyleFactory = {
    general: {

        defaultStyle:
            (feature: any) => {
                return new Style({
                    fill: new Fill({
                        color: "rgba(255,255,255, 0)",
                    }),
                    stroke: new Stroke({
                        color: feature.get('color') || "#ffff00",
                        width: 2,
                    }),
                });
            },
        selectedStyle:
            (feature: any) => {
                return new Style({
                    fill: new Fill({
                        color: "rgba(255,255,0, 0.8)",
                    }),
                    stroke: new Stroke({
                        color: feature.get('color') || "#ffffff",
                        width: 2,
                    }),
                });
            },

        measureToolStyle: (feature: any) => {
            return new Style({
                stroke: new Stroke({
                    color: "#ffff00",
                    width: 2,
                }),
                text: new Text({
                    text: `Length: ${feature.get("length_m")?.toFixed(2)} meters`,
                    font: "14px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#fff",
                    }),
                    stroke: new Stroke({
                        color: "#000",
                        width: 3,
                    }),
                    offsetY: -15, // Offset to position label above the feature
                    overflow: true
                }),
            });
        },

        drawToolStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,255, 0.5)",
                }),
                stroke: new Stroke({
                    color: "#ffff00",
                    width: 2,
                }),
                text: new Text({
                    text: `Area: ${(feature.get(
                        "area_sqm"
                    ) * .000247).toFixed(2)} acres`,
                    font: "14px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#fff",
                    }),
                    stroke: new Stroke({
                        color: "#fff",
                        width: 0,
                    }),
                    offsetY: -15, // Offset to position label above the feature
                    overflow: true
                }),
            });
        },
        polySelectToolStyle: () => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,255, 0.5)",
                }),
                stroke: new Stroke({
                    color: "#ffff00",
                    width: 2,
                }),
            });
        },
        boundaryStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,255, 0)",
                }),
                stroke: new Stroke({
                    color: "#ffffff",
                    width: 2,
                }),
                text: new Text({
                    text: `${feature.get("vill_name")}`,
                    font: "18px Calibri, sans-serif",
                    fill: new Fill({
                        color: "#fff"
                    }),
                    stroke: new Stroke({
                        color: "#000",
                        width: 4,
                    }),
                    overflow: false,
                })
            });
        },
        boundaryHoverStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,255, 0.2)",
                }),
                stroke: new Stroke({
                    color: "#ffffff",
                    width: 4,
                }),
                text: new Text({
                    text: `${feature.get("vill_name")}`,
                    font: "18px Calibri, sans-serif",
                    fill: new Fill({
                        color: "#fff"
                    }),
                    stroke: new Stroke({
                        color: "#000",
                        width: 4,
                    }),
                })
            });
        },
    },
    ITNT: {
        fmbFilters: {
            plantation: () => {
                return new Style({
                    fill: new Fill({
                        color: "#097969aa",
                    }),
                    stroke: new Stroke({
                        color: "#097969",
                        width: 2,
                    }),

                })
            },
            buildings: () => {
                return new Style({
                    fill: new Fill({
                        color: "#6E260Eaa",
                    }),
                    stroke: new Stroke({
                        color: "#6E260E",
                        width: 2,
                    }),

                })
            },
            farmlands: () => {
                return new Style({
                    fill: new Fill({
                        color: "#32CD32aa",
                    }),
                    stroke: new Stroke({
                        color: "#32CD32",
                        width: 2,
                    }),

                })
            },
        },
        fmbStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#ff9333",
                    width: 2,
                }),
                text: new Text({
                    text: `${feature.get("KIDE")}`, // Use the point ID (e.g., "16")
                    font: "12px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#0022ee", // Black text color
                    }),
                    stroke: new Stroke({
                        color: "#fff", // White outline for better readability
                        width: 5,
                    }),
                }),
            });
        },
        fmbHoverStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,255, 0.2)",
                }),
                stroke: new Stroke({
                    color: "#ff9333",
                    width: 2,
                }),
                text: new Text({
                    text: `${feature.get("KIDE")}`, // Use the point ID (e.g., "16")
                    font: "12px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#0022ee", // Black text color
                    }),
                    stroke: new Stroke({
                        color: "#fff", // White outline for better readability
                        width: 5,
                    }),
                }),
            });
        },
    },
    sipcot: {
        districtStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#ffffff",
                    width: 2,
                }),

                text: new Text({
                    text: `${feature.get("district_name")}`, // Use the point ID (e.g., "16")
                    font: "16px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#ffffff", // Black text color
                    }),
                    stroke: new Stroke({
                        color: "#000", // White outline for better readability
                        width: 2,
                    }),
                }),
            });
        },
        boundaryStyle: () => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#0000ee",
                    width: 4,
                }),
            });
        },
        newBoundaryStyle: () => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#FFFFFF",
                    width: 4,
                    lineDash: [8, 8], // Optional: dashed line pattern
                }),
            });
        },
        cadastralStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#ffff00",
                    width: 4,
                }),

                text: new Text({
                    text: `${feature.get("survey_no")}`, // Use the point ID (e.g., "16")
                    font: "12px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#ffff00", // Black text color
                    }),
                    stroke: new Stroke({
                        color: "#000", // White outline for better readability
                        width: 2,
                    }),
                }),
            });
        },
        fmbStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#ff9333",
                    width: 2,
                }),
                text: new Text({
                    text: `${feature.get("KIDE")}`, // Use the point ID (e.g., "16")
                    font: "12px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#0022ee", // Black text color
                    }),
                    stroke: new Stroke({
                        color: "#fff", // White outline for better readability
                        width: 5,
                    }),
                }),
            });
        },
        pointsOfInterestStyle: (feature: any) => {
            //const color = getColorBasedOnClassification(feature);
            const color = isMediaPresentInFeature(feature) ? "#00FF00" : "#FF0000";

            // Create the base RegularShape (triangle)
            const shape = new RegularShape({
                points: 3, // Creates a triangle (3 points)
                radius: 15, // Base size
                fill: new Fill({
                    color: color
                }),
                stroke: new Stroke({
                    color: "#ffffff", // White border
                    width: 3,
                }),
                rotation: 45, // Optional: Adjust rotation if needed (in radians)
            });

            // Create the style object
            const style = new Style({
                image: shape,
                text: new Text({
                    text: `${feature.get("point_id") || ""}`, // Use the point ID (e.g., "16")
                    font: "bold 32px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#000", // Black text color
                    }),
                    stroke: new Stroke({
                        color: "#fff", // White outline for better readability
                        width: 3,
                    }),
                    backgroundFill: new Fill({
                        color: "rgba(255, 255, 255, 1)", // White background
                    }),
                    padding: [2, 2, 2, 2], // Add padding around the text
                    offsetY: -35, // Offset to position label above the feature
                }),
            });

            return style;
        },
        pointsOfInterestHoverStyle: (feature: any) => {
            //const color = getColorBasedOnClassification(feature);
            const color = isMediaPresentInFeature(feature) ? "#00FF00" : "#FF0000";

            return new Style({
                image: new RegularShape({
                    points: 3, // Creates a triangle (3 points)
                    radius: 25, // Adjust the size as needed
                    fill: new Fill({
                        color: color
                    }),
                    stroke: new Stroke({
                        color: "#ffffff", // White border
                        width: 3,
                    }),
                    rotation: 45, // Optional: Adjust rotation if needed (in radians)
                }),
                text: new Text({
                    text: `${feature.get("point_id") || ""}`, // Use the point ID (e.g., "16")
                    font: "bold 32px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#000", // Black text color
                    }),
                    stroke: new Stroke({
                        color: "#fff", // White outline for better readability
                        width: 3,
                    }),
                    backgroundFill: new Fill({ // Add a white background to the text
                        color: "rgba(255, 255, 255, 1)", // White background
                    }),
                    padding: [2, 2, 2, 2], // Add padding around the text for the background
                    offsetY: -45, // Offset to position label above the feature
                }),
            });
        },
        distanceLineStyle: (feature: any) => {

            // Get the geometry to calculate the line direction
            const geometry = feature.getGeometry();
            const coordinates = geometry.getCoordinates();

            // For a simple line, take first and last coordinates to determine direction
            const start = coordinates[0];
            const end = coordinates[coordinates.length - 1];

            // Calculate rotation angle based on line direction
            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            const rotation = Math.atan2(dy, dx);

            return new Style({
                stroke: new Stroke({
                    color: "rgba(0, 0, 0, 0.8)", // Cyan color for the line
                    width: 3,
                    lineDash: [8, 8], // Optional: dashed line pattern
                }),
                text: new Text({
                    text: `${feature.get("length") ? feature.get("length")?.toFixed(2) + " m" : ""}`, // Fallback to "N/A" if distance isn't set
                    font: "16px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#000", // Black text
                    }),
                    stroke: new Stroke({
                        color: "#fff", // White outline
                        width: 3,
                    }),
                    rotation: -rotation, // Align text with line direction (negative to match line)
                    placement: "line", // Ensures text follows the line path
                    offsetY: -10, // Position slightly above the line
                    textAlign: "center", // Center the text along the line
                    overflow: true, // Allows text to extend beyond feature

                    backgroundFill: new Fill({ // Add a white background to the text
                        color: "rgba(255, 255, 255, 1)", // White background
                    }),
                    padding: [2, 2, 2, 2],
                }),
            });
        },
    },

    migration: {
        // Helper function to classify school by student count
        getSchoolClassification: (totalStudents: number) => {
            if (totalStudents <= 100) return 'low';
            if (totalStudents <= 500) return 'medium';
            return 'high';
        },
        
        // Helper function to get school color based on classification
        getSchoolColor: (classification: string) => {
            switch (classification) {
                case 'low': return '#facc15'; // yellow-400
                case 'medium': return '#fb923c'; // orange-400
                case 'high': return '#22c55e'; // green-500
                default: return '#9ca3af'; // gray-400
            }
        },
        
        schoolStyle: (feature: any) => {
            const props = feature.getProperties();
            // Use mock data if total_students is null/undefined
            const totalStudents = props.total_students || Math.floor(Math.random() * 800) + 50; // Mock data: 50-850 students
            const classification = StyleFactory.migration.getSchoolClassification(totalStudents);
            const color = StyleFactory.migration.getSchoolColor(classification);
            
            return new Style({
                image: new Circle({
                    radius: classification === 'high' ? 8 : classification === 'medium' ? 6 : 4,
                    fill: new Fill({
                        color: color,
                    }),
                    stroke: new Stroke({
                        color: '#ffffff',
                        width: 2,
                    }),
                }),
            });
        },
        
        schoolHoverStyle: (feature: any) => {
            const props = feature.getProperties();
            // Use mock data if total_students is null/undefined
            const totalStudents = props.total_students || Math.floor(Math.random() * 800) + 50; // Mock data: 50-850 students
            const classification = StyleFactory.migration.getSchoolClassification(totalStudents);
            const color = StyleFactory.migration.getSchoolColor(classification);
            
            return new Style({
                image: new Circle({
                    radius: classification === 'high' ? 12 : classification === 'medium' ? 10 : 8,
                    fill: new Fill({
                        color: color,
                    }),
                    stroke: new Stroke({
                        color: '#000000',
                        width: 3,
                    }),
                }),
                text: new Text({
                    text: props.name || props.school_name || 'School',
                    font: 'bold 11px Arial',
                    fill: new Fill({
                        color: '#000000',
                    }),
                    stroke: new Stroke({
                        color: '#ffffff',
                        width: 3,
                    }),
                    textAlign: 'center',
                    textBaseline: 'middle',
                    offsetY: -25,
                    overflow: true,
                }),
            });
        },
        
        villageStyle: (feature: any, classification: any, selectedField: string, useWeightedCalculation: boolean) => {
            const props = feature.getProperties();
            let value: number;
            
            if (useWeightedCalculation && selectedField === 'student_school_ratio') {
                const numerator = props['total_students'];
                const denominator = props['unique_schools'];
                if (typeof numerator === 'number' && typeof denominator === 'number' && 
                    numerator != null && denominator != null && 
                    denominator !== 0 && !isNaN(numerator) && !isNaN(denominator)) {
                    value = numerator / denominator;
                } else {
                    value = 0;
                }
            } else {
                value = props[selectedField];
            }
            
            // Get color from classification
            let fillColor = '#ffffff'; // Default white
            if (classification && typeof value === 'number' && !isNaN(value) && isFinite(value)) {
                const { breaks, colors } = classification;
                
                if (value <= breaks[0]) {
                    fillColor = colors[0];
                } else if (value >= breaks[breaks.length - 1]) {
                    fillColor = colors[colors.length - 1];
                } else {
                    for (let i = 0; i < breaks.length - 1; i++) {
                        if (value >= breaks[i] && value < breaks[i + 1]) {
                            fillColor = colors[i];
                            break;
                        }
                    }
                }
            }
            
            return new Style({
                fill: new Fill({
                    color: fillColor + 'B3', // Add hex alpha for 70% opacity
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 2,
                }),
                text: new Text({
                    text: props.vill_name || props.village_name || props.name || '',
                    font: 'bold 10px Arial',
                    fill: new Fill({
                        color: '#000000',
                    }),
                    stroke: new Stroke({
                        color: '#ffffff',
                        width: 3,
                    }),
                    textAlign: 'center',
                    textBaseline: 'middle',
                    overflow: true,
                }),
            });
        },

        districtStyle: (feature: any, classification: any, selectedField: string, useWeightedCalculation: boolean) => {
            debugger
            const props = feature.getProperties();
            let value: number;
            
            if (useWeightedCalculation && selectedField === 'student_school_ratio') {
                const numerator = props['total_students'];
                const denominator = props['unique_schools'];
                if (typeof numerator === 'number' && typeof denominator === 'number' && 
                    numerator != null && denominator != null && 
                    denominator !== 0 && !isNaN(numerator) && !isNaN(denominator)) {
                    value = numerator / denominator;
                } else {
                    value = 0;
                }
            } else {
                value = props[selectedField];
            }
            
            // Get color from classification
            let fillColor = '#ffffff'; // Default white
            if (classification && typeof value === 'number' && !isNaN(value) && isFinite(value)) {
                const { breaks, colors } = classification;
                
                if (value <= breaks[0]) {
                    fillColor = colors[0];
                } else if (value >= breaks[breaks.length - 1]) {
                    fillColor = colors[colors.length - 1];
                } else {
                    for (let i = 0; i < breaks.length - 1; i++) {
                        if (value >= breaks[i] && value < breaks[i + 1]) {
                            fillColor = colors[i];
                            break;
                        }
                    }
                }
            }
            
            return new Style({
                fill: new Fill({
                    color: fillColor, // Add hex alpha for 70% opacity
                    //color: "ff0000"
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    text: props.dist_name || props.district_name || props.name || '',
                    font: 'bold 12px Arial',
                    fill: new Fill({
                        color: '#000000',
                    }),
                    stroke: new Stroke({
                        color: '#ffffff',
                        width: 3,
                    }),
                    textAlign: 'center',
                    textBaseline: 'middle',
                }),
            });
        },
        
        talukStyle: (feature: any, classification: any, selectedField: string, useWeightedCalculation: boolean) => {
            const props = feature.getProperties();
            let value: number;
            
            if (useWeightedCalculation && selectedField === 'student_school_ratio') {
                const numerator = props['total_students'];
                const denominator = props['unique_schools'];
                if (typeof numerator === 'number' && typeof denominator === 'number' && 
                    numerator != null && denominator != null && 
                    denominator !== 0 && !isNaN(numerator) && !isNaN(denominator)) {
                    value = numerator / denominator;
                } else {
                    value = 0;
                }
            } else {
                value = props[selectedField];
            }
            
            // Get color from classification
            let fillColor = '#ffffff'; // Default white
            if (classification && typeof value === 'number' && !isNaN(value) && isFinite(value)) {
                const { breaks, colors } = classification;
                
                if (value <= breaks[0]) {
                    fillColor = colors[0];
                } else if (value >= breaks[breaks.length - 1]) {
                    fillColor = colors[colors.length - 1];
                } else {
                    for (let i = 0; i < breaks.length - 1; i++) {
                        if (value >= breaks[i] && value < breaks[i + 1]) {
                            fillColor = colors[i];
                            break;
                        }
                    }
                }
            }
            
            return new Style({
                fill: new Fill({
                    color: fillColor + 'B3', // Add hex alpha for 70% opacity
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 3,
                }),
                text: new Text({
                    text: props.taluk_name || props.talukname || props.name || '',
                    font: 'bold 11px Arial',
                    fill: new Fill({
                        color: '#000000',
                    }),
                    stroke: new Stroke({
                        color: '#ffffff',
                        width: 3,
                    }),
                    textAlign: 'center',
                    textBaseline: 'middle',
                    overflow: true,
                }),
            });
        },
    },

    createStyleWithColors: ({
        fillColor,
        strokeColor,
        strokeWidth,
    }: {
        fillColor?: string;
        strokeColor?: string;
        strokeWidth?: number;
    }) => {
        return new Style({
            fill: new Fill({
                color: fillColor || "rgba(255,255,0, 0)",
            }),
            stroke: new Stroke({
                color: strokeColor || "rgba(255,255,255,1)",
                width: strokeWidth || 1,
            }),
        });
    },
    FeatureExporter: {
        baseStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#ffff00",
                    width: 3,
                }),
                text: new Text({
                    text: feature.get("survey_no") ? `${feature.get("survey_no")}` : "",
                    font: "12px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#000",
                    }),
                    stroke: new Stroke({
                        color: "#fff",
                        width: 3,
                    }),
                    offsetY: -15, // Offset to position label above the feature
                }),
            });
        },

        selectedStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(0, 255, 255, 0.5)",
                }),
                stroke: new Stroke({
                    color: "#00ffff",
                    width: 4,
                }),
                text: new Text({
                    text: feature.get("survey_no")
                        ? `${feature.get("survey_no")}`
                        : "",
                    font: "14px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#000",
                    }),
                    stroke: new Stroke({
                        color: "#fff",
                        width: 3,
                    }),
                    offsetY: -15,
                }),
            });
        },
    },
    autoGeoReferencing: {
        plainStyleWithoutText: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: feature.get("color") || "#ffffff",
                    width: 1,
                }),
            });
        },
        baseQueryMapsStyle: (feature: any) => {
            return new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#ffffff",
                    width: 1,
                }),
                text: new Text({
                    text: feature.get("survey_no") ? `survey no: ${feature.get("survey_no")}` : "",
                    font: "12px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#000",
                    }),
                    stroke: new Stroke({
                        color: "#fff",
                        width: 3,
                    }),
                    offsetY: -15, // Offset to position label above the feature
                }),
            });
        },

        baseResultsMapStyle: (feature: any) => {
            const labelStyle = new Style({
                fill: new Fill({
                    color: "rgba(255,255,0, 0)",
                }),
                stroke: new Stroke({
                    color: "#ffff00",
                    width: 2,
                }),
                text: new Text({
                    font: "13px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#fff",
                    }),
                    stroke: new Stroke({
                        color: "#fff",
                        width: 0,
                    }),
                    offsetY: -15,
                }),
            });

            labelStyle?.getText()?.setText([
                "Survey no: ", // Text content
                "12px Calibri,sans-serif", // Font style
                `${feature.get("survey_no")}`, // Survey number
                "", // Empty spacer
                "\n", // New line
                "Area: ", // Text content
                `${feature.get("area_sqm")} sq.m`, // Area value
                "normal 12px Calibri,sans-serif", // Font style
            ]);

            return labelStyle;
        },

        dgpsPointsStyle: (feature: any) => {
            return new Style({
                image: new Circle({
                    radius: 6,
                    fill: new Fill({
                        color: "rgba(255, 255, 0, 0.8)",
                    }),
                    stroke: new Stroke({
                        color: "#ffffff",
                        width: 1,
                    }),
                }),
                text: new Text({
                    text: `${feature.get("label")}`,
                    font: "16px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#000",
                    }),
                    stroke: new Stroke({
                        color: "#fff",
                        width: 3,
                    }),
                    offsetY: -15, // Offset to position label above the feature
                }),
            });
        },

        gcpPointsStyle: (feature: any) => {
            return new Style({
                image: new Circle({
                    radius: 6,
                    fill: new Fill({
                        color: "rgba(255, 0, 0, 0.8)",
                    }),
                    stroke: new Stroke({
                        color: "#ffffff",
                        width: 1,
                    }),
                }),
                text: new Text({
                    text: `${feature.get("label")}`,
                    font: "16px Calibri,sans-serif",
                    fill: new Fill({
                        color: "#000",
                    }),
                    stroke: new Stroke({
                        color: "#fff",
                        width: 3,
                    }),
                    offsetY: -15, // Offset to position label above the feature
                }),
            });
        },
    },
};
