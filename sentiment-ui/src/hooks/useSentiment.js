import { useState, useEffect } from 'react';

const useSentiment = (keyword, setIsLoading, setLoadingMessage) => {
  const [tweets, setTweets] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  console.log("keyword=",keyword)
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoadingMessage('Fetching tweets...');
        const response = await fetch(`http://127.0.0.1:8000/get_tweets?keyword=${keyword.text}`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }});
        setLoadingMessage('Analyzing tweet sentiments...')
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
        setLoadingMessage('Fetching sentiments...')
        console.log('response=',response)
        let data = await response.json();
        setSentiments(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if(!!Object.keys(keyword).length)
    fetchTweets();
  }, [keyword]);

  return [tweets, sentiments];
};

export default useSentiment;
