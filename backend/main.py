# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from retrieve import retrieve_top_similar_results
from synthesis import generate_synthesis
import logging
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:5173",  # Allow your React frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Check API key
if not OPENAI_API_KEY:
    logging.error("OpenAI API key not found. Please set OPENAI_API_KEY in .env file.")
    raise EnvironmentError("OpenAI API key not found.")

# Initialize the language model
llm = ChatOpenAI(model="gpt-4o-mini", api_key=OPENAI_API_KEY)

# Define the prompt templates for summary and suggestions
summary_prompt = ChatPromptTemplate.from_messages(
    [("system", "Provide a very brief summary (1-2 sentences) in format 1. Main goals, 2. Methods, 3. Findings:\n\n{context}")]
)
suggestions_prompt = ChatPromptTemplate.from_messages(
    [("system", "Generate a few short (2-3 sentences), actionable suggestions for future research based on the author's work:\n\n{context}")]
)

# Set up chains for summary and suggestions with output parsers
summary_chain = summary_prompt | llm | StrOutputParser()
suggestions_chain = suggestions_prompt | llm | StrOutputParser()

class FullTextRequest(BaseModel):
    full_text: str

class MessageRequest(BaseModel):
    message: str

class SynthesisRequest(BaseModel):
    full_texts: list[str]

@app.post("/message")
async def receive_message(request: MessageRequest):
    results = retrieve_top_similar_results(request.message)

    # Format results for JSON response (assuming results is a list of tuples)
    formatted_results = [
        {
            "metadata": {
                "Title": result[0]['metadata'].get('Title', 'N/A'),
                "Authors": result[0]['metadata'].get('Authors', []),
                "Abstract": result[0]['metadata'].get('Abstract', 'N/A'),
                "Link": result[0]['metadata'].get('Link', 'N/A'),
                "Full Text": result[0]['metadata'].get('Full Text', 'N/A'),
            },
            "similarity": result[1]
        }
        for result in results
    ]

    return {"results": formatted_results}

@app.post("/generate_summary_suggestions")
async def generate_summary_suggestions(request: FullTextRequest):
    try:
        summary = summary_chain.invoke({"context": request.full_text})
        suggestions = suggestions_chain.invoke({"context": request.full_text})
        return {"summary": summary, "suggestions": suggestions}
    except Exception as e:
        logging.error(f"Error generating summary or suggestions: {e}")
        return {"error": "Error in summary or suggestion generation"}

@app.post("/generate_synthesis")
async def generate_synthesis_endpoint(request: SynthesisRequest):
    try:
        synthesis_result = generate_synthesis(request.full_texts)
        return {"synthesis": synthesis_result}
    except Exception as e:
        logging.error(f"Error generating synthesis: {e}")
        return {"error": "Error generating synthesis"}