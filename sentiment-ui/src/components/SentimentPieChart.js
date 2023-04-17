import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Typography, Box, Paper } from "@material-ui/core";

const SentimentPieChart = ({ sentiments, height, width }) => {
  const COLORS = ["#ff7f0e", "#1f77b4", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];
  const emotions = sentiments.reduce((acc, { emotion }) => {
    if (emotion) {
      if (Array.isArray(emotion)) {
        emotion.forEach((e) => {
          acc[e] = (acc[e] || 0) + 1;
        });
      } else {
        const emotion_temp = Array.isArray(JSON.parse(emotion))
          ? JSON.parse(emotion)
          : [emotion];
        emotion_temp.forEach((e) => {
          acc[e] = (acc[e] || 0) + 1;
        });
      }
    }
    return acc;
  }, {});

  const threshold = 5;
  const sortedEmotions = Object.keys(emotions).sort(
    (a, b) => emotions[b] - emotions[a]
  );

  const data = sortedEmotions.slice(0, threshold).map((emotion, index) => ({
    id: emotion,
    value: emotions[emotion],
    label: `${emotion}: ${emotions[emotion]}`
  }));

  if (sortedEmotions.length > threshold) {
    const otherEmotions = sortedEmotions.slice(threshold);
    const otherCount = otherEmotions.reduce(
      (total, emotion) => total + emotions[emotion],
      0
    );
    data.push({
      id: "other",
      value: otherCount,
      label: `other: ${otherCount}`,
    });
  }

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      <Typography variant="h5" gutterBottom>
        Sentiment Analysis Chart
      </Typography>
      <Box width="100%" height="100%">
      <Paper elevation={3} style={{ borderRadius: "16px", width: 2*width, height: height, margin:'auto'}}>
      <Box width="100%" height="100%">
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [
              [
                'darker',
                0.2
              ]
            ]
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [
              [
                'darker',
                2
              ]
            ]
          }}
          colors={COLORS}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.4)',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          fill={data.map((emotion, index) => ({
            match: { id: emotion.id },
            id: index % 2 === 0 ? 'dots' : 'lines',
          }))}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      </Box>
      </Paper>
      </Box>
    </div>
  );
};

export default SentimentPieChart;

