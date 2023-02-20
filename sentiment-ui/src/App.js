import { useEffect, useState } from 'react';
import './App.css';
import useSentiment from './hooks/useSentiment';
import Loader from './components/Loader';
import SentimentList from './components/SentimentList';

function App() {
  const [keyword, setKeyword] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tweets, sentiments] = useSentiment(keyword, setIsLoading);


  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(text)
    if(text){
      setKeyword(text);
      setIsLoading(true);
    }
  }

  return (
    <div className="App">
      <h1>Enter keyword for sentiment analysis</h1>
      <form onSubmit={handleFormSubmit}>
      <input placeholder="Enter keyword" onChange={e => setText(e.target.value)}/>
      &nbsp;
      <button type="submit" className='btn btn-primary' disabled={!text}>Submit</button>
      </form>
      <br></br>
      <Loader isLoading={isLoading}>
      {!!sentiments.length && <SentimentList sentiments={sentiments}/>}
      </Loader>
    </div>
  );
}

export default App;
