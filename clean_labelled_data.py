from pyspark.sql import SparkSession
from pyspark.sql.functions import col

# create a SparkSession
spark = SparkSession.builder.appName("DropRows").getOrCreate()

# read the CSV file into a DataFrame
df = spark.read.csv("./Dataset/labelled_data.csv", header=True)

# filter out rows where the intensity is 0 or empty
df = df.filter((col("Intensity") != 0) & (col("Intensity") != ""))

# write the resulting DataFrame to a new CSV file
df.write.mode("overwrite").csv("./Dataset/labelled_data.csv", header=True)


