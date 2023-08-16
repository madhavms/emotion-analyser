# Emotion Analyser

The Emotion Analysis System for E-commerce is a machine learning application that predicts the sentiment of product-related content on social media in real-time. The system is built using a trained machine learning model, which is trained on a dataset of social media data, to analyze and predict the sentiment of product-related content on social media. The system includes a user interface developed using React, which provides an intuitive and interactive experience for users. The application uses a REST endpoint developed using Python FastAPI to retrieve real-time tweets related to the product, and the machine learning model is used to make sentiment predictions based on this data.

![System_Architecture.png](https://github.com/madhavms/emotion-analyser/blob/main/images/System_Architecture.png)

# Getting Started
To get started with the Emotion Analysis System, follow these steps:

## Starting up Sentiment Prediction API
```
cd PredictionAPI

uvicorn main:app --reload
```

## Starting up Emotion Analyser User Interface

```
cd sentiment-ui

npm install

npm start
```
