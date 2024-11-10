from pydantic import BaseModel
import os
import logging
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from .env
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
    [("system", "Generate a few short(2-3 sentences), actionable suggestions for future research. Focus on 1-2 specific ways to extend or improve this field based on the author's work:\n\n{context}")]
)

# Set up chains for summary and suggestions with output parsers
summary_chain = summary_prompt | llm | StrOutputParser()
suggestions_chain = suggestions_prompt | llm | StrOutputParser()

# Models for API requests
class MessageRequest(BaseModel):
    message: str

class FullTextRequest(BaseModel):
    full_text: str

# Functions to generate summary and suggestions
def generate_summary(full_text: str) -> str:
    try:
        return summary_chain.invoke({"context": full_text})
    except Exception as e:
        logging.error(f"Error generating summary: {e}")
        return "Error in summary generation."

def generate_suggestions(full_text: str) -> str:
    try:
        return suggestions_chain.invoke({"context": full_text})
    except Exception as e:
        logging.error(f"Error generating suggestions: {e}")
        return "Error in suggestion generation."
