import pyspark.sql.functions as F
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, FloatType, StructType, StructField, IntegerType
import pandas as pd
from pyspark.sql.functions import udf
import text2emotion as te
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')


def map_emotion_to_label(emotion):
    switch = {
        "Happy": 1,
        "Angry": 2,
        "Surprise": 3,
        "Sad": 4,
        "Fear": 5
    }
    return switch.get(emotion, None)


map_emotion_to_label_udf = udf(map_emotion_to_label, IntegerType())

# Create a Spark session
spark = SparkSession.builder.appName("EmotionAnnotation").getOrCreate()

# Load the unannotated data into a DataFrame
unannotated_data_df = spark.read.csv("./Dataset/unannotated_data.csv", header=False, inferSchema=True)

def annotate_emotion(text):
    print('Entered annotate_emotion')
    prediction = te.get_emotion(text)
    intensity = max(prediction.values())
    if intensity == 0:
        emotion = "Neutral"
    else:
        emotion = next(key for key, value in prediction.items() if value == intensity)
    print(f'Text: {text}, Emotion: {emotion}, Intensity: {intensity}')
    return (emotion, intensity)


annotate_emotion_udf = udf(lambda text: annotate_emotion(text), returnType=StructType([
    StructField("emotion", StringType()),
    StructField("intensity", FloatType())
]))

annotated_data_df = unannotated_data_df.withColumn("emotion_intensity", annotate_emotion_udf(unannotated_data_df._c5))
annotated_data_df = annotated_data_df.select("*", F.col("emotion_intensity.emotion").alias("Emotion"), F.col("emotion_intensity.intensity").alias("Intensity"))
annotated_data_df = annotated_data_df.drop("emotion_intensity")
annotated_data_df = annotated_data_df.drop("_c1")
annotated_data_df = annotated_data_df.drop("_c0")
annotated_data_df = annotated_data_df.drop("_c3")
annotated_data_df = annotated_data_df.withColumnRenamed("_c5", "Tweet Text")
annotated_data_df = annotated_data_df.withColumnRenamed("_c2", "Date Time")
annotated_data_df = annotated_data_df.withColumnRenamed("_c4", "User ID")
annotated_data_df = annotated_data_df.withColumn("Emotion Label", map_emotion_to_label_udf("Emotion"))

annotated_data_df.coalesce(1).write.mode("overwrite").csv("./Dataset/annotated_data.csv", header=True)
