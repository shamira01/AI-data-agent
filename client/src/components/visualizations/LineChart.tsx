import React, { useState } from 'react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface TimeSeriesData {
  date: string;
  [key: string]: string | number;
}

interface LineChartProps {
  data: TimeSeriesData[];
  title?: string;
  dataKeys: string[];
  colors?: string[];
}

export default function LineChart({ 
  data, 
  title = "Time Series Data", 
  dataKeys,
  colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'] 
}: LineChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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
      
      <div className={`chart-container ${isExpanded ? 'h-96' : 'h-64'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              tickFormatter={(value) => {
                if (typeof value === 'number') {
                  if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}K`;
                  }
                  return `$${value}`;
                }
                return value;
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (typeof value === 'number') {
                  if (typeof name === 'string' && 
                     (name.toLowerCase().includes('amount') || 
                      name.toLowerCase().includes('sales') || 
                      name.toLowerCase().includes('revenue') ||
                      name.toLowerCase().includes('profit'))) {
                    return [formatCurrency(value), name];
                  }
                  return [value, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                name={key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .replace(/([a-z])([A-Z])/g, '$1 $2')}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}