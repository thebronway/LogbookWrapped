import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CalculatedStats } from '../../core/index';
import { getPage2Copy } from '../../core/Copywriter';

export const Page2_FootprintMap: React.FC<{stats: CalculatedStats, isExportMode?: boolean}> = ({ stats, isExportMode }) => {
  const mapCopy = getPage2Copy(stats);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) return; // Prevent crash if token is missing
    
    if (map.current || !mapContainer.current) return; // initialize map only once

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: { name: 'globe' }, 
      zoom: 1,
      center: [-95, 38], 
      interactive: false, 
      attributionControl: false,
      // CRITICAL FIX: Forces WebGL to keep the map in memory so html2canvas can screenshot it
      preserveDrawingBuffer: true 
    });

    map.current.on('style.load', () => {
      // Add atmosphere for the glowing globe effect
      map.current?.setFog({
        'color': 'rgb(15, 23, 42)', // Slate 900
        'high-color': 'rgb(30, 58, 138)', // Blue 900
        'horizon-blend': 0.1,
      });

      // Prepare GeoJSON for Flight Paths (Edges)
      const features: GeoJSON.Feature<GeoJSON.LineString>[] = stats.mapData.edges.map(edge => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: edge
        },
        properties: {}
      }));

      map.current?.addSource('routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features
        }
      });

      // Add Glowing Lines
      map.current?.addLayer({
        id: 'route-lines',
        type: 'line',
        source: 'routes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6', // Tailwind blue-500
          'line-width': 4, // Thicker lines for better export visibility
          'line-opacity': 0.6 // Slightly higher opacity to help them stand out
        }
      });

      // Prepare GeoJSON for Airports (Nodes)
      map.current?.addSource('airports', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: stats.mapData.nodes.map(node => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: node
            },
            properties: {}
          }))
        }
      });

      // Add Cyan Dots for Airports
      map.current?.addLayer({
        id: 'airport-points',
        type: 'circle',
        source: 'airports',
        paint: {
          'circle-radius': 5, // Larger dots so airports are clearly visible
          'circle-color': '#22d3ee', // Tailwind cyan-400
          'circle-opacity': 0.9,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#000000'
        }
      });

      // Add Gold Dot for Home Base
      if (stats.mapData.homeBaseCoords) {
        map.current?.addSource('home-base', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: stats.mapData.homeBaseCoords
            },
            properties: {}
          }
        });

        map.current?.addLayer({
          id: 'home-base-point',
          type: 'circle',
          source: 'home-base',
          paint: {
            'circle-radius': 7, // Slightly larger than normal airports
            'circle-color': '#fbbf24', // Tailwind amber-400
            'circle-opacity': 1.0,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#000000'
          }
        });
      }

      // Fit map to data bounds
      if (stats.mapData.bounds) {
        map.current?.fitBounds(stats.mapData.bounds, {
          padding: 40,
          // CRITICAL FIX: If exporting, jump instantly (0ms) so the screenshot isn't taken mid-animation
          duration: isExportMode ? 0 : 3000, 
          essential: true
        });
      }
    });

    // Cleanup Mapbox instance on unmount to fix the React Strict Mode warning
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stats]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col h-full w-full bg-slate-900 text-white"
    >
      <div className="flex-1 w-full relative border-b border-slate-700">
        {/* The Mapbox Container */}
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
        
        {/* Fallback Warning if no token */}
        {!import.meta.env.VITE_MAPBOX_TOKEN && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
            <p className="text-red-400 text-sm font-mono border border-red-500/50 bg-red-500/10 p-4 rounded">
              Missing VITE_MAPBOX_TOKEN in .env
            </p>
          </div>
        )}
      </div>
      <div className="p-8 flex flex-col justify-center bg-gradient-to-b from-slate-900 to-blue-950 shrink-0">
        <p className="text-4xl font-black mb-4">Your Footprint.</p>
        <p className="text-slate-300 text-lg leading-relaxed">{mapCopy}</p>
      </div>
    </motion.div>
  );
};