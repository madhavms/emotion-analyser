from pyspark import SparkContext, SparkConf
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf, col
from pyspark.sql.types import ArrayType, StringType
from pyspark.ml.feature import NGram
from pyspark.ml.feature import StringIndexer
import re
from pyspark.ml import Pipeline
from pyspark.ml.feature import StopWordsRemover, CountVectorizer, IDF
from pyspark.ml.classification import NaiveBayes
from pyspark.ml.evaluation import MulticlassClassificationEvaluator
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parent

def clean_tweet(tweet):
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
conf.set("spark.driver.memory", "8g")
conf.set("spark.executor.memory", "8g")
sc = SparkContext(conf=conf)
spark = SparkSession.builder.appName("EmotionPrediction").getOrCreate()

# Load data
dataset_path = './Dataset/labelled_data.csv'
df = (
    spark
    .read.format("csv")
    .options(header=True) 
    .load(dataset_path)
)

# Assuming 'df' is the dataframe
print("Size of dataframe: ", df.count())

# Clean and pre-process the tweet text
pre_process = udf(lambda x: clean_tweet(x), ArrayType(StringType()))
df = df.withColumn("processed_data", pre_process(df["Tweet Text"])).dropna()

# Split the data into training and testing sets
train, test = df.randomSplit([0.8, 0.2], seed = 13)

# Define the preprocessing pipeline
stop_word_remover = StopWordsRemover(inputCol="processed_data", outputCol="words")
vectorizer = CountVectorizer(inputCol="words", outputCol="tf", vocabSize=10000, minDF=5)
ngram = NGram(n=2, inputCol="words", outputCol="bigrams")
idf = IDF(inputCol="tf", outputCol="features", minDocFreq=8)
indexer = StringIndexer(inputCol="Emotion", outputCol="label")
# Define the Naive Bayes Classifier
nb = NaiveBayes(labelCol="label", featuresCol="features", smoothing=2)

# Define the pipeline
pipeline = Pipeline(stages=[stop_word_remover,ngram, vectorizer, idf, indexer, nb])

# Train the model on training set
model = pipeline.fit(train)

# Get the StringIndexerModel object
indexer_model = model.stages[4]

# Show the mapping between emotion and label
print("Mapping between Emotion and label:")
for i, emotion in enumerate(indexer_model.labels):
    print(f"{emotion}: {i}")

# Predict on test set
prediction = model.transform(test)

# Evaluate the model
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(prediction)

print('\n***********************************************')
print(f"Accuracy score: {accuracy}")
print('\n***********************************************')

model_path = str(SRC_DIR.joinpath('models'))

model.write().overwrite() \
    .save(model_path)
