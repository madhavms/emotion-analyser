import { useState, useEffect } from 'react';

const useSentiment = (keyword, setIsLoading) => {
  const [tweets, setTweets] = useState([]);
  const [sentiments, setSentiments] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/get_tweets?keyword=${keyword}`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }});
        const data = await response.json();
        setTweets(data);
        analyzeSentiments(data);
      } catch (error) {
        console.error(error);
      }
    };

    const analyzeSentiments = async (tweets) => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sentiment-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tweets),
        });
        let data = await response.json();
        data = JSON.parse(data);
        setSentiments(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if(!!keyword)
    fetchTweets();
  }, [keyword]);

  return [tweets, sentiments];
};

export default useSentiment;
