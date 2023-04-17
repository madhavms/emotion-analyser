self.addEventListener('message', (event) => {
    const tweets = event.data;
    const stopWords = ['a', '&amp;', 'any', "i'll", 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with'];
  
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
  
    self.postMessage(wordCloudData);
  });
  