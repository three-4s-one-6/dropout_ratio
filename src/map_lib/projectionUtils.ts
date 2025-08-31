import { transform } from "ol/proj";

export const extractEPSGCodeFromCRS = (crsString: string): string | null => {
  const match = crsString.match(/EPSG::(\d+)/);
  return match ? `EPSG:${match[1]}` : null;
};

export const detectProjection = (crsName?: string) => {
  let sourceProjection = "EPSG:4326"; // Default
  const featureProjection = "EPSG:3857"; // Default output projection

  if (crsName) {
    if (crsName.includes("CRS84")) {
      sourceProjection = "EPSG:4326";
    } else if (crsName.includes("3857")) {
      sourceProjection = "EPSG:3857";
    } else if (crsName.includes("326")) {
      sourceProjection = extractEPSGCodeFromCRS(crsName) || sourceProjection;
    }
  }

  return { sourceProjection, featureProjection };
};

export const transformCoordinates = (lon: number, lat: number, sourceProjection:string, destProjection:string) => {
  return transform([lon, lat], sourceProjection, destProjection);
};

export const transformFrom_4327_to_3857 = (lon: number, lat: number) => {
    return transformCoordinates(lon, lat, "EPSG:4326", "EPSG:3857");
}
