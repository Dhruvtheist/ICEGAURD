// Realistic Antarctic Peninsula geographic vector data for OpenLayers EPSG:3031

export const ANTARCTIC_GEO_DATA = {
  type: "FeatureCollection",
  features: [
    // Antarctic Peninsula Mainland (Graham Land / Palmer Land)
    {
      type: "Feature",
      properties: { name: "Antarctic Peninsula Mainland", type: "continent" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-57.0, -63.3], // Hope Bay / Trinity Peninsula
          [-58.2, -63.8],
          [-59.5, -64.1],
          [-60.8, -64.5],
          [-61.5, -64.9],
          [-62.4, -65.1],
          [-63.2, -65.4],
          [-64.0, -65.9],
          [-64.8, -66.5],
          [-65.5, -67.2],
          [-66.2, -67.9],
          [-66.8, -68.7],
          [-67.5, -69.6],
          [-67.0, -70.5],
          [-64.0, -71.5],
          [-61.0, -71.2],
          [-60.5, -68.5],
          [-60.8, -66.0],
          [-59.8, -64.8],
          [-58.5, -64.2],
          [-57.0, -63.5],
          [-57.0, -63.3]
        ]]
      }
    },
    // Larsen C Ice Shelf
    {
      type: "Feature",
      properties: { name: "Larsen C Ice Shelf", type: "ice_shelf" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-60.5, -66.0],
          [-62.0, -66.1],
          [-63.5, -67.0],
          [-62.5, -68.5],
          [-60.0, -68.3],
          [-59.2, -67.1],
          [-60.5, -66.0]
        ]]
      }
    },
    // South Shetland Islands - King George Island
    {
      type: "Feature",
      properties: { name: "King George Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-57.8, -62.0],
          [-58.5, -62.05],
          [-59.0, -62.25],
          [-58.2, -62.3],
          [-57.8, -62.0]
        ]]
      }
    },
    // South Shetland Islands - Livingston & Smith Island
    {
      type: "Feature",
      properties: { name: "Livingston Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-60.0, -62.5],
          [-60.8, -62.6],
          [-60.9, -62.75],
          [-60.1, -62.7],
          [-60.0, -62.5]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Smith Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-62.4, -62.9],
          [-62.7, -63.05],
          [-62.6, -63.2],
          [-62.3, -63.0],
          [-62.4, -62.9]
        ]]
      }
    },
    // Palmer Archipelago - Anvers Island
    {
      type: "Feature",
      properties: { name: "Anvers Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-63.2, -64.4],
          [-64.0, -64.45],
          [-64.5, -64.7],
          [-63.9, -64.85],
          [-63.3, -64.65],
          [-63.2, -64.4]
        ]]
      }
    },
    // Palmer Archipelago - Brabant Island
    {
      type: "Feature",
      properties: { name: "Brabant Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-62.2, -64.15],
          [-62.7, -64.2],
          [-62.8, -64.45],
          [-62.3, -64.4],
          [-62.2, -64.15]
        ]]
      }
    },
    // Biscoe Islands - Renaud Island
    {
      type: "Feature",
      properties: { name: "Renaud Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-65.7, -65.5],
          [-66.1, -65.65],
          [-66.2, -65.85],
          [-65.8, -65.7],
          [-65.7, -65.5]
        ]]
      }
    },
    // Biscoe Islands - Lavoisier Island
    {
      type: "Feature",
      properties: { name: "Lavoisier Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-66.4, -66.1],
          [-66.9, -66.25],
          [-67.0, -66.5],
          [-66.5, -66.35],
          [-66.4, -66.1]
        ]]
      }
    },
    // Adelaide Island (Rothera Station destination)
    {
      type: "Feature",
      properties: { name: "Adelaide Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-68.0, -66.9],
          [-68.7, -67.1],
          [-69.3, -67.4],
          [-68.8, -67.7],
          [-68.1, -67.5],
          [-68.0, -66.9]
        ]]
      }
    },
    // Alexander Island (Western Bellingshausen Sea)
    {
      type: "Feature",
      properties: { name: "Alexander Island", type: "island" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-70.5, -70.5],
          [-72.0, -70.8],
          [-73.0, -71.8],
          [-72.0, -72.6],
          [-70.2, -72.0],
          [-69.8, -71.2],
          [-70.5, -70.5]
        ]]
      }
    }
  ]
};

// Polar research stations in sector
export const POLAR_STATIONS = [
  { name: "Rothera Station (UK - Target Base)", lat: -67.57, lon: -68.13, code: "EGAR", country: "United Kingdom" },
  { name: "Palmer Station (USAP)", lat: -64.77, lon: -64.05, code: "PLM", country: "United States" },
  { name: "Vernadsky Base", lat: -65.25, lon: -64.26, code: "VRN", country: "Ukraine" },
  { name: "San Martín Base", lat: -68.13, lon: -67.10, code: "SMT", country: "Argentina" },
  { name: "Eduardo Frei / King George", lat: -62.20, lon: -58.98, code: "SCRM", country: "Chile" }
];
