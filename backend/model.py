from langchain_openai import OpenAIEmbeddings
import os
import json
from dotenv import load_dotenv
import lancedb

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Initialize the embeddings model
embeddings_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_key=OPENAI_API_KEY
)

# Connect to LanceDB (local database)
db = lancedb.connect("./lancedb")
table_name = "research_embeddings"

raw_data_folder = './raw_data'

# Create a table if it doesn't exist
if table_name not in db.list_tables():
    db.create_table(table_name, schema={"document": "TEXT", "embedding": "VECTOR"})

table = db.get_table(table_name)

# Process each JSON file in the folder
for filename in os.listdir(raw_data_folder):
    if filename.endswith('.json'):
        file_path = os.path.join(raw_data_folder, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            document = data['text']  # Adjust based on your JSON structure
            embedding = embeddings_model.embed(document)  # Generate embedding for the document
            table.insert({"document": document, "embedding": embedding})

print("Data inserted into LanceDB successfully.")