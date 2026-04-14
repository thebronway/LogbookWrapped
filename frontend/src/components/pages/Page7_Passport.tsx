import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CalculatedStats } from '../../core/types';

interface Props {
  stats: CalculatedStats;
  isExportMode?: boolean;
}

export const Page7_Passport: React.FC<Props> = ({ stats, isExportMode }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) return; 
    
    if (map.current || !mapContainer.current) return; 

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: { name: 'globe' }, 
      zoom: 1,
      center: [-95, 38], 
      interactive: false, 
      attributionControl: false,
      preserveDrawingBuffer: true 
    });

    map.current.on('style.load', () => {
      map.current?.setFog({
        'color': 'rgb(15, 23, 42)', 
        'high-color': 'rgb(30, 58, 138)', 
        'horizon-blend': 0.1,
      });

      const features: GeoJSON.Feature<GeoJSON.LineString>[] = stats.mapData.edges.map(edge => ({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: edge },
        properties: {}
      }));

      map.current?.addSource('routes', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: features }
      });

      map.current?.addLayer({
        id: 'route-lines',
        type: 'line',
        source: 'routes',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#3b82f6', 
          'line-width': 4, 
          'line-opacity': 0.6 
        }
      });

      map.current?.addSource('airports', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: stats.mapData.nodes.map(node => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: node },
            properties: {}
          }))
        }
      });

      map.current?.addLayer({
        id: 'airport-points',
        type: 'circle',
        source: 'airports',
        paint: {
          'circle-radius': 5, 
          'circle-color': '#22d3ee', 
          'circle-opacity': 0.9,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#000000'
        }
      });

      if (stats.mapData.homeBaseCoords) {
        map.current?.addSource('home-base', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: stats.mapData.homeBaseCoords },
            properties: {}
          }
        });

        map.current?.addLayer({
          id: 'home-base-point',
          type: 'circle',
          source: 'home-base',
          paint: {
            'circle-radius': 7, 
            'circle-color': '#fbbf24', 
            'circle-opacity': 1.0,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#000000'
          }
        });
      }

      if (stats.mapData.bounds) {
        map.current?.fitBounds(stats.mapData.bounds, {
          padding: 40,
          duration: isExportMode ? 0 : 3000, 
          essential: true
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stats, isExportMode]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
        
        {/* Top Area: Solid Bar Header */}
        <div className="w-full shrink-0 pt-8 pb-4 px-8 bg-gradient-to-tl from-sky-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-end">
            <h2 className="text-4xl font-black text-sky-400">My Passport.</h2>
        </div>

        {/* Middle Area: Map */}
        <div className="flex-grow w-full relative border-b border-slate-800">
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
            {!import.meta.env.VITE_MAPBOX_TOKEN && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
                <p className="text-red-400 text-sm font-mono border border-red-500/50 bg-red-500/10 p-4 rounded">
                  Missing VITE_MAPBOX_TOKEN in .env
                </p>
              </div>
            )}
        </div>

        {/* Bottom Area: Compact Stats Grid */}
        <div className="w-full shrink-0 pt-6 pb-8 px-4 bg-gradient-to-br from-sky-950 via-slate-900 to-slate-900">
            <div className="grid grid-cols-3 gap-y-6 max-w-sm mx-auto text-center">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sky-200/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Hours</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.totalHours}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-r border-slate-700">
                    <span className="text-sky-200/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Flights</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.totalSorties || 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sky-200/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Distance (NM)</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.totalDistanceNm?.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sky-200/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Airports</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.uniqueAirports || 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-r border-slate-700">
                    <span className="text-sky-200/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Landings</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.totalLandings}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sky-200/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Home Base</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.homeBase}</span>
                </div>
            </div>
        </div>
    </motion.div>
  );
};