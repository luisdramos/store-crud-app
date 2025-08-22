import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '../styles/FloatingPieChart.css';

// Colores para las zonas
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];

const MiniTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="mini-tooltip">
        <p className="mini-tooltip-label">{data.name}</p>
        <p className="mini-tooltip-value">${data.value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const FloatingPieChart = ({ 
  data, 
  className = '' 
}) => {
  // Si no hay datos, no mostrar nada
  if (!data || data.length === 0) {
    return null;
  }

  // Tomar solo las 4 zonas principales para el mini chart
  const topZones = data.slice(0, 4);
  const totalVentas = topZones.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`floating-pie-chart ${className}`}>
      <div className="pie-chart-header">
        <h4>Ventas por Zona</h4>
        <div className="total-mini">${totalVentas.toLocaleString()}</div>
      </div>
      
      <ResponsiveContainer width="100%" height={120}>
        <PieChart>
          <Pie
            data={topZones}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
            paddingAngle={1}
            dataKey="value"
            labelLine={false}
          >
            {topZones.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          
          <Tooltip content={<MiniTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="pie-legend-mini">
        {topZones.slice(0, 3).map((item, index) => (
          <div key={item.name} className="legend-item-mini">
            <div 
              className="legend-dot" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="legend-label">{item.name}</span>
          </div>
        ))}
        {data.length > 3 && (
          <div className="legend-item-mini">
            <div className="legend-dot-more">+{data.length - 3}</div>
            <span className="legend-label">más...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingPieChart;