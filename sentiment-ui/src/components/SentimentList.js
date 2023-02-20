import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  text-align: left;
  background-color: #121212;
  padding: 10px;
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
`;

const SentimentList = ({ sentiments }) => {
  console.log('sentiments=',typeof(sentiments))
  return (
    <div>
      <h2>Sentiment Data</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>Tweet</TableHeader>
            <TableHeader>Emotion</TableHeader>
          </tr>
        </thead>
        <tbody>
          {!!sentiments.length && sentiments.map((sentiment, index) => (
            <tr key={index}>
              <TableData>{sentiment.tweet}</TableData>
              <TableData>{sentiment.Emotion}</TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SentimentList;
