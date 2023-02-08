from pyspark import SparkContext,SparkConf
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import ArrayType, StringType
import re
from pyspark.ml.feature import StopWordsRemover, CountVectorizer, IDF, StringIndexer
from pyspark.ml import Pipeline
from pyspark.ml.classification import RandomForestClassifier,LogisticRegression
from pyspark.ml.evaluation import MulticlassClassificationEvaluator
from pathlib import Path
SRC_DIR = Path(__file__).resolve().parent


def clean_tweet(tweet):
    #lowercase and remove hashtags, mentions, links, punctuations, etc.
    temp = tweet.lower()
    temp = re.sub("@[A-Za-z0-9_]+","", temp)
    temp = re.sub("#[A-Za-z0-9_]+","", temp)
    temp = re.sub(r"http\S+", "", temp)
    temp = re.sub(r"www.\S+", "", temp)
    temp = re.sub('[()!?]', ' ', temp)
    temp = re.sub('\[.*?\]',' ', temp)
    temp = temp.split()
    return temp

# Create Spark Context and Spark Session
conf = SparkConf().setAppName("EmotionPrediction")
conf.set("spark.driver.memory", "4g")
conf.set("spark.executor.memory", "4g")
sc = SparkContext(conf=conf)
spark = SparkSession.builder.appName("EmotionPrediction").getOrCreate()

# Load data
'''
Emotion Dataset:
Label - Emotion
1     -   joy
2     -   neutral
3     -   trust
4     -   anger
5     -   fear
6     -   surprise
7     -   sadness
8     -   anticipation
9     -   disgust
'''
dataset_path = './Dataset/labelled_data.csv'
df = (
    spark
    .read.format("csv")
    .options(header=True) 
    .load(dataset_path)
)

# Clean and pre-process the tweet text
pre_process = udf(lambda x: clean_tweet(x), ArrayType(StringType()))
df = df.withColumn("processed_data", pre_process(df["Tweet Text"])).dropna()

# Split the data into training and testing sets
train, test = df.randomSplit([0.7, 0.3], seed = 13)

# Create ML pipeline
stop_word_remover = StopWordsRemover(inputCol="processed_data", outputCol="words")
vectorizer = CountVectorizer(inputCol="words", outputCol="tf")
idf = IDF(inputCol="tf", outputCol="features", minDocFreq=3)
label_indexer = StringIndexer(inputCol = "Emotion Label", outputCol = "label")
logistic_regression = LogisticRegression(maxIter=100)

pipeline = Pipeline(stages=[stop_word_remover, vectorizer, idf, label_indexer, logistic_regression])

train.show(5)
# Train the model
model = pipeline.fit(train)

# Predict on test set
prediction = model.transform(test)

# Evaluate the model
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(prediction)

print('\n***********************************************')
print(f"Accuray of prediction: {accuracy}") 
print('\n***********************************************')

model_path = str(SRC_DIR.joinpath('models'))

model.write().overwrite() \
    .save(model_path)
