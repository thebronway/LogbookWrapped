import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CalculatedStats } from '../../core/types';
import { useLogbookStore } from '../../store/useLogbookStore';
import { RadarLoader } from '../ui/RadarLoader';

interface Props {
  stats: CalculatedStats;
  isExportMode?: boolean;
  exportFormat?: 'story' | 'post';
}

export const Page7_Passport: React.FC<Props> = ({ stats, isExportMode, exportFormat = 'story' }) => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const dateFilter = useLogbookStore((state) => state.dateFilter);

  useEffect(() => {
    Promise.all([
      fetch('/assets/maps/countries-50m.json').then(r => r.json()), 
      fetch('/assets/maps/states-10m.json').then(r => r.json()),
      fetch('/assets/maps/canada.geojson').then(r => r.json()),
      fetch('/assets/maps/ne_10m_lakes.geojson').then(r => r.json())
    ]).then(([worldTopo, usTopo, canadaGeo, lakesGeo]) => {
      
      const allCountries = topojson.feature(worldTopo, worldTopo.objects.countries).features;
      
      // Geographic IDs for the Americas and the complete Caribbean
      const neighborIds = new Set([
        "124", "484", // Canada, Mexico
        "084", "320", "222", "340", "558", "188", "591", // Central America
        "032", "068", "076", "152", "170", "218", "328", "600", "604", "740", "858", "862", "254", "238", // South America
        // The Caribbean
        "044", "192", "388", "332", "214", "630", "136", "796", "028", "052", "092", "780", 
        "212", "308", "659", "662", "670", "850", "660", "500", "312", "474", "652", "663", 
        "534", "533", "531", "535", "060" 
      ]);

      const parsedData = {
        // Now it checks our list to draw all of these neighbors!
        neighbors: allCountries.filter((c: any) => neighborIds.has(c.id)),
        canadaProvinces: canadaGeo.features,
        lakes: lakesGeo.features, // Store the newly fetched lakes
        stateBorders: topojson.mesh(usTopo, usTopo.objects.states),
        stateFeatures: topojson.feature(usTopo, usTopo.objects.states).features,
        countryFeatures: allCountries
      };

      if (isExportMode) {
        setGeoData(parsedData);
      } else {
        // Hold short! Delay D3 rendering by 1.2s so Framer Motion can complete its slide-in animation smoothly
        setTimeout(() => {
          setGeoData(parsedData);
        }, 1200);
      }
    });
  }, [isExportMode]);

  useEffect(() => {
    if (!geoData || !mapRef.current) return;

    const width = 1040; 
    const height = 1100; 
    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove();

    const projection = d3.geoMercator();

    const basePadding = 70;
    let paddingX = basePadding;
    let paddingY = basePadding;

    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const containerAspect = rect.width / rect.height;
        const svgAspect = width / height;

        if (containerAspect < svgAspect) {
          const visibleSvgWidth = height * containerAspect;
          const sliceAmountPerSide = (width - visibleSvgWidth) / 2;
          paddingX = basePadding + sliceAmountPerSide;
        } else {
          const visibleSvgHeight = width / containerAspect;
          const sliceAmountPerSide = (height - visibleSvgHeight) / 2;
          paddingY = basePadding + sliceAmountPerSide;
        }
      }
    }

    if (stats.mapData.nodes.length > 0) {
      const flightBounds = {
        type: "MultiPoint",
        coordinates: stats.mapData.nodes
      };

      projection.fitExtent(
        [[paddingX, paddingY], [width - paddingX, height - paddingY]], 
        flightBounds as any
      );
    } else {
      projection.scale(150).translate([width / 2, height / 2]); 
    }

    const pathGenerator = d3.geoPath().projection(projection);

    // 0. Draw the Ocean / Water base layer
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#000000") 
      .attr("rx", 16); 

    // 1a. Draw Mexico and Canada
    svg.selectAll(".neighbor-country")
      .data(geoData.neighbors || [])
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#0f172a") 
      .attr("stroke", "#1e293b") 
      .attr("stroke-width", 1);

    // 1b. Draw High-Res US states
    svg.selectAll(".base-state")
      .data(geoData.stateFeatures)
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#0f172a") 
      .attr("stroke", "#1e293b") 
      .attr("stroke-width", 1);

    // 2. Identify Visited Territories
    const visitedCountries = geoData.countryFeatures?.filter((feature: any) => 
      feature.id !== "840" && stats.mapData.nodes.some(node => d3.geoContains(feature, node))
    ) || [];
    
    const visitedStates = geoData.stateFeatures?.filter((feature: any) => 
      stats.mapData.nodes.some(node => d3.geoContains(feature, node))
    ) || [];

    // 3. Color in visited Countries (excluding US, styled like states)
    svg.selectAll(".visited-country")
      .data(visitedCountries)
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#1e3a8a") 
      .attr("stroke", "#60a5fa") 
      .attr("stroke-width", 3) 
      .attr("stroke-opacity", 1.0);

    // 4. Color in visited US States (Rich Blue)
    svg.selectAll(".visited-state")
      .data(visitedStates)
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#1e3a8a") 
      .attr("stroke", "#60a5fa") 
      .attr("stroke-width", 3) 
      .attr("stroke-opacity", 1.0);

    // 5. Draw state borders over everything
    svg.append("path")
      .datum(geoData.stateBorders)
      .attr("d", pathGenerator as any)
      .attr("fill", "none")
      .attr("stroke", "#475569") 
      .attr("stroke-width", 0.75)
      .attr("stroke-dasharray", "3,3");

    // 6. Draw Lakes on top of the land.
    svg.selectAll(".lake-overlay")
      .data(geoData.lakes || [])
      .enter().append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#000000") // Matches ocean exactly
      .attr("stroke", "#000000") // Hides any state borders underneath it
      .attr("stroke-width", 1);

    stats.mapData.edges.forEach(edge => {
      const routePath = pathGenerator({
        type: "LineString",
        coordinates: edge
      });

      svg.append("path")
        .attr("d", routePath as string)
        .attr("fill", "none")
        .attr("stroke", "#fbbf24") // Bright Amber/Gold lines
        .attr("stroke-width", 5) 
        .attr("stroke-opacity", 0.8) 
        .attr("stroke-linecap", "round");
    });

    stats.mapData.nodes.forEach(node => {
      const coords = projection(node);
      if (coords) {
        svg.append("circle")
          .attr("cx", coords[0])
          .attr("cy", coords[1])
          .attr("r", 6)
          .attr("fill", "#ffffff") // Pure White airport dots
          .attr("opacity", 1.0)
          .attr("stroke", "#000000") 
          .attr("stroke-width", 1.5);
      }
    });

    if (stats.mapData.homeBaseCoords) {
      const homeCoords = projection(stats.mapData.homeBaseCoords);
      if (homeCoords) {
        svg.append("circle")
          .attr("cx", homeCoords[0])
          .attr("cy", homeCoords[1])
          .attr("r", 12) 
          .attr("fill", "#10b981") // Emerald Green Home Base
          .attr("opacity", 1.0)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 3); 
      }
    }
  }, [geoData, stats, exportFormat]);

  // Dynamic Title Logic
  let titleX = '';
  if (dateFilter?.type === 'this_year') {
    titleX = `${new Date().getFullYear()} `;
  } else if (dateFilter?.type === 'last_year') {
    titleX = `${new Date().getFullYear() - 1} `;
  } else if (dateFilter?.type === 'all_time') {
    titleX = 'All-Time ';
  } else if (dateFilter?.type === 'custom' && dateFilter.start && dateFilter.end) {
    if (dateFilter.start.endsWith('-01-01') && dateFilter.end.endsWith('-12-31')) {
      const startYear = dateFilter.start.substring(0, 4);
      const endYear = dateFilter.end.substring(0, 4);
      if (startYear === endYear) {
        titleX = `${startYear} `;
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col h-full w-full text-white overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #2e1065 35%, #0c4a6e 75%, #020617 100%)' }}
    >
        
        {/* Top Area */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className={`w-full shrink-0 border-b border-slate-800/50 flex flex-col justify-center relative z-10 bg-black/20 ${
            isExportMode 
              ? (exportFormat === 'story' ? 'pt-16 pb-6 px-6' : 'pt-8 pb-4 px-6') 
              : 'pt-10 pb-6 px-5 sm:px-6'
          }`}
        >
            <h2 className={`${exportFormat === 'post' ? 'text-2xl' : 'text-3xl'} font-black text-white m-0 tracking-tight leading-tight`}>
              My {titleX}Logbook Passport.
            </h2>
        </motion.div>

        {/* Middle Area: Map */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          className="flex-grow w-full relative flex justify-center items-center overflow-hidden bg-black"
        >
            <svg ref={mapRef} viewBox="0 0 1040 1100" preserveAspectRatio="xMidYMid slice" className="w-full h-full max-h-full bg-black z-0" />
            
            {/* Radar Sweep Loading State */}
            {!geoData && !isExportMode && <RadarLoader />}
        </motion.div>

        {/* Empty Watermark Stripe */}
        {isExportMode && (
          <div className={`w-full shrink-0 bg-black/30 border-t border-slate-800/50 ${
            exportFormat === 'post' ? 'h-[30px]' : 'h-[36px]'
          }`}></div>
        )}
    </motion.div>
  );
};