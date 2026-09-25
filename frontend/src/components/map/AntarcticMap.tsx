import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { Style, Fill, Stroke, Text, Circle as CircleStyle, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import {
  Maximize2,
  Navigation,
  Compass,
  Layers,
  Shield,
  Eye,
  Route as RouteIcon,
  Flame,
  Grid
} from 'lucide-react';

import {
  GridCell,
  ShipTelemetry,
  Iceberg,
  RouteOption,
  TimelineStep,
  Waypoint
} from '../../types/navigation';
import { ANTARCTIC_GEO_DATA, POLAR_STATIONS } from '../../services/antarcticGeoData';

// Register EPSG:3031 Antarctic Polar Stereographic projection
proj4.defs(
  'EPSG:3031',
  '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
register(proj4);
const antarcticProjection = getProjection('EPSG:3031');

// SVG Icon Data URIs for Google Maps-style markers
const createShipArrowSvg = () => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <defs>
        <filter id="nav-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
      </defs>
      <path d="M 24,4 L 38,40 L 24,31 L 10,40 Z" fill="#1a73e8" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" filter="url(#nav-shadow)"/>
      <circle cx="24" cy="22" r="3" fill="#ffffff" />
    </svg>
  `);
};

const createIcebergSvg = (color: string) => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
      <defs>
        <filter id="berg-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
        </filter>
      </defs>
      <circle cx="17" cy="17" r="13" fill="#ffffff" stroke="${color}" stroke-width="2.5" filter="url(#berg-shadow)"/>
      <polygon points="17,7 23,23 11,23" fill="${color}" opacity="0.9"/>
    </svg>
  `);
};

const createTurnBackSvg = () => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <filter id="tb-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="16" fill="#f59e0b" stroke="#ffffff" stroke-width="3" filter="url(#tb-shadow)"/>
      <path d="M 25,14 L 18,14 C 14.5,14 12,16.5 12,20 C 12,23.5 14.5,26 18,26 L 26,26" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <polyline points="21,10 26,14 21,18" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `);
};

const createDestinationPinSvg = () => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M 18,2 C 9,2 3,8 3,17 C 3,27 18,41 18,41 C 18,41 33,27 33,17 C 33,8 27,2 18,2 Z" fill="#ea4335" stroke="#ffffff" stroke-width="2.5" filter="url(#pin-shadow)"/>
      <circle cx="18" cy="16" r="5.5" fill="#ffffff"/>
    </svg>
  `);
};

interface AntarcticMapProps {
  gridCells: GridCell[];
  vessel: ShipTelemetry;
  icebergs: Iceberg[];
  routes: RouteOption[];
  activeRouteId: string;
  selectedWaypointId: string;
  selectedCell: GridCell | null;
  timelineStep: TimelineStep;
  showRiskGrid: boolean;
  showIcebergs: boolean;
  showRoutes?: boolean;
  showSafetyCorridor: boolean;
  showEscapeCorridors: boolean;
  showGraticule: boolean;
  onSelectCell: (cell: GridCell | null) => void;
  onSelectWaypoint: (waypoint: Waypoint) => void;
  onSelectIceberg: (iceberg: Iceberg) => void;
  onSelectRoute: (routeId: string) => void;
  onSelectShip: () => void;
  onSelectTurnBack: (waypoint: Waypoint) => void;
  onToggleLayer: (layer: 'grid' | 'icebergs' | 'corridor' | 'escape' | 'graticule') => void;
}

