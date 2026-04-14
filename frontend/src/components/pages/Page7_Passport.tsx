import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CalculatedStats } from '../../core/types';
import { useLogbookStore } from '../../store/useLogbookStore';

interface Props {
  stats: CalculatedStats;
  isExportMode?: boolean;
}

export const Page7_Passport: React.FC<Props> = ({ stats, isExportMode }) => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const dateFilter = useLogbookStore((state) => state.dateFilter);

  useEffect(() => {
    Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then(r => r.json()),
      fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json())
    ]).then(([worldTopo, usTopo]) => {
      setGeoData({
        world: topojson.feature(worldTopo, worldTopo.objects.land),
        stateBorders: topojson.mesh(usTopo, usTopo.objects.states, (a, b) => a !== b) 
      });
    });
  }, []);

  useEffect(() => {
    if (!geoData || !mapRef.current) return;

    const width = 1040; 
    const height = 1100; 
    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove();

    const projection = d3.geoMercator();

    if (stats.mapData.nodes.length > 0) {
      const flightBounds = {
        type: "MultiPoint",
        coordinates: stats.mapData.nodes
      };

      projection.fitExtent(
        [[40, 40], [width - 40, height - 40]], 
        flightBounds as any
      );
    } else {
      projection.scale(150).translate([width / 2, height / 2]); 
    }

    const pathGenerator = d3.geoPath().projection(projection);

    svg.append("path")
      .datum(geoData.world)
      .attr("d", pathGenerator as any)
      .attr("fill", "#0f172a") 
      .attr("stroke", "#1e293b") 
      .attr("stroke-width", 1);

    svg.append("path")
      .datum(geoData.stateBorders)
      .attr("d", pathGenerator as any)
      .attr("fill", "none")
      .attr("stroke", "#334155") 
      .attr("stroke-width", 0.75)
      .attr("stroke-dasharray", "3,3");

    stats.mapData.edges.forEach(edge => {
      const routePath = pathGenerator({
        type: "LineString",
        coordinates: edge
      });

      svg.append("path")
        .attr("d", routePath as string)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6") 
        .attr("stroke-width", 6) 
        .attr("stroke-opacity", 0.7) 
        .attr("stroke-linecap", "round");
    });

    stats.mapData.nodes.forEach(node => {
      const coords = projection(node);
      if (coords) {
        svg.append("circle")
          .attr("cx", coords[0])
          .attr("cy", coords[1])
          .attr("r", 8)
          .attr("fill", "#22d3ee") 
          .attr("opacity", 0.9)
          .attr("stroke", "#000000") 
          .attr("stroke-width", 1);
      }
    });

    if (stats.mapData.homeBaseCoords) {
      const homeCoords = projection(stats.mapData.homeBaseCoords);
      if (homeCoords) {
        svg.append("circle")
          .attr("cx", homeCoords[0])
          .attr("cy", homeCoords[1])
          .attr("r", 10) 
          .attr("fill", "#fbbf24") 
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
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col h-full w-full text-white overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #2e1065 35%, #0c4a6e 75%, #020617 100%)' }}
    >
        
        {/* Top Area */}
        <div className="w-full shrink-0 pt-16 pb-12 px-8 border-b border-slate-800/50 flex flex-col justify-center relative z-10 bg-black/20">
            <h2 className="text-4xl font-black text-white m-0 tracking-tight">
              My {titleX}Logbook Passport.
            </h2>
        </div>

        {/* Middle Area: Map */}
        <div className="flex-grow w-full relative border-b border-slate-800/50 flex justify-center items-center overflow-hidden p-4">
            <svg ref={mapRef} viewBox="0 0 1040 1100" preserveAspectRatio="xMidYMid meet" className="w-full h-full max-h-full rounded-2xl bg-slate-950/50 shadow-xl border border-slate-800" />
        </div>

        {/* Bottom Area: Compact Stats Grid */}
        <div className={`w-full shrink-0 px-4 bg-black/30 ${isExportMode ? 'pt-8 pb-20' : 'pt-8 pb-12'}`}>
            <div className="grid grid-cols-3 gap-y-6 max-w-sm mx-auto text-center">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sky-200/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Hours</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.totalHours}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-r border-slate-700">
                    <span className="text-sky-200/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Flights</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.totalFlights || 0}</span>
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