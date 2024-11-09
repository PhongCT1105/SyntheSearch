from langchain_openai import OpenAIEmbeddings

import os
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-large",
    api_key=OPENAI_API_KEY
    # dimensions=1024  # Uncomment if you need to specify dimensions
)

