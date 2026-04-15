import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CalculatedStats } from '../../core/types';
import { useLogbookStore } from '../../store/useLogbookStore';

interface Props {
  id?: string;
  stats: CalculatedStats;
}

export const PosterPrintLayout: React.FC<Props> = ({ id, stats }) => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  
  // Pull the dateFilter directly from your Zustand store
  const dateFilter = useLogbookStore((state) => state.dateFilter);

  // Option 1: Fetch High-Res World AND US States boundaries
  useEffect(() => {
    Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then(r => r.json()),
      fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()) // Fixed: us-atlas uses 10m resolution
    ]).then(([worldTopo, usTopo]) => {
      setGeoData({
        world: topojson.feature(worldTopo, worldTopo.objects.land),
        // Removed the (a !== b) filter so the outer edges of Texas/Northern states don't disappear
        stateBorders: topojson.mesh(usTopo, usTopo.objects.states) 
      });
    });
  }, []);

  // Draw the D3 Map
  useEffect(() => {
    if (!geoData || !mapRef.current) return;

    const width = 1040; // 1200 - padding
    const height = 1100; // Massively increased map height!
    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove();

    // 1. Setup Projection & Path Generator (Auto-Zooming!)
    const projection = d3.geoMercator();

    if (stats.mapData.nodes.length > 0) {
      // Create a GeoJSON MultiPoint object containing all visited airports
      const flightBounds = {
        type: "MultiPoint",
        coordinates: stats.mapData.nodes
      };

      // Automatically calculate the perfect zoom and pan to frame the flights
      projection.fitExtent(
        [[80, 80], [width - 80, height - 80]], 
        flightBounds as any
      );
    } else {
      // Fallback zoom if logbook is completely empty
      projection.scale(150).translate([width / 2, height / 2]); 
    }

    const pathGenerator = d3.geoPath().projection(projection);

    // 2. Draw Landmasses (High-Res World)
    svg.append("path")
      .datum(geoData.world)
      .attr("d", pathGenerator as any)
      .attr("fill", "#0f172a") // Tailwind slate-900
      .attr("stroke", "#1e293b") // Tailwind slate-800
      .attr("stroke-width", 1);

    // 2b. Draw US State Lines (Subtle Overlay)
    svg.append("path")
      .datum(geoData.stateBorders)
      .attr("d", pathGenerator as any)
      .attr("fill", "none")
      .attr("stroke", "#334155") // Tailwind slate-700
      .attr("stroke-width", 0.75)
      .attr("stroke-dasharray", "3,3"); // Dashed lines for that "aeronautical chart" look

    // 3. Draw Flight Paths (Edges)
    const lineGenerator = d3.line<[number, number]>()
      .x(d => projection(d)![0])
      .y(d => projection(d)![1])
      .curve(d3.curveBasis); // Smooth arcs

    stats.mapData.edges.forEach(edge => {
      // Create a GeoJSON LineString for each edge to wrap around correctly
      const routePath = pathGenerator({
        type: "LineString",
        coordinates: edge
      });

      svg.append("path")
        .attr("d", routePath as string)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6") // Tailwind blue-500
        .attr("stroke-width", 6) // Increased thickness for the printed poster!
        .attr("stroke-opacity", 0.7) // Bumped opacity slightly so they pop more
        .attr("stroke-linecap", "round");
    });

    // 4. Draw Airport Nodes
    stats.mapData.nodes.forEach(node => {
      const coords = projection(node);
      if (coords) {
        svg.append("circle")
          .attr("cx", coords[0])
          .attr("cy", coords[1])
          .attr("r", 8)
          .attr("fill", "#22d3ee") // Cyan-400
          .attr("opacity", 0.9)
          .attr("stroke", "#000000") // Black stroke
          .attr("stroke-width", 1);
      }
    });

    // 5. Highlight Home Base
    if (stats.mapData.homeBaseCoords) {
      const homeCoords = projection(stats.mapData.homeBaseCoords);
      if (homeCoords) {
        svg.append("circle")
          .attr("cx", homeCoords[0])
          .attr("cy", homeCoords[1])
          .attr("r", 12) // Scaled up to stand out against bigger standard nodes
          .attr("fill", "#fbbf24") // Amber-400
          .attr("opacity", 1.0)
          .attr("stroke", "#000000")
          .attr("stroke-width", 2);
      }
    }
  }, [geoData, stats]);

  // Dynamic Title Logic
  let titleX = '';
  if (dateFilter?.type === 'this_year') {
    titleX = `${new Date().getFullYear()} `;
  } else if (dateFilter?.type === 'last_year') {
    titleX = `${new Date().getFullYear() - 1} `;
  } else if (dateFilter?.type === 'all_time') {
    titleX = 'All-Time ';
  }

  return (
    <div 
      id={id} 
      className="text-white flex flex-col relative overflow-hidden font-sans"
      style={{ 
        width: '1200px', 
        height: '1800px', 
        padding: '80px',
        // A rich 4-color "Twilight Aurora" gradient perfect for printing
        background: 'linear-gradient(135deg, #0f172a 0%, #2e1065 35%, #0c4a6e 75%, #020617 100%)'
      }} 
    >
      {/* Sleek Header */}
      <div className="flex justify-between items-end mb-10 border-b border-slate-800 pb-8 shrink-0">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">
            My {titleX}Logbook Passport.
          </h1>
        </div>
        <div className="text-right">
          <p className="text-lg text-slate-500 uppercase tracking-widest font-bold">Home Base</p>
          <p className="text-4xl font-black text-[#ffcc00]">{stats.homeBase}</p>
        </div>
      </div>

      {/* Vector Map */}
      <div className="w-full h-[1100px] mb-12 relative rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 shrink-0">
         <svg ref={mapRef} width="100%" height="100%" className="absolute inset-0" />
      </div>

      {/* Consolidated Infographic Grid */}
      <div className="grid grid-cols-4 gap-6 flex-grow mb-6">
         
         {/* Row 1: Core Totals */}
         <div className="col-span-1 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Hours</h3>
            <p className="text-5xl font-black text-white">{stats.totalHours}</p>
         </div>
         <div className="col-span-1 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Flights</h3>
            <p className="text-5xl font-black text-white">{stats.totalFlights}</p>
         </div>
         <div className="col-span-2 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Distance</h3>
            <p className="text-6xl font-black text-white">{stats.totalDistanceNm?.toLocaleString()} <span className="text-2xl text-slate-600">NM</span></p>
         </div>

         {/* Row 2: Secondary Totals */}
         <div className="col-span-1 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Airports</h3>
            <p className="text-5xl font-black text-white">{stats.uniqueAirports}</p>
         </div>
         <div className="col-span-1 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Landings</h3>
            <p className="text-5xl font-black text-white">{stats.totalLandings}</p>
         </div>
         <div className="col-span-1 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Night Time</h3>
            <p className="text-5xl font-black text-white">{stats.totalNight}</p>
         </div>
         <div className="col-span-1 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Actual + Sim Time</h3>
            <p className="text-5xl font-black text-white">{stats.totalActualAndSim}</p>
         </div>
      </div>

      {/* Footer Attribution */}
      <div className="text-center pt-4 shrink-0">
        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">LogbookWrapped.com</p>
      </div>
    </div>
  );
};