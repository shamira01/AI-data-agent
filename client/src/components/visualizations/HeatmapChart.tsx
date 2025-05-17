import React, { useState } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HeatmapDataPoint {
  x: number | string;
  y: number | string;
  value: number;
  xLabel?: string;
  yLabel?: string;
}

interface HeatmapChartProps {
  data: HeatmapDataPoint[];
  title?: string;
  xName?: string;
  yName?: string;
  valueName?: string;
}

export default function HeatmapChart({ 
  data, 
  title = "Heatmap", 
  xName = "X Axis", 
  yName = "Y Axis",
  valueName = "Value"
}: HeatmapChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Define color scale based on value range
  const getColor = (value: number) => {
    // Find min and max values
    const values = data.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Normalize value between 0 and 1
    const normalized = (value - min) / (max - min);
    
    // Use color gradient from light to dark blue
    // You can adjust these colors for different heatmap styles
    if (normalized < 0.2) return '#EBF5FF';
    if (normalized < 0.4) return '#BFDBFE';
    if (normalized < 0.6) return '#93C5FD'; 
    if (normalized < 0.8) return '#60A5FA';
    return '#3B82F6';
  };
  
  // Custom tooltip to display data details
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-200 shadow-sm rounded">
          <p className="font-medium">{`${xName}: ${dataPoint.xLabel || dataPoint.x}`}</p>
          <p>{`${yName}: ${dataPoint.yLabel || dataPoint.y}`}</p>
          <p>{`${valueName}: ${dataPoint.value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Format axis label if needed
  const formatAxisLabel = (value: string | number) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    // For string values, truncate if too long
    if (typeof value === 'string' && value.length > 12) {
      return `${value.slice(0, 10)}...`;
    }
    return value;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-light-300 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-dark-800">{title}</h3>
        <div className="flex space-x-2">
          <button className="text-xs bg-light-200 hover:bg-light-300 text-dark-800 py-1 px-2 rounded">
            <span className="material-icons text-xs mr-1 align-middle">download</span>
            Export
          </button>
          <button 
            className="text-xs bg-light-200 hover:bg-light-300 text-dark-800 py-1 px-2 rounded"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="material-icons text-xs mr-1 align-middle">
              {isExpanded ? 'fullscreen_exit' : 'fullscreen'}
            </span>
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      <div className={`chart-container ${isExpanded ? 'h-96' : 'h-72'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              name={xName} 
              tickFormatter={formatAxisLabel}
              type={typeof data[0]?.x === 'number' ? 'number' : 'category'}
            />
            <YAxis 
              dataKey="y" 
              name={yName} 
              tickFormatter={formatAxisLabel}
              type={typeof data[0]?.y === 'number' ? 'number' : 'category'}
            />
            <ZAxis 
              dataKey="value" 
              range={[60, 60]} 
              name={valueName} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name={valueName} data={data}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.value)} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center items-center mt-2">
        <div className="flex items-center">
          <div className="text-xs mr-2">Low</div>
          <div className="flex h-3">
            <div className="w-6 h-full bg-[#EBF5FF]"></div>
            <div className="w-6 h-full bg-[#BFDBFE]"></div>
            <div className="w-6 h-full bg-[#93C5FD]"></div>
            <div className="w-6 h-full bg-[#60A5FA]"></div>
            <div className="w-6 h-full bg-[#3B82F6]"></div>
          </div>
          <div className="text-xs ml-2">High</div>
        </div>
      </div>
    </div>
  );
}