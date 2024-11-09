import os
import numpy as np  # Ensure numpy is imported
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
import lancedb

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize the embeddings model
embeddings_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    api_key=OPENAI_API_KEY
)

# Connect to LanceDB
db = lancedb.connect("./lancedb")
table_name = "research_embeddings"

try:
    table = db.open_table(table_name)
    print(f"Table '{table_name}' opened successfully.")
except FileNotFoundError:
    print(f"Table '{table_name}' does not exist.")
    exit()

# Retrieve top 5 similar records
def retrieve_top_5_similar(query):
    query_vector = embeddings_model.embed_query(query)
    results = table.search(query_vector, vector_column_name="embedding").limit(5).to_list()
    print(results)
    # print(f"Top 5 similar results for query: '{query}'")
    # for idx, result in enumerate(results, start=1):
    #     print(f"\nResult {idx}:")
    #     print(f"Title: {result['title']}")
    #     print(f"Authors: {result['authors']}")
    #     print(f"Year: {result['year']}")
    #     print(f"Abstract: {result['abstract']}")
    #     print(f"Link: {result['link']}")
    #     print(f"Similarity Score: {result.get('score', 'N/A')}")

# Example usage
if __name__ == "__main__":
    user_query = "I am working with RAG model research"
    retrieve_top_5_similar(user_query)
