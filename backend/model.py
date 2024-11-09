import json
import os
import random
import string
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
import lancedb

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Initialize the embeddings model
embeddings_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_key=OPENAI_API_KEY
)

# Directory containing JSON files
directory_path = "raw_data"

# Initialize a list to hold all embedded data
embedded_vectors = []

# Connect to LanceDB and drop the table if it exists
db = lancedb.connect("./lancedb")
if "my_table" in db.table_names():
    db.drop_table("my_table")

# Function to generate a random string identifier
def generate_random_id(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Process each JSON file in the directory
for file_name in os.listdir(directory_path):
    # Only process files with .json extension
    if file_name.endswith(".json"):
        file_path = os.path.join(directory_path, file_name)
        
        # Print message to track progress
        print(f"Processing file: {file_name}")
        
        # Load the article metadata from JSON
        with open(file_path, "r", encoding="utf-8") as file:
            article_metadata = json.load(file)
        
        # Embed the full text
        embedding = embeddings_model.embed_query(article_metadata["Full Text"])
        
        # Generate a random ID for this entry
        random_id = generate_random_id()
        
        # Append the structured data to embedded_vectors
        embedded_vectors.append({
            "id": random_id,  # Assign a random unique ID
            "embedding": embedding,
            "metadata": {
                "Title": article_metadata.get("Title", ""),
                "Authors": article_metadata.get("Authors", ""),
                "Year": article_metadata.get("Year", ""),
                "Abstract": article_metadata.get("Abstract", ""),
                "Keywords": article_metadata.get("Keywords", ""),
                "Link": article_metadata.get("Link", "")
            }
        })

# Create the table with all data
tbl = db.create_table("my_table", data=embedded_vectors)

print("Data from all JSON files in the 'raw_data' directory successfully stored in LanceDB with random IDs.")
