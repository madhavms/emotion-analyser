import React, { useState } from 'react';
import './App.css';
import useSentiment from './hooks/useSentiment';
import Loader from './components/Loader';
import { TextField, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';


function App() {
  const [keyword, setKeyword] = useState({});
  const [loadingMessage, setLoadingMessage] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayComponent, setDisplayComponent] = useState('');

  const [tweets, sentiments] = useSentiment(keyword, setIsLoading, setLoadingMessage);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (text) {
      setKeyword({ text });
      setIsLoading(true);
    }
  };

  const handleDisplayComponent = (component) => {
    setDisplayComponent(component);
  };

  return (
    <div>
      <Navbar {...{title:'Emotion Analyser'}}/>
      <Box sx={{ textAlign: 'center', mt: 16 }}>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Enter keyword"
            variant="outlined"
            size="small"
            onChange={(e) => setText(e.target.value)}
            sx={{ mr: 1, backgroundColor: 'white', color: 'white', borderColor: 'white' }}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!text}
            sx={{ backgroundColor: text ? '#2196f3' : '#333333', color: 'white', '&:hover': { backgroundColor: text ? '#0d47a1' : '#333333' } }}
          >
            Submit
          </Button>
        </form>
        <br />
        <Loader isLoading={isLoading} loadingMessage={loadingMessage}>
        <Dashboard {...{tweets, sentiments}}/>
        </Loader>
      </Box>
    </div>
  );
}

export default App;
