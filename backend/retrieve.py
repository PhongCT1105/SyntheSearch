import numpy as np
import pandas as pd
from langchain_openai import OpenAIEmbeddings
import lancedb
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Function to calculate cosine similarity
def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# Initialize the embeddings model
embeddings_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_key=OPENAI_API_KEY
)

# Connect to LanceDB (local database)
db = lancedb.connect("./lancedb")
table_name = "my_table"
tbl = db.open_table(table_name)

# Define the query text
query_text = "Large margin criterion for training neural language models."

# Embed the query text
query_embedding = embeddings_model.embed_query(query_text)

# Convert LanceDB table to a Pandas DataFrame
df = tbl.to_pandas()

# Calculate similarity between query and each embedding in the DataFrame
similarities = []
for _, row in df.iterrows():
    embedding = row["embedding"]
    similarity = cosine_similarity(query_embedding, embedding)
    similarities.append((row, similarity))

# Sort by similarity in descending order and get the top 5 results
similarities.sort(key=lambda x: x[1], reverse=True)
top_results = similarities[:5]

# Display the results
for result, similarity in top_results:
    print("Title:", result['metadata']['Title'])
    print("Authors:", result['metadata']['Authors'])
    print("Abstract:", result['metadata']['Abstract'])
    print("Similarity Score:", similarity)
    print("-" * 50)
