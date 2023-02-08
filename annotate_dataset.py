import pyspark.sql.functions as F
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, FloatType, StructType, StructField, IntegerType
import pandas as pd
from pyspark.sql.functions import udf

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

def map_emotion_to_label(emotion):
    if emotion == "joy":
        return 1
    elif emotion == "neutral":
        return 2
    elif emotion == "trust":
        return 3
    elif emotion == "anger":
        return 4
    elif emotion == "fear":
        return 5
    elif emotion == "surprise":
        return 6
    elif emotion == "sadness":
        return 7
    elif emotion == "anticipation":
        return 8
    elif emotion == "disgust":
        return 9

map_emotion_to_label_udf = udf(map_emotion_to_label, IntegerType())

# Create a Spark session
spark = SparkSession.builder.appName("EmotionAnnotation").getOrCreate()

# Load the unannotated data into a DataFrame
unannotated_data_df = spark.read.csv("./Dataset/unannotated_data.csv", header=False, inferSchema=True)

# Load the lexicon into a DataFrame
lexicon_df = spark.read.csv("./Dataset/lexicon.csv", header=False, inferSchema=True)

# Rename the columns in the lexicon DataFrame
lexicon_df = lexicon_df.selectExpr("_c0 as word", "_c1 as emotion", "_c2 as intensity")

# Create a lookup dictionary from the lexicon DataFrame
lexicon_dict = lexicon_df.rdd.map(lambda x: (x[0], (x[1], x[2]))).collectAsMap()


def annotate_emotion(text, lexicon_dict):
    emotion = "neutral"
    intensity = 0.0
    words = text.lower().split()

    for word in words:
        if word in lexicon_dict:
            current_emotion, current_intensity = lexicon_dict[word]
            if current_intensity > intensity:
                emotion = current_emotion
                intensity = current_intensity

    return (emotion, intensity)

annotate_emotion_udf = udf(lambda text: annotate_emotion(text, lexicon_dict), returnType=StructType([
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
annotated_data_df = annotated_data_df.drop("Emotion")

annotated_data_df.coalesce(1).write.csv("./Dataset/annotated_data.csv", header=True)
