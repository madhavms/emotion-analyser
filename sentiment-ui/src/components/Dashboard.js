import React, { useState } from 'react';
import { Box } from '@mui/system';
import SentimentList from './SentimentList';
import SentimentPieChart from './SentimentPieChart';
import TweetWordCloud from './TweetWordCloud';
import SentimentInsight from './SentimentInsight';

const Dashboard = ({ sentiments = [], tweets = []}) => {
  const [selectedComponent, setSelectedComponent] = useState('insight');

  const renderComponent = () => {
    if (selectedComponent === 'list' && sentiments.length) {
      return <SentimentList sentiments={sentiments} />;
    }
    if (selectedComponent === 'piechart' && sentiments.length) {
      return <SentimentPieChart sentiments={sentiments} height={400} width={400} />;
    }
    if (selectedComponent === 'wordcloud' && sentiments.length) {
      return <TweetWordCloud tweets={sentiments.map((sentiment) => sentiment.tweet)} />;
    }
    if (selectedComponent === 'insight') {
      return <SentimentInsight sentiments={sentiments} />;
    }
    return null;
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4}}>
      {sentiments.length > 0 && (
        <React.Fragment>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                p: 1,
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedComponent === 'insight' ? '#ccc' : 'transparent',
              }}
              onClick={() => setSelectedComponent('insight')}
            >
              <span style={{ fontSize: '1.2rem' }}>Insight</span>
            </Box>
            <Box
              sx={{
                p: 1,
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedComponent === 'list' ? '#ccc' : 'transparent',
              }}
              onClick={() => setSelectedComponent('list')}
            >
              <span style={{ fontSize: '1.2rem' }}>Tweets</span>
            </Box>
            <Box
              sx={{
                p: 1,
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedComponent === 'piechart' ? '#ccc' : 'transparent',
              }}
              onClick={() => setSelectedComponent('piechart')}
            >
              <span style={{ fontSize: '1.2rem' }}>Pie Chart</span>
            </Box>
            <Box
              sx={{
                p: 1,
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedComponent === 'wordcloud' ? '#ccc' : 'transparent',
              }}
              onClick={() => setSelectedComponent('wordcloud')}
            >
              <span style={{ fontSize: '1.2rem' }}>Word Cloud</span>
            </Box>
          </Box>
          <br />
          <br />
          <br />
          {renderComponent()}
        </React.Fragment>
      )}
    </Box>
  );
};

export default Dashboard;
