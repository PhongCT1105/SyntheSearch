import json
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables from .env
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize the language model
llm = ChatOpenAI(model="gpt-4o-mini", api_key=OPENAI_API_KEY)

# Define the prompt templates for summary and suggestions
summary_prompt = ChatPromptTemplate.from_messages(
    [("system", "Provide a concise, high-level summary in format 1. Main goals, 2. Methods, 3. Findings of this research paper:\n\n{context}")]
)

suggestions_prompt = ChatPromptTemplate.from_messages(
    [("system", "Analyze this research paper and generate author-like suggestions on how future researchers can extend, improve, or innovate within this field. Include recommendations on addressing challenges, limitations, and unexplored areas that could benefit from further investigation. Focus on practical steps and possible approaches that align with the author's vision:\n\n{context}")]
)

# Set up chains for summary and suggestions with output parsers
summary_chain = summary_prompt | llm | StrOutputParser()
suggestions_chain = suggestions_prompt | llm | StrOutputParser()

def generate_summary(full_text):
    """
    Generate a concise summary of the research paper.

    Args:
        full_text (str): The full text of the research paper.

    Returns:
        str: A concise summary of the research paper.
    """
    return summary_chain.invoke({"context": full_text})

def generate_suggestions(full_text):
    """
    Generate recommendations for other researchers based on the research paper.

    Args:
        full_text (str): The full text of the research paper.

    Returns:
        str: Suggestions for further research and improvements.
    """
    return suggestions_chain.invoke({"context": full_text})

if __name__ == "__main__":
    file_path = "article_metadata.json"
    with open(file_path, "r", encoding="utf-8") as file:
        article_metadata = json.load(file)
    
    full_text = article_metadata.get("Full Text", "")

    # Generate summary and suggestions
    summary_result = generate_summary(full_text)
    suggestions_result = generate_suggestions(full_text)

    # Print results
    print("Concise Summary of the Article:")
    print(summary_result)
    print("\nSuggestions for Other Researchers in the Same Field:")
    print(suggestions_result)
