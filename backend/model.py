# import json
# import os
# import random
# import string
# from dotenv import load_dotenv
# from langchain_openai import OpenAIEmbeddings
# import lancedb

# # Load environment variables
# load_dotenv()
# OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# # Initialize the embeddings model
# embeddings_model = OpenAIEmbeddings(
#     model="text-embedding-3-large",
#     openai_api_key=OPENAI_API_KEY
# )

# # Directory containing JSON files
# directory_path = "raw_data"

# # Initialize a list to hold all embedded data
# embedded_vectors = []

# # Connect to LanceDB and drop the table if it exists
# db = lancedb.connect("./lancedb")
# if "my_table" in db.table_names():
#     db.drop_table("my_table")

# # Function to generate a random string identifier
# def generate_random_id(length=8):
#     return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# # Process each JSON file in the directory
# for file_name in os.listdir(directory_path):
#     # Only process files with .json extension
#     if file_name.endswith(".json"):
#         file_path = os.path.join(directory_path, file_name)
        
#         # Print message to track progress
#         print(f"Processing file: {file_name}")
        
#         # Load the article metadata from JSON
#         with open(file_path, "r", encoding="utf-8") as file:
#             article_metadata = json.load(file)
        
#         # Embed the full text
#         embedding = embeddings_model.embed_query(article_metadata["Full Text"])
        
#         # Generate a random ID for this entry
#         random_id = generate_random_id()
        
#         # Append the structured data to embedded_vectors
#         embedded_vectors.append({
#             "id": random_id,  # Assign a random unique ID
#             "embedding": embedding,
#             "metadata": {
#                 "Title": article_metadata.get("Title", ""),
#                 "Authors": article_metadata.get("Authors", ""),
#                 "Year": article_metadata.get("Year", ""),
#                 "Abstract": article_metadata.get("Abstract", ""),
#                 "Keywords": article_metadata.get("Keywords", ""),
#                 "Link": article_metadata.get("Link", ""),
#                 "Full Text": article_metadata.get("Full Text", "")
#             }
#         })

# # Create the table with all data
# tbl = db.create_table("my_table", data=embedded_vectors)

# print("Data from all JSON files in the 'raw_data' directory successfully stored in LanceDB with random IDs.")
import json
import os
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import lancedb
from glob import glob

def create_lance_db():

    # Load environment variables
    load_dotenv()
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

    # Initialize the embeddings model
    embeddings_model = OpenAIEmbeddings(
        model="text-embedding-3-large",
        openai_api_key=OPENAI_API_KEY
    )

    # Path to the raw_data folder containing all JSON files
    raw_data_folder = "./raw_data"
    file_paths = glob(os.path.join(raw_data_folder, "*.json"))

    # Initialize a list to hold all embedded data
    embedded_vectors = []

    # Connect to LanceDB
    db = lancedb.connect("./lancedb")

    # Drop the table if it exists
    if "my_table" in db.table_names():
        db.drop_table("my_table")

    # Process each JSON file in the raw_data folder
    for file_path in file_paths:
        # Load the article metadata from JSON
        with open(file_path, "r", encoding="utf-8") as file:
            article_metadata = json.load(file)
        
        print(f"Processing file: {file_path}")

        # Embed the full text
        embedding = embeddings_model.embed_query(article_metadata.get("Full Text", ""))

        # Append the structured data to embedded_vectors
        embedded_vectors.append({
            "embedding": embedding,
            "metadata": {
                "Title": article_metadata.get("Title", "No title available"),
                "Authors": article_metadata.get("Authors", "Unknown"),
                "Year": article_metadata.get("Year", "No year available"),
                "Abstract": article_metadata.get("Abstract", "No abstract available"),
                "Keywords": article_metadata.get("Keywords", []),
                "Link": article_metadata.get("Link", "No link available"),
                "Full Text": article_metadata.get("Full Text", "No full text available")
            }
        })

    # Create the table and insert data
    tbl = db.create_table("my_table", data=embedded_vectors)

    print("Data from all JSON files in the raw_data folder successfully stored in LanceDB.")


# def fill_vector_db():
#     """
#     Embeds article data from the raw_data folder and inserts it into LanceDB.
#     The vector database is replaced with the new data, but never left empty.
#     """
#     # Initialize a list to hold all embedded data
#     embedded_vectors = []

#     # Process each JSON file in the raw_data folder
#     for file_path in file_paths:
#         # Load the article metadata from JSON
#         with open(file_path, "r", encoding="utf-8") as file:
#             article_metadata = json.load(file)

#         print(f"Processing file: {file_path}")

#         # Embed the full text
#         embedding = embeddings_model.embed_query(article_metadata.get("Full Text", ""))

#         # Append the structured data to embedded_vectors
#         embedded_vectors.append({
#             "embedding": embedding,
#             "metadata": {
#                 "Title": article_metadata.get("Title", "No title available"),
#                 "Authors": article_metadata.get("Authors", "Unknown"),
#                 "Year": article_metadata.get("Year", "No year available"),
#                 "Abstract": article_metadata.get("Abstract", "No abstract available"),
#                 "Keywords": article_metadata.get("Keywords", []),
#                 "Link": article_metadata.get("Link", "No link available"),
#                 "Full Text": article_metadata.get("Full Text", "No full text available")
#             }
#         })

#     # If there are no embedded vectors, print a message and return
#     if not embedded_vectors:
#         print("No data to insert into the vector database.")
#         return

#     # Create a temporary table to insert new data (ensures no empty state)
#     temp_table_name = "temp_table"
#     tbl = db.create_table(temp_table_name, data=embedded_vectors)
    
#     # Only drop the old table after new data has been inserted into the temporary table
#     if "my_table" in db.table_names():
#         db.drop_table("my_table")
    
#     # Rename the temporary table to the main table name
#     db.rename_table(temp_table_name, "my_table")

#     print("Vector database successfully updated with new embeddings.")

