import React, { useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart } from 'chart.js';

const SentimentPieChart = ({ sentiments }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    Chart.register({
      ArcElement: Chart.elements.Arc,
      DoughnutElement: Chart.elements.Doughnut,
    });
  }, []);
  // Create an object to count the occurrences of each emotion
  const emotionCounts = {
    Sad: 0,
    Angry: 0,
    Fear: 0,
    Surprise: 0,
    Happy: 0,
  };

  // Count the occurrences of each emotion
  sentiments.forEach((sentiment) => {
    emotionCounts[sentiment.Emotion]++;
  });

  // Create an array of data for the chart
  const data = {
    labels: Object.keys(emotionCounts),
    datasets: [
      {
        data: Object.values(emotionCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Sentiment Pie Chart</h2>
      <Pie data={data} />
    </div>
  );
};

export default SentimentPieChart;
