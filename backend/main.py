from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:5173",  # Allow your React frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows your React app to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class MessageRequest(BaseModel):
    message: str

@app.post("/message")
async def receive_message(request: MessageRequest):
    # Here, you can process the message and generate a response
    print(f"Received message: {request.message}")
    # For simplicity, we'll return a simple response
    return {"reply": f"Message received: {request.message}"}