import React, { useState, useEffect } from 'react';
import WordCloud from 'react-wordcloud';

const TweetWordCloud = ({ tweets }) => {
  const [wordCloudData, setWordCloudData] = useState([]);

  useEffect(() => {
    const worker = new Worker('./wordcloud.worker.js');

    worker.onmessage = (event) => {
      setWordCloudData(event.data);
    };

    worker.postMessage(tweets);
    
    return () => {
      worker.terminate();
    };
  }, [tweets]);

  const options = {
    rotations: 0,
    fontSizes: [20, 80],
    colors: ['#1DA1F2', '#17BF63', '#F45D22', '#794BC4', '#FFAD1F'],
    enableTooltip: false,
    deterministic: true,
    // add willReadFrequently attribute to canvas element
    // this will silence the console message
    callbacks: {
      onWordCloudDraw: (words, bounds) => {
        const canvas = document.querySelector('.wordcloud-canvas');
        canvas.setAttribute('willReadFrequently', 'false');
      }
    }
  };
  

  return (
    <div>
      <h3>Word Cloud</h3>
      <div>
        <WordCloud words={wordCloudData} options={options} />
      </div>
    </div>
  );
};

export default TweetWordCloud;
