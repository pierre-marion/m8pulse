import React from 'react';
import './StatsChart.css';

function StatsChart({ data, vizType = 'table' }) {
  if (!data || data.length === 0) return null;

  const headers = data[0];
  const rows = data.slice(1);

  // Rendu tableau
  if (vizType === 'table') {
    return (
      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Rendu Radar Chart (Triangle/Pentagone selon le nombre de stats)
  if (vizType === 'radar') {
    // Prendre le premier joueur comme exemple
    if (rows.length === 0) return null;
    
    const player = rows[0];
    const stats = headers.slice(2); // Ignorer Joueur et Équipe
    const values = player.slice(2).map(v => parseFloat(v) || 0);
    
    // Normaliser les valeurs pour le radar (0-100)
    const maxValues = stats.map((_, i) => Math.max(...rows.map(r => parseFloat(r[i + 2]) || 0)));
    const normalizedValues = values.map((v, i) => (v / maxValues[i]) * 100);
    
    const size = 300;
    const center = size / 2;
    const radius = size / 2 - 40;
    const angleStep = (Math.PI * 2) / stats.length;

    // Calculer les points du polygone
    const points = normalizedValues.map((value, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const r = (value / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    // Points pour les axes
    const axisPoints = stats.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x, y, angle };
    });

    return (
      <div className="radar-chart-container">
        <h4 className="chart-title">{player[0]} - {player[1]}</h4>
        <svg width={size} height={size} className="radar-chart">
          {/* Grille circulaire */}
          {[0.25, 0.5, 0.75, 1].map((scale, i) => (
            <polygon
              key={i}
              points={stats.map((_, j) => {
                const angle = angleStep * j - Math.PI / 2;
                const r = radius * scale;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="rgba(102, 126, 234, 0.2)"
              strokeWidth="1"
            />
          ))}
          
          {/* Axes */}
          {axisPoints.map((point, i) => (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(102, 126, 234, 0.3)"
              strokeWidth="1"
            />
          ))}
          
          {/* Labels */}
          {axisPoints.map((point, i) => {
            const labelAngle = angleStep * i - Math.PI / 2;
            const labelR = radius + 25;
            const labelX = center + labelR * Math.cos(labelAngle);
            const labelY = center + labelR * Math.sin(labelAngle);
            return (
              <text
                key={i}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="radar-label"
                fontSize="11"
                fontWeight="600"
              >
                {stats[i]}
              </text>
            );
          })}
          
          {/* Polygone des données */}
          <polygon
            points={points}
            fill="rgba(102, 126, 234, 0.3)"
            stroke="#667eea"
            strokeWidth="2"
          />
          
          {/* Points */}
          {normalizedValues.map((value, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const r = (value / 100) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#667eea"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  // Rendu Bar Chart
  if (vizType === 'bar') {
    const statIndex = 2; // Colonne des kills par défaut
    const barData = rows.map(row => ({
      label: row[0],
      value: parseFloat(row[statIndex]) || 0
    }));
    
    const maxValue = Math.max(...barData.map(d => d.value));
    const barHeight = 30;
    const spacing = 10;
    const width = 600;
    const height = barData.length * (barHeight + spacing) + 40;

    return (
      <div className="bar-chart-container">
        <h4 className="chart-title">{headers[statIndex]}</h4>
        <svg width={width} height={height} className="bar-chart">
          {barData.map((d, i) => {
            const barWidth = (d.value / maxValue) * (width - 150);
            const y = i * (barHeight + spacing) + 20;
            
            return (
              <g key={i}>
                <text x="10" y={y + barHeight / 2 + 4} className="bar-label">
                  {d.label}
                </text>
                <rect
                  x="120"
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx="4"
                />
                <text 
                  x={120 + barWidth + 8} 
                  y={y + barHeight / 2 + 4} 
                  className="bar-value"
                >
                  {d.value}
                </text>
              </g>
            );
          })}
          
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Rendu Line Chart
  if (vizType === 'line') {
    const statIndex = 2;
    const lineData = rows.map((row, i) => ({
      x: i,
      y: parseFloat(row[statIndex]) || 0,
      label: row[0]
    }));
    
    const maxValue = Math.max(...lineData.map(d => d.y));
    const width = 600;
    const height = 300;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const points = lineData.map((d, i) => {
      const x = padding + (i / (lineData.length - 1)) * chartWidth;
      const y = height - padding - (d.y / maxValue) * chartHeight;
      return { x, y, ...d };
    });
    
    const pathD = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    return (
      <div className="line-chart-container">
        <h4 className="chart-title">{headers[statIndex]}</h4>
        <svg width={width} height={height} className="line-chart">
          {/* Grille */}
          {[0, 0.25, 0.5, 0.75, 1].map((scale, i) => {
            const y = height - padding - scale * chartHeight;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(102, 126, 234, 0.1)"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Ligne */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
          />
          
          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="#667eea" />
              <text 
                x={p.x} 
                y={height - padding + 20} 
                textAnchor="middle" 
                className="line-label"
                fontSize="10"
              >
                {p.label}
              </text>
            </g>
          ))}
          
          <defs>
            <linearGradient id="lineGradient">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return null;
}

export default StatsChart;
