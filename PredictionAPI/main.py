from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi import FastAPI, HTTPException
from starlette.responses import JSONResponse
from pathlib import Path
from tweepy import OAuthHandler
from tweepy import Stream
import os
import tweepy
import requests
import json
import re
import os
from dotenv import load_dotenv, find_dotenv
from pyspark.ml import PipelineModel
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import ArrayType, StringType, StructField, StructType
load_dotenv(find_dotenv())


# Define a list of allowed origins (can also use "*" to allow all origins)
origins = ["http://localhost", "http://localhost:3000"]


def clean_tweet(tweet):
    temp = tweet.lower()
    temp = re.sub("@[A-Za-z0-9_]+", "", temp)
    temp = re.sub("#[A-Za-z0-9_]+", "", temp)
    temp = re.sub(r"http\S+", "", temp)
    temp = re.sub(r"www.\S+", "", temp)
    temp = re.sub('[()!?]', ' ', temp)
    temp = re.sub('\[.*?\]', ' ', temp)

    temp = temp.split()
    stopwords = ["for", "on", "an", "a", "of",
                 "and", "in", "the", "to", "from"]
    temp = [w for w in temp if w not in stopwords]

    return temp


def map_label_to_emotion(label):
    label = int(label)
    switch = {
        0: 'Sad',
        1: 'Happy',
        2: 'Fear',
        3: 'Surprise',
        4: 'Angry'
    }
    return switch.get(label, None)


app = FastAPI()

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/sentiment-analysis")
async def sentiment_analysis(tweets: List[str]):

    spark = SparkSession \
        .builder \
        .appName('Sentiment Analysis') \
        .master("local[*]") \
        .getOrCreate()

    model_path = os.path.join(os.path.dirname(__file__), "../models")
    pipeline_model = PipelineModel.load(model_path)

    text_df = spark.createDataFrame(tweets, StringType()).toDF("tweet")

    pre_process = udf(lambda x: clean_tweet(x), ArrayType(StringType()))
    text_df = text_df.withColumn(
        "processed_data", pre_process(text_df.tweet)).dropna()

    prediction_df = pipeline_model.transform(text_df)
    sentiment_udf = udf(lambda x: map_label_to_emotion(x))
    prediction_df = prediction_df.withColumn(
        'Emotion', sentiment_udf(prediction_df['prediction']))
    prediction_df.show()
    return JSONResponse(content=json.dumps(prediction_df.select("tweet", "Emotion").toPandas().to_dict(orient="records")))


@app.post("/get_tweets/")
def get_tweets(keyword: str):
    # Authenticate to Twitter
    CONSUMER_KEY = os.environ.get("CONSUMER_KEY")
    CONSUMER_SECRET = os.environ.get("CONSUMER_SECRET")
    ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")
    ACCESS_TOKEN_SECRET = os.environ.get("ACCESS_TOKEN_SECRET")

    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
    api = tweepy.API(auth)

    # Get 100 tweets containing the given keyword
    tweets = api.search(q=keyword, lang="en", count=100)

    # Process each tweet
    tweet_list = []
    for tweet in tweets:
        tweet_list.append(tweet.text)

    return tweet_list
