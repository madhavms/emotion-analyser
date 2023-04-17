import React from 'react';

const SentimentInsight = ({ sentiments }) => {
  const categories = {
    positive: ["amusement", "excitement", "joy", "love", "desire", "optimism", "caring", "pride", "admiration", "gratitude", "relief", "approval"],
    negative: ["fear", "nervousness", "remorse", "embarrassment", "disappointment", "sadness", "grief", "disgust", "anger", "annoyance", "disapproval"],
    ambiguous: ["realization", "surprise", "curiosity", "confusion"]
  };
  const emotions = {
    positive: { count: 0, examples: [] },
    negative: { count: 0, examples: [] },
    ambiguous: { count: 0, examples: [] }
  };
  
  sentiments.forEach((sentiment) => {
    const { emotion } = sentiment;
    if (emotion) {
      if (Array.isArray(emotion)) {
        emotion.forEach((e) => {
          let found = false;
          Object.keys(categories).forEach((category) => {
            if (categories[category].includes(e)) {
              emotions[category].count += 1;
              emotions[category].examples.push(sentiment.text);
              found = true;
            }
          });
          if (!found) {
            emotions.ambiguous.count += 1;
            emotions.ambiguous.examples.push(sentiment.text);
          }
        });
      } else {
        let found = false;
        Object.keys(categories).forEach((category) => {
          if (categories[category].includes(emotion)) {
            emotions[category].count += 1;
            emotions[category].examples.push(sentiment.text);
            found = true;
          }
        });
        if (!found) {
          emotions.ambiguous.count += 1;
          emotions.ambiguous.examples.push(sentiment.text);
        }
      }
    }
  });
  
  

  const totalSentiments = Object.values(emotions).reduce((acc, emotion) => acc + emotion.count, 0);

  return (
    <div>
      <h2>Sentiment Analysis Insights</h2>
      <p>Out of {totalSentiments} sentiments analyzed:</p>
      <ul style={{ display: 'flex', alignItems: 'center', flexDirection:'column' }}>
      {Object.keys(emotions).map((category) => {
        if (emotions[category].count === 0) {
          return null;
        }
        return (
          <li key={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}:&nbsp;{emotions[category].count}&nbsp;({((emotions[category].count / totalSentiments) * 100).toFixed(2)}%)
          </li>
        );
      })}
    </ul>    
    </div>
  );  
};

export default SentimentInsight;
