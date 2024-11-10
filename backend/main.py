from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from retrieve import retrieve_top_similar_results
from crawl_data import crawl_data
from model import create_lance_db

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:5173",  # Allow your React frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your React app to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class MessageRequest(BaseModel):
    message: str

class CategoryInput(BaseModel):
    enteredKeyword: str

@app.put("/put-category")
async def put_category(category: CategoryInput):
    """
    Call crawl_data() with request message as input.
    This PUT method does not return a response body.
    """
    crawl_data(category.enteredKeyword)
    create_lance_db()
    return {"message": "raw_data crawled and converted into vectors in LanceDB"}


@app.post("/message")
async def receive_message(request: MessageRequest):
    # Call the function with the input message
    results = retrieve_top_similar_results(request.message)

    # Format results for JSON response (assuming results is a list of tuples)
    formatted_results = [
        {
            "metadata": {
                "Title": result[0]['metadata'].get('Title', 'N/A'),  # Assuming metadata exists
                "Authors": result[0]['metadata'].get('Authors', []),
                "Abstract": result[0]['metadata'].get('Abstract', 'N/A'),
                "Link": result[0]['metadata'].get('Link', 'N/A')
            },
            "similarity": result[1]
        }
        for result in results
    ]

    return {"results": formatted_results}