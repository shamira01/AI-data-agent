import React, { useState } from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PieDataPoint {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieDataPoint[];
  title?: string;
  valueName?: string;
  colors?: string[];
}

export default function PieChart({ 
  data, 
  title = "Distribution", 
  valueName = "Value",
  colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#A855F7', '#14B8A6'] 
}: PieChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatPercent = (value: number) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return `${((value / total) * 100).toFixed(1)}%`;
  };
  
  const formatValue = (value: number) => {
    // Determine if values represent currency (you might need different logic based on your data)
    if (valueName.toLowerCase().includes('revenue') || 
        valueName.toLowerCase().includes('sales') || 
        valueName.toLowerCase().includes('price') ||
        valueName.toLowerCase().includes('amount')) {
      return formatCurrency(value);
    }
    return value.toLocaleString();
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-200 shadow-sm rounded">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-sm">{`${valueName}: ${formatValue(data.value)}`}</p>
          <p className="text-xs text-gray-500">{formatPercent(data.value)}</p>
        </div>
      );
    }
    return null;
  };
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
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
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={isExpanded ? 120 : 80}
              innerRadius={isExpanded ? 60 : 40}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                  stroke={activeIndex === index ? '#fff' : 'none'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  className="hover:opacity-90 transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => (
                <span className="text-sm">{value}</span>
              )}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        {data.slice(0, 3).map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500">{item.name}</div>
            <div className="font-medium text-sm">{formatValue(item.value)}</div>
            <div className="text-xs" style={{ color: colors[index % colors.length] }}>
              {formatPercent(item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}