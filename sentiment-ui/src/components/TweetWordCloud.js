import React from 'react';
import WordCloud from 'react-wordcloud';

const TweetWordCloud = ({ tweets }) => {
  console.log('Inside TweetWordCloud')
  const options = {
    rotations: 0,
    fontSizes: [20, 80],
    colors: ['#1DA1F2', '#17BF63', '#F45D22', '#794BC4', '#FFAD1F'],
    enableTooltip: false,
    deterministic: true,
  };

  const stopWords = ['a','&amp;','any',"i'll", 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with'];

  const words = tweets
    .join(' ')
    .split(/\s+/)
    .reduce((acc, word) => {
      const lowerCaseWord = word.toLowerCase();
      if (lowerCaseWord.length > 2 && !stopWords.includes(lowerCaseWord) && !lowerCaseWord.startsWith('@') && !lowerCaseWord.startsWith('#') && !lowerCaseWord.startsWith('http')) {
        acc[lowerCaseWord] = acc[lowerCaseWord] ? acc[lowerCaseWord] + 1 : 1;
      }
      return acc;
    }, {});

  const wordCloudData = Object.keys(words).map((word) => ({
    text: word,
    value: words[word],
  }));

  return (<div>
    <h1>Word Cloud</h1>
    <WordCloud words={wordCloudData} options={options} />
    </div>)
};

export default TweetWordCloud;
