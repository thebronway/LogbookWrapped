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

  useEffect(() => {
    Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then(r => r.json()),
      fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()),
      fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson').then(r => r.json())
    ]).then(([worldTopo, usTopo, lakesGeo]) => {
      
      const allCountries = topojson.feature(worldTopo, worldTopo.objects.countries).features;
      
      // Geographic IDs for the Americas and the complete Caribbean (Matched to Page 7)
      const neighborIds = new Set([
        "124", "484", // Canada, Mexico
        "084", "320", "222", "340", "558", "188", "591", // Central America
        "032", "068", "076", "152", "170", "218", "328", "600", "604", "740", "858", "862", "254", "238", // South America
        "044", "192", "388", "332", "214", "630", "136", "796", "028", "052", "092", "780", 
        "212", "308", "659", "662", "670", "850", "660", "500", "312", "474", "652", "663", 
        "534", "533", "531", "535", "060" // Caribbean
      ]);

      setGeoData({
        neighbors: allCountries.filter((c: any) => neighborIds.has(c.id)),
        lakes: lakesGeo.features,
        stateBorders: topojson.mesh(usTopo, usTopo.objects.states),
        stateFeatures: topojson.feature(usTopo, usTopo.objects.states).features,
        countryFeatures: allCountries
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

    // 0. Draw the Ocean / Water base layer (Pitch Black)
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#000000") 
      .attr("rx", 32); // Matches rounded corners of the container

    // 1. Draw Neighbors FIRST (Canada, Mexico, South/Central America, Caribbean)
    svg.selectAll(".neighbor-country")
      .data(geoData.neighbors || [])
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#0f172a") 
      .attr("stroke", "#1e293b") 
      .attr("stroke-width", 1);

    // 2. Draw High-Res US states ON TOP of neighbors
    svg.selectAll(".base-state")
      .data(geoData.stateFeatures || [])
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#0f172a") 
      .attr("stroke", "#1e293b") 
      .attr("stroke-width", 1);

    // 3. Identify Visited Territories
    const visitedCountries = geoData.countryFeatures?.filter((feature: any) => 
      stats.mapData.nodes.some(node => d3.geoContains(feature, node))
    ) || [];
    
    const visitedStates = geoData.stateFeatures?.filter((feature: any) => 
      stats.mapData.nodes.some(node => d3.geoContains(feature, node))
    ) || [];

    // 4. Color in visited Countries
    svg.selectAll(".visited-country")
      .data(visitedCountries)
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#1e293b") 
      .attr("stroke", "none");

    // 5. Color in visited US States (Rich Blue)
    svg.selectAll(".visited-state")
      .data(visitedStates)
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#1e3a8a") 
      .attr("stroke", "#60a5fa") 
      .attr("stroke-width", 3) 
      .attr("stroke-opacity", 1.0);

    // 6. Draw state borders over everything
    if (geoData.stateBorders) {
      svg.append("path")
        .datum(geoData.stateBorders)
        .attr("d", pathGenerator as any)
        .attr("fill", "none")
        .attr("stroke", "#475569") 
        .attr("stroke-width", 0.75)
        .attr("stroke-dasharray", "3,3");
    }

    // 7. Draw Lakes ON TOP of the land to cleanly punch them out
    svg.selectAll(".lake-overlay")
      .data(geoData.lakes || [])
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#000000") 
      .attr("stroke", "#000000") 
      .attr("stroke-width", 1);

    // 8. Draw Flight Paths (Edges)
    stats.mapData.edges.forEach(edge => {
      const routePath = pathGenerator({
        type: "LineString",
        coordinates: edge
      });

      svg.append("path")
        .attr("d", routePath as string)
        .attr("fill", "none")
        .attr("stroke", "#fbbf24") // Matched Page 7 (Amber)
        .attr("stroke-width", 5) // Matched Page 7
        .attr("stroke-opacity", 0.8) 
        .attr("stroke-linecap", "round");
    });

    // 9. Draw Airport Nodes
    stats.mapData.nodes.forEach(node => {
      const coords = projection(node);
      if (coords) {
        svg.append("circle")
          .attr("cx", coords[0])
          .attr("cy", coords[1])
          .attr("r", 6) // Matched Page 7
          .attr("fill", "#ffffff") // Matched Page 7 (White)
          .attr("opacity", 1.0)
          .attr("stroke", "#000000") 
          .attr("stroke-width", 1.5);
      }
    });

    // 10. Highlight Home Base
    if (stats.mapData.homeBaseCoords) {
      const homeCoords = projection(stats.mapData.homeBaseCoords);
      if (homeCoords) {
        svg.append("circle")
          .attr("cx", homeCoords[0])
          .attr("cy", homeCoords[1])
          .attr("r", 12) // Matched Page 7
          .attr("fill", "#10b981") // Matched Page 7 (Emerald Green)
          .attr("opacity", 1.0)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 3);
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