import React from 'react';
import { VictoryPie, VictoryLabel } from 'victory';

const PieChart = ({ sentiments,height,width }) => {
  const COLORS = ["#ff7f0e", "#1f77b4", "#2ca02c", "#d62728", "#9467bd"];
  
  const emotions = sentiments.reduce((acc, { Emotion }) => {
    acc[Emotion] = (acc[Emotion] || 0) + 1;
    return acc;
  }, {});

  const formattedData = Object.keys(emotions).map(emotion => ({
    x: emotion,
    y: emotions[emotion]
  }));

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <h2>Sentiment Analysis Chart</h2>
      <VictoryPie
        data={formattedData}
        colorScale={COLORS}
        innerRadius={60}
        padding={50}
        labelRadius={90}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        labelComponent={<VictoryLabel style={{ fill: 'white', fontWeight: 'bold' }}/>}
      />
    </div>
  );
};

export default PieChart;