export const AntarcticMap: React.FC<AntarcticMapProps> = ({
  gridCells,
  vessel,
  icebergs,
  routes,
  activeRouteId,
  selectedWaypointId,
  selectedCell,
  showRiskGrid,
  showIcebergs,
  showRoutes = true,
  showSafetyCorridor,
  showEscapeCorridors,
  showGraticule,
  onSelectCell,
  onSelectWaypoint,
  onSelectIceberg,
  onSelectRoute,
  onSelectShip,
  onSelectTurnBack,
  onToggleLayer
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  // Vector sources for independent layers
  const graticuleSourceRef = useRef(new VectorSource());
  const landSourceRef = useRef(new VectorSource());
  const gridSourceRef = useRef(new VectorSource());
  const corridorsSourceRef = useRef(new VectorSource());
  const routesSourceRef = useRef(new VectorSource());
  const icebergsSourceRef = useRef(new VectorSource());
  const vesselSourceRef = useRef(new VectorSource());

  // Helper to project lat/lon to EPSG:3031
  const projectCoords = (lon: number, lat: number): [number, number] => {
    return fromLonLat([lon, lat], antarcticProjection!) as [number, number];
  };

  // 1. Initialize Map instance once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map on Antarctic Peninsula corridor (~65.5°S, 65.0°W)
    const centerCoords = projectCoords(-65.5, -65.6);

    const graticuleLayer = new VectorLayer({
      source: graticuleSourceRef.current,
      zIndex: 5,
    });

    const landLayer = new VectorLayer({
      source: landSourceRef.current,
      zIndex: 10,
    });

    const gridLayer = new VectorLayer({
      source: gridSourceRef.current,
      zIndex: 15,
    });

    const corridorsLayer = new VectorLayer({
      source: corridorsSourceRef.current,
      zIndex: 20,
    });

    const routesLayer = new VectorLayer({
      source: routesSourceRef.current,
      zIndex: 25,
    });

    const icebergsLayer = new VectorLayer({
      source: icebergsSourceRef.current,
      zIndex: 30,
    });

    const vesselLayer = new VectorLayer({
      source: vesselSourceRef.current,
      zIndex: 35,
    });

    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        graticuleLayer,
        landLayer,
        gridLayer,
        corridorsLayer,
        routesLayer,
        icebergsLayer,
        vesselLayer,
      ],
      view: new View({
        projection: antarcticProjection!,
        center: centerCoords,
        zoom: 6.8,
        minZoom: 4.5,
        maxZoom: 11,
      }),
      controls: [], // Custom Google Maps style floating controls
    });

    // Handle map clicks for all interactive features
    map.on('click', (evt) => {
      let featureFound = false;
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const properties = feature.getProperties();

        if (properties.type === 'vessel') {
          onSelectShip();
          featureFound = true;
          return true;
        } else if (properties.type === 'iceberg') {
          onSelectIceberg(properties.icebergData);
          featureFound = true;
          return true;
        } else if (properties.type === 'turnBack') {
          onSelectTurnBack(properties.waypointData);
          featureFound = true;
          return true;
        } else if (properties.type === 'waypoint') {
          onSelectWaypoint(properties.waypointData);
          featureFound = true;
          return true;
        } else if (properties.type === 'routeLine') {
          onSelectRoute(properties.routeData.id);
          featureFound = true;
          return true;
        } else if (properties.type === 'gridCell') {
          onSelectCell(properties.cellData);
          featureFound = true;
          return true;
        }
      });

      if (!featureFound) {
        onSelectCell(null);
      }
    });

    // Handle mouse pointer hover effect
    map.on('pointermove', (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel, {
        layerFilter: (layer) => layer !== graticuleLayer && layer !== landLayer,
      });
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Polar Graticules (Subtle, clean Google Maps grid)
  useEffect(() => {
    const source = graticuleSourceRef.current;
    source.clear();

    if (!showGraticule) return;

    const latLines = [-62.0, -64.0, -66.0, -68.0, -70.0, -72.0];
    const lonLines = [-55.0, -60.0, -65.0, -70.0, -75.0];

    // Latitude circles (parallels)
    latLines.forEach((lat) => {
      const points: [number, number][] = [];
      for (let lon = -76.0; lon <= -54.0; lon += 0.5) {
        points.push(projectCoords(lon, lat));
      }
      const feature = new Feature({
        geometry: new LineString(points),
      });
      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color: 'rgba(148, 163, 184, 0.28)',
            width: 1,
            lineDash: [4, 6],
          }),
          text: new Text({
            text: `${Math.abs(lat)}°S`,
            font: '500 10px "Inter", sans-serif',
            fill: new Fill({ color: '#64748b' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
            offsetX: 30,
            placement: 'line',
          }),
        })
      );
      source.addFeature(feature);
    });

    // Longitude lines (meridians)
    lonLines.forEach((lon) => {
      const points: [number, number][] = [];
      for (let lat = -61.5; lat >= -73.0; lat -= 0.5) {
        points.push(projectCoords(lon, lat));
      }
      const feature = new Feature({
        geometry: new LineString(points),
      });
      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color: 'rgba(148, 163, 184, 0.28)',
            width: 1,
            lineDash: [4, 6],
          }),
          text: new Text({
            text: `${Math.abs(lon)}°W`,
            font: '500 10px "Inter", sans-serif',
            fill: new Fill({ color: '#64748b' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
            offsetY: -15,
            placement: 'line',
          }),
        })
      );
      source.addFeature(feature);
    });
  }, [showGraticule]);

  // 3. Render Antarctic Landmass & Research Stations (Clean Light Google Maps Style)
  useEffect(() => {
    const source = landSourceRef.current;
    source.clear();

    // Render Land Features from GeoJSON
    ANTARCTIC_GEO_DATA.features.forEach((feat) => {
      const rawCoords = feat.geometry.coordinates[0];
      const projectedPolygon = rawCoords.map(([lon, lat]) => projectCoords(lon, lat));

      const polygonFeature = new Feature({
        geometry: new Polygon([projectedPolygon]),
        properties: feat.properties,
      });

      const isIceShelf = feat.properties.type === 'ice_shelf';

      polygonFeature.setStyle(
        new Style({
          fill: new Fill({
            color: isIceShelf ? 'rgba(224, 242, 254, 0.75)' : '#ffffff',
          }),
          stroke: new Stroke({
            color: isIceShelf ? '#38bdf8' : '#cbd5e1',
            width: isIceShelf ? 1.5 : 1.5,
            lineDash: isIceShelf ? [5, 4] : undefined,
          }),
          text: new Text({
            text: feat.properties.name,
            font: isIceShelf ? '600 11px "Inter", sans-serif' : '500 11px "Inter", sans-serif',
            fill: new Fill({ color: isIceShelf ? '#0284c7' : '#334155' }),
            stroke: new Stroke({ color: '#ffffff', width: 3.5 }),
            overflow: true,
          }),
        })
      );
      source.addFeature(polygonFeature);
    });

    // Render Research Station Markers
    POLAR_STATIONS.forEach((station) => {
      const coords = projectCoords(station.lon, station.lat);
      const isDestination = station.code === 'EGAR'; // Rothera Research Station destination

      const feature = new Feature({
        geometry: new Point(coords),
        properties: { type: 'station', stationData: station },
      });

      if (isDestination) {
        // Crisp Google Maps Destination Pin for Rothera Base
        feature.setStyle(
          new Style({
            image: new Icon({
              src: createDestinationPinSvg(),
              anchor: [0.5, 0.95],
              scale: 0.85,
            }),
            text: new Text({
              text: `📍 ${station.name}`,
              font: 'bold 11px "Inter", sans-serif',
              fill: new Fill({ color: '#dc2626' }),
              stroke: new Stroke({ color: '#ffffff', width: 3.5 }),
              offsetY: -34,
            }),
          })
        );
      } else {
        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 4.5,
              fill: new Fill({ color: '#3b82f6' }),
              stroke: new Stroke({ color: '#ffffff', width: 2 }),
            }),
            text: new Text({
              text: station.name.split('(')[0],
              font: '500 10px "Inter", sans-serif',
              fill: new Fill({ color: '#475569' }),
              stroke: new Stroke({ color: '#ffffff', width: 3 }),
              offsetY: -12,
            }),
          })
        );
      }
      source.addFeature(feature);
    });
  }, []);

  // 4. Render AI Dynamic Ice Risk Field (Google Maps Traffic Layer Heatmap)
  useEffect(() => {
    const source = gridSourceRef.current;
    source.clear();

    if (!showRiskGrid) return;

    const cellWidthDeg = 0.5;
    const cellHeightDeg = 0.25;

    gridCells.forEach((cell) => {
      const minLon = cell.lon - cellWidthDeg / 2;
      const maxLon = cell.lon + cellWidthDeg / 2;
      const minLat = cell.lat - cellHeightDeg / 2;
      const maxLat = cell.lat + cellHeightDeg / 2;

      const polygonCoords = [
        projectCoords(minLon, minLat),
        projectCoords(maxLon, minLat),
        projectCoords(maxLon, maxLat),
        projectCoords(minLon, maxLat),
        projectCoords(minLon, minLat),
      ];

      const feature = new Feature({
        geometry: new Polygon([polygonCoords]),
        type: 'gridCell',
        cellData: cell,
      });

      // Google Maps Traffic-style smooth transparent heatmap colors:
      // 0–20 = SAFE (Green)
      // 21–40 = LOW (Yellow)
      // 41–60 = MODERATE (Orange)
      // 61–80 = HIGH (Red)
      // 81–100 = EXTREME (Dark Crimson)
      const score = cell.predictedRisk;
      let fillColor = 'rgba(34, 197, 94, 0.20)';
      let borderColor = 'rgba(34, 197, 94, 0.35)';

      if (score <= 20) {
        fillColor = 'rgba(34, 197, 94, 0.20)';
        borderColor = 'rgba(34, 197, 94, 0.35)';
      } else if (score <= 40) {
        fillColor = 'rgba(234, 179, 8, 0.28)';
        borderColor = 'rgba(234, 179, 8, 0.45)';
      } else if (score <= 60) {
        fillColor = 'rgba(249, 115, 22, 0.40)';
        borderColor = 'rgba(249, 115, 22, 0.55)';
      } else if (score <= 80) {
        fillColor = 'rgba(239, 68, 68, 0.50)';
        borderColor = 'rgba(239, 68, 68, 0.70)';
      } else {
        fillColor = 'rgba(225, 29, 72, 0.65)';
        borderColor = 'rgba(225, 29, 72, 0.85)';
      }

      const isSelected = selectedCell?.cellId === cell.cellId;

      feature.setStyle(
        new Style({
          fill: new Fill({ color: isSelected ? 'rgba(26, 115, 232, 0.35)' : fillColor }),
          stroke: new Stroke({
            color: isSelected ? '#1a73e8' : borderColor,
            width: isSelected ? 2.5 : 0.75,
          }),
          text: new Text({
            text: score >= 45 || isSelected ? `${score}` : '',
            font: isSelected ? 'bold 11px "Inter", sans-serif' : '500 10px "Inter", sans-serif',
            fill: new Fill({ color: score >= 60 ? '#991b1b' : (score >= 40 ? '#9a3412' : '#166534') }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
          }),
        })
      );

      source.addFeature(feature);
    });
  }, [gridCells, selectedCell, showRiskGrid]);

  // 5. Render Routes (Google Maps Navigation Style) & Waypoints
  useEffect(() => {
    const source = routesSourceRef.current;
    source.clear();

    if (!showRoutes) return;

    routes.forEach((route) => {
      const isActive = route.id === activeRouteId;
      const points = route.waypoints.map((wp) => projectCoords(wp.lon, wp.lat));

      // Draw Underlay White Casing (Google Maps route style)
      const routeCasing = new Feature({
        geometry: new LineString(points),
        type: 'routeLine',
        routeData: route,
      });

      routeCasing.setStyle(
        new Style({
          stroke: new Stroke({
            color: '#ffffff',
            width: isActive ? 8 : 5.5,
          }),
          zIndex: isActive ? 24 : 20,
        })
      );
      source.addFeature(routeCasing);

      // Draw Route Core Line
      if (isActive && route.id === 'ROUTE_A') {
        // Route A has a normal section and a high-risk section (WP5 - WP7)
        const safeSegment1 = points.slice(0, 5);
        const dangerSegment = points.slice(4, 7);
        const safeSegment2 = points.slice(6);

        // Safe Segment 1
        const line1 = new Feature({ geometry: new LineString(safeSegment1), type: 'routeLine', routeData: route });
        line1.setStyle(new Style({ stroke: new Stroke({ color: '#1a73e8', width: 5.5 }), zIndex: 25 }));
        source.addFeature(line1);

        // Danger Hazard Segment (Red/Orange navigation line like Google Maps traffic congestion!)
        const lineDanger = new Feature({ geometry: new LineString(dangerSegment), type: 'routeLine', routeData: route });
        lineDanger.setStyle(new Style({ stroke: new Stroke({ color: '#ef4444', width: 6 }), zIndex: 26 }));
        source.addFeature(lineDanger);

        // Safe Segment 2
        const line2 = new Feature({ geometry: new LineString(safeSegment2), type: 'routeLine', routeData: route });
        line2.setStyle(new Style({ stroke: new Stroke({ color: '#1a73e8', width: 5.5 }), zIndex: 25 }));
        source.addFeature(line2);
      } else {
        const routeLine = new Feature({
          geometry: new LineString(points),
          type: 'routeLine',
          routeData: route,
        });

        routeLine.setStyle(
          new Style({
            stroke: new Stroke({
              color: isActive ? '#1a73e8' : '#94a3b8',
              width: isActive ? 5.5 : 3.5,
            }),
            zIndex: isActive ? 25 : 21,
          })
        );
        source.addFeature(routeLine);
      }

      // Draw waypoints on the active route
      if (isActive) {
        route.waypoints.forEach((wp) => {
          const wpCoords = projectCoords(wp.lon, wp.lat);
          const isSelected = selectedWaypointId === wp.id;
          const isTurnBack = wp.isLastSafeTurnBack;

          if (isTurnBack) {
            // Prominent Google Maps Warning / U-Turn Badge for WP6
            const haloFeature = new Feature({
              geometry: new Point(wpCoords),
            });
            haloFeature.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 22,
                  fill: new Fill({ color: 'rgba(245, 158, 11, 0.18)' }),
                  stroke: new Stroke({ color: 'rgba(245, 158, 11, 0.65)', width: 2, lineDash: [4, 4] }),
                }),
              })
            );
            source.addFeature(haloFeature);

            const turnBackMarker = new Feature({
              geometry: new Point(wpCoords),
              type: 'turnBack',
              waypointData: wp,
            });

            turnBackMarker.setStyle(
              new Style({
                image: new Icon({
                  src: createTurnBackSvg(),
                  anchor: [0.5, 0.5],
                  scale: 0.9,
                }),
                text: new Text({
                  text: `↩ LAST SAFE TURN-BACK\n${wp.name} (${wp.id}) • ${wp.escapeReliability}% Escape`,
                  font: 'bold 11px "Inter", sans-serif',
                  fill: new Fill({ color: '#b45309' }),
                  stroke: new Stroke({ color: '#ffffff', width: 3.5 }),
                  offsetY: -32,
                  textAlign: 'center',
                }),
                zIndex: 35,
              })
            );
            source.addFeature(turnBackMarker);
          } else {
            // Standard Google Maps route waypoint dot
            const wpFeature = new Feature({
              geometry: new Point(wpCoords),
              type: 'waypoint',
              waypointData: wp,
            });

            let wpColor = '#1a73e8';
            if (wp.status === 'WARNING') wpColor = '#f59e0b';
            else if (wp.status === 'DANGER' || wp.status === 'NO RELIABLE RETREAT') wpColor = '#ef4444';

            wpFeature.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: isSelected ? 6.5 : 4.5,
                  fill: new Fill({ color: '#ffffff' }),
                  stroke: new Stroke({ color: wpColor, width: isSelected ? 3 : 2 }),
                }),
                text: new Text({
                  text: `${wp.id}`,
                  font: '600 10px "Inter", sans-serif',
                  fill: new Fill({ color: '#334155' }),
                  stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
                  offsetY: 14,
                }),
                zIndex: 30,
              })
            );
            source.addFeature(wpFeature);
          }
        });
      }
    });
  }, [routes, activeRouteId, selectedWaypointId, showRoutes]);

  // 6. Render Escape Corridors (Toggleable layer)
  useEffect(() => {
    const source = corridorsSourceRef.current;
    source.clear();

    if (!showEscapeCorridors) return;

    const activeRoute = routes.find((r) => r.id === activeRouteId);
    if (!activeRoute) return;

    const selectedWp = activeRoute.waypoints.find((w) => w.id === selectedWaypointId) || activeRoute.waypoints[5]; // WP6 default
    if (!selectedWp) return;

    const startCoords = projectCoords(selectedWp.lon, selectedWp.lat);

    const corridors = [
      {
        id: 'corridor-1',
        name: 'Direct Western Breakout (Drake Escape)',
        end: [-67.8, -65.2],
        safe: true,
        reliability: 94,
      },
      {
        id: 'corridor-2',
        name: 'Outer Shelf Passage',
        end: [-68.5, -65.8],
        safe: true,
        reliability: 88,
      },
      {
        id: 'corridor-3',
        name: 'Leeward Island Run',
        end: [-67.2, -66.4],
        safe: selectedWp.escapeReliability >= 50,
        reliability: 72,
      },
      {
        id: 'corridor-4',
        name: 'Shelf Margin Sprint (Blocked)',
        end: [-66.1, -67.2],
        safe: false,
        reliability: 35,
      },
    ];

    corridors.forEach((corr) => {
      const endCoords = projectCoords(corr.end[0], corr.end[1]);
      const midCoords = [
        (startCoords[0] + endCoords[0]) / 2 + (corr.safe ? -20000 : 25000),
        (startCoords[1] + endCoords[1]) / 2 + 15000,
      ];

      // Casing line
      const casing = new Feature({
        geometry: new LineString([startCoords, midCoords, endCoords]),
      });
      casing.setStyle(
        new Style({
          stroke: new Stroke({
            color: '#ffffff',
            width: corr.safe ? 5 : 4,
          }),
        })
      );
      source.addFeature(casing);

      // Core line
      const lineFeature = new Feature({
        geometry: new LineString([startCoords, midCoords, endCoords]),
      });

      lineFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: corr.safe ? 'rgba(22, 163, 74, 0.9)' : 'rgba(220, 38, 38, 0.9)',
            width: corr.safe ? 3 : 2.5,
            lineDash: corr.safe ? [8, 4] : [4, 4],
          }),
          text: new Text({
            text: `${corr.safe ? '✓ RETREAT' : '✗ BLOCKED'} (${corr.reliability}%)`,
            font: '600 10px "Inter", sans-serif',
            fill: new Fill({ color: corr.safe ? '#15803d' : '#b91c1c' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
            placement: 'line',
          }),
        })
      );
      source.addFeature(lineFeature);
    });
  }, [routes, activeRouteId, selectedWaypointId, showEscapeCorridors]);

  // 7. Render Icebergs, Dotted Trajectories & Transparent Uncertainty Cones
  useEffect(() => {
    const source = icebergsSourceRef.current;
    source.clear();

    if (!showIcebergs) return;

    icebergs.forEach((berg) => {
      const currentCoords = projectCoords(berg.currentPosition.lon, berg.currentPosition.lat);
      const isCritical = berg.id === 'ANT-042';

      // Past -> current -> predicted points
      const pastCoords = berg.pastPositions.map((p) => projectCoords(p.lon, p.lat));
      const predCoords = berg.predictedTrajectory.map((p) => projectCoords(p.lon, p.lat));
      const allTrajectoryCoords = [...pastCoords, currentCoords, ...predCoords];

      // 1) Dotted trajectory line
      const trajLine = new Feature({
        geometry: new LineString(allTrajectoryCoords),
      });
      trajLine.setStyle(
        new Style({
          stroke: new Stroke({
            color: isCritical ? '#ef4444' : '#64748b',
            width: isCritical ? 2 : 1.5,
            lineDash: [4, 4],
          }),
        })
      );
      source.addFeature(trajLine);

      // 2) Subtle transparent uncertainty cone
      if (predCoords.length >= 2) {
        const upperEnvelope: [number, number][] = [currentCoords];
        const lowerEnvelope: [number, number][] = [currentCoords];

        berg.predictedTrajectory.forEach((pt, index) => {
          const ptCoord = projectCoords(pt.lon, pt.lat);
          const spreadMeters = (index + 1) * 3500;

          upperEnvelope.push([ptCoord[0] + spreadMeters, ptCoord[1] + spreadMeters * 0.5]);
          lowerEnvelope.unshift([ptCoord[0] - spreadMeters, ptCoord[1] - spreadMeters * 0.5]);
        });

        const conePolygon = [...upperEnvelope, ...lowerEnvelope, currentCoords];
        const coneFeature = new Feature({
          geometry: new Polygon([conePolygon]),
        });
        coneFeature.setStyle(
          new Style({
            fill: new Fill({
              color: isCritical ? 'rgba(239, 68, 68, 0.12)' : 'rgba(148, 163, 184, 0.08)',
            }),
            stroke: new Stroke({
              color: isCritical ? 'rgba(239, 68, 68, 0.35)' : 'rgba(148, 163, 184, 0.2)',
              width: 1,
              lineDash: [3, 4],
            }),
          })
        );
        source.addFeature(coneFeature);
      }

      // 3) Intersection Hazard Marker
      if (berg.shipInteraction?.intersectsRoute && berg.shipInteraction.intersectionLat && berg.shipInteraction.intersectionLon) {
        const interCoords = projectCoords(
          berg.shipInteraction.intersectionLon,
          berg.shipInteraction.intersectionLat
        );

        const hazardFeature = new Feature({
          geometry: new Point(interCoords),
        });
        hazardFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 13,
              fill: new Fill({ color: 'rgba(239, 68, 68, 0.2)' }),
              stroke: new Stroke({ color: '#ef4444', width: 2, lineDash: [3, 3] }),
            }),
            text: new Text({
              text: `⚠️ INTERSECTION IN ${berg.shipInteraction.timeToIntersection}\nPROBABILITY: ${berg.shipInteraction.probabilityPercent}%`,
              font: 'bold 10px "Inter", sans-serif',
              fill: new Fill({ color: '#dc2626' }),
              stroke: new Stroke({ color: '#ffffff', width: 3 }),
              offsetY: -22,
              textAlign: 'center',
            }),
          })
        );
        source.addFeature(hazardFeature);
      }

      // 4) Iceberg Marker Symbol
      const bergMarker = new Feature({
        geometry: new Point(currentCoords),
        type: 'iceberg',
        icebergData: berg,
      });

      const ringColor = isCritical ? '#ef4444' : (berg.riskLevel === 'HIGH' ? '#f97316' : '#10b981');

      bergMarker.setStyle(
        new Style({
          image: new Icon({
            src: createIcebergSvg(ringColor),
            anchor: [0.5, 0.5],
            scale: 0.9,
          }),
          text: new Text({
            text: `${berg.id} (${berg.velocityKnots} kn)`,
            font: isCritical ? 'bold 11px "Inter", sans-serif' : '500 10px "Inter", sans-serif',
            fill: new Fill({ color: isCritical ? '#dc2626' : '#475569' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
            offsetY: 18,
          }),
        })
      );
      source.addFeature(bergMarker);
    });
  }, [icebergs, showIcebergs]);

  // 8. Render MV POLARIS Vessel (Google Maps Navigation Arrow)
  useEffect(() => {
    const source = vesselSourceRef.current;
    source.clear();

    const vesselCoords = projectCoords(vessel.currentLon, vessel.currentLat);

    // 1) Subtle blue circular navigation radius (Google Maps GPS accuracy circle)
    if (showSafetyCorridor) {
      const bufferFeature = new Feature({
        geometry: new Point(vesselCoords),
      });

      bufferFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 26,
            fill: new Fill({ color: 'rgba(26, 115, 232, 0.12)' }),
            stroke: new Stroke({
              color: 'rgba(26, 115, 232, 0.45)',
              width: 1.5,
              lineDash: [4, 4],
            }),
          }),
          text: new Text({
            text: `3 NM SAFETY RADIUS`,
            font: '500 9px "Inter", sans-serif',
            fill: new Fill({ color: '#1a73e8' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 }),
            offsetY: 32,
          }),
        })
      );
      source.addFeature(bufferFeature);
    }

    // 2) Heading Leader Track Line
    const headingRad = (vessel.headingDeg * Math.PI) / 180;
    const leaderLengthMeters = vessel.speedKnots * 1852 * 0.75;
    const endHeadingX = vesselCoords[0] + Math.sin(headingRad) * leaderLengthMeters;
    const endHeadingY = vesselCoords[1] + Math.cos(headingRad) * leaderLengthMeters;

    const headingLine = new Feature({
      geometry: new LineString([vesselCoords, [endHeadingX, endHeadingY]]),
    });
    headingLine.setStyle(
      new Style({
        stroke: new Stroke({
          color: '#1a73e8',
          width: 2,
          lineDash: [4, 4],
        }),
      })
    );
    source.addFeature(headingLine);

    // 3) Google Maps Navigation Arrow Icon (Rotates with vessel heading!)
    const vesselIcon = new Feature({
      geometry: new Point(vesselCoords),
      type: 'vessel',
      vesselData: vessel,
    });

    vesselIcon.setStyle(
      new Style({
        image: new Icon({
          src: createShipArrowSvg(),
          rotation: (vessel.headingDeg * Math.PI) / 180,
          rotateWithView: true,
          anchor: [0.5, 0.5],
          scale: 0.95,
        }),
        text: new Text({
          text: `${vessel.name} • ${vessel.speedKnots} kn`,
          font: 'bold 11px "Inter", sans-serif',
          fill: new Fill({ color: '#1e3a8a' }),
          stroke: new Stroke({ color: '#ffffff', width: 3.5 }),
          offsetY: -26,
          textAlign: 'center',
        }),
      })
    );
    source.addFeature(vesselIcon);
  }, [vessel, showSafetyCorridor]);

  // Recenter map on vessel
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const vesselCoords = projectCoords(vessel.currentLon, vessel.currentLat);
    mapInstanceRef.current.getView().animate({
      center: vesselCoords,
      zoom: 7.2,
      duration: 600,
    });
  };

  const handleResetNorth = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.getView().animate({
      rotation: 0,
      duration: 400,
    });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({ zoom: (view.getZoom() || 7) + 0.5, duration: 250 });
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({ zoom: (view.getZoom() || 7) - 0.5, duration: 250 });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full bg-[#e2ebf4] overflow-hidden select-none">
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Google Maps-Style Layer Toggle Quick Bar (Top Center) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex items-center gap-1.5 gmap-pill px-2.5 py-1.5 rounded-full shadow-lg border border-slate-200/80">
        <button
          onClick={() => onToggleLayer('grid')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showRiskGrid
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Toggle AI Ice Risk Field"
        >
          <Flame className="w-3.5 h-3.5 text-emerald-600" />
          <span>Risk Field</span>
        </button>

        <button
          onClick={() => onToggleLayer('icebergs')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showIcebergs
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Toggle Iceberg Markers & Trajectories"
        >
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          <span>Icebergs</span>
        </button>

        <button
          onClick={() => onToggleLayer('escape')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showEscapeCorridors
              ? 'bg-blue-50 text-blue-700 border border-blue-300 font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Toggle Escape Corridors"
        >
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Escape Corridors</span>
        </button>

        <button
          onClick={() => onToggleLayer('corridor')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showSafetyCorridor
              ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Toggle Ship Safety Radius"
        >
          <Navigation className="w-3 h-3 text-cyan-600" />
          <span>Safety Radius</span>
        </button>

        <button
          onClick={() => onToggleLayer('graticule')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showGraticule
              ? 'bg-slate-100 text-slate-800 border border-slate-300 font-semibold shadow-xs'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Polar Coordinate Graticule"
        >
          <Grid className="w-3 h-3 text-slate-500" />
          <span>Grid</span>
        </button>
      </div>

      {/* Floating Google Maps-Style Navigation Controls (Right Side) */}
      <div className="absolute top-20 right-4 z-20 flex flex-col gap-2">
        {/* Compass / Reset North */}
        <button
          onClick={handleResetNorth}
          title="Reset Map to North"
          className="w-10 h-10 flex items-center justify-center gmap-control-btn rounded-xl shadow-md text-slate-700 hover:text-blue-600 transition-colors"
        >
          <Compass className="w-5 h-5 text-red-500" />
        </button>

        {/* Zoom In & Zoom Out (Grouped like Google Maps) */}
        <div className="flex flex-col rounded-xl overflow-hidden shadow-md border border-slate-200/90 bg-white">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-semibold text-xl transition-colors border-b border-slate-100"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-semibold text-xl transition-colors"
          >
            −
          </button>
        </div>

        {/* Center on My Ship */}
        <button
          onClick={handleRecenter}
          title="Center on MV POLARIS"
          className="w-10 h-10 flex items-center justify-center gmap-control-btn rounded-xl shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Navigation className="w-4 h-4 fill-current transform rotate-45" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={handleToggleFullscreen}
          title="Toggle Fullscreen"
          className="w-10 h-10 flex items-center justify-center gmap-control-btn rounded-xl shadow-md text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Clean Bottom-Left Map Projection Badge (Google Maps Style) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 text-[11px] text-slate-500 gmap-pill px-3 py-1.5 rounded-full shadow-sm">
        <span>EPSG:3031 Polar Stereographic</span>
        <span>•</span>
        <span className="font-medium text-slate-700">Antarctic Peninsula Sector</span>
      </div>
    </div>
  );
};
