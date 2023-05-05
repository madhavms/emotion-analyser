from fastapi.middleware.cors import CORSMiddleware
from typing import List
import numpy as np
import torch
from fastapi import FastAPI, HTTPException
from starlette.responses import JSONResponse
from pathlib import Path
import tensorflow as tf
import os
import tweepy
import requests
import json
import re
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from transformers import BertTokenizer, TFBertForSequenceClassification
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi import FastAPI, HTTPException
from starlette.responses import JSONResponse
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
model_path = os.path.join(os.path.dirname(__file__), "../models/BERT")

# Define a list of allowed origins (can also use "*" to allow all origins)
origins = ["*"]


emotion_columns = [
    "admiration",
    "amusement",
    "anger",
    "annoyance",
    "approval",
    "caring",
    "confusion",
    "curiosity",
    "desire",
    "disappointment",
    "disapproval",
    "disgust",
    "embarrassment",
    "excitement",
    "fear",
    "gratitude",
    "grief",
    "joy",
    "love",
    "nervousness",
    "optimism",
    "pride",
    "realization",
    "relief",
    "remorse",
    "sadness",
    "surprise",
    "neutral",
]

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)
model = TFBertForSequenceClassification.from_pretrained(model_path, from_pt=True, num_labels=len(emotion_columns))

def predict_emotion(text):
    # Tokenize the input text
    input_ids = torch.tensor(tokenizer.encode(text, add_special_tokens=True)).unsqueeze(0)

    input_ids = tokenizer.encode(text, add_special_tokens=True)
    input_ids = torch.from_numpy(np.array(input_ids)).unsqueeze(0)

    # Convert the PyTorch tensor to a numpy array
    input_ids_numpy = input_ids.detach().numpy()

    # Convert the numpy array to a TensorFlow tensor
    input_ids_tf = tf.convert_to_tensor(input_ids_numpy)

    # Predict the emotion probabilities
    with torch.no_grad():
        outputs = model(input_ids=input_ids_tf)
        logits = outputs[0]
        probabilities = torch.softmax(torch.tensor(logits.numpy()), dim=1).squeeze()

    # Get the indices of predicted emotion(s)
    indices = [i for i, value in sorted(enumerate(probabilities), key=lambda x: x[1], reverse=True) if value >= 0.5]

    # If no emotion has a predicted value greater than or equal to 0.5, take the next smallest value
    if not indices:
        indices = [i for i, value in sorted(enumerate(probabilities), key=lambda x: x[1], reverse=True) if value > 0.4]
        if not indices:
            indices = [i for i, value in sorted(enumerate(probabilities), key=lambda x: x[1], reverse=True) if value > 0.3]
            if not indices:
                indices = [i for i, value in sorted(enumerate(probabilities), key=lambda x: x[1], reverse=True) if value > 0.2]
                if not indices:
                    indices = [27]

    # Map index positions back to the original emotion names
    emotion_names = [emotion_columns[i] for i in indices]

    return emotion_names



app = FastAPI()

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_tweet(tweet):
    # Remove URLs
    tweet = re.sub(r'http\S+', '', tweet)
    
    # Remove mentions
    tweet = re.sub(r'@\w+', '', tweet)
    
    # Remove hashtags
    tweet = re.sub(r'#\w+', '', tweet)
    
    # Remove non-alphanumeric characters
    tweet = re.sub(r'\W+', ' ', tweet)
    
    # Remove extra whitespace
    tweet = re.sub(r'\s+', ' ', tweet).strip()
    
    # Remove RT
    tweet = re.sub(r'^RT[\s]+', '', tweet)
    
    return tweet

@app.post("/sentiment-analysis")
async def sentiment_analysis(tweets: List[str]):
    result = []
    for tweet in tweets:
        processed_tweet = process_tweet(tweet)
        predicted_emotion = predict_emotion(processed_tweet)
        result.append({"tweet": tweet, "emotion": predicted_emotion})
    return JSONResponse(content=result)


@app.post("/get_tweets/")
def get_tweets(keyword: str):
    # Authenticate to Twitter
    CONSUMER_KEY = os.environ.get("CONSUMER_KEY")
    CONSUMER_SECRET = os.environ.get("CONSUMER_SECRET")
    ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")
    ACCESS_TOKEN_SECRET = os.environ.get("ACCESS_TOKEN_SECRET")
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")
    ACCESS_TOKEN_SECRET = os.environ.get("ACCESS_TOKEN_SECRET")

    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
    api = tweepy.API(auth)

    # Get 100 tweets containing the given keyword
    tweets = api.search(q=keyword, lang="en", count=100, tweet_mode='extended')
    print(tweets)
    # Process each tweet
    tweet_list = []
    for tweet in tweets:
        if tweet.truncated:
             # Access the full text from the extended_tweet field
            full_text = tweet.extended_tweet["full_text"]
        else:
            # Access the full text from the text field
            full_text = tweet.full_text
        tweet_list.append(full_text)

    return tweet_list
