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

def retrieve_top_similar_results(input_text):
    # Embed the query text
    query_embedding = embeddings_model.embed_query(input_text)

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
    return top_results
