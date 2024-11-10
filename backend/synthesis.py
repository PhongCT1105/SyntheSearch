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

# Define the prompt template for generating a synthesis paper
synthesis_prompt = ChatPromptTemplate.from_messages(
    [("system", "Generate a synthesis paper by analyzing and integrating key ideas from multiple research papers. Structure the synthesis in the following format:\n\n"
                "1. **Introduction** - Briefly introduce the topic, outlining the main research questions and objectives covered in the source papers.\n"
                "2. **Key Themes and Insights** - Discuss the common themes, methodologies, and findings across the papers, showing how they connect and contribute to the field.\n"
                "3. **Challenges and Limitations** - Identify shared challenges or limitations found across the research and provide potential solutions or alternative approaches.\n"
                "4. **Future Directions** - Suggest promising directions for further research, integrating ideas from each paper to show innovative possibilities.\n\n"
                "Include relevant citations and reference integration where applicable:\n\n{context}")]
)

# Set up chain for synthesis with output parser
synthesis_chain = synthesis_prompt | llm | StrOutputParser()

def generate_synthesis(full_texts):
    """
    Generate a synthesis paper from multiple research paper texts.

    Args:
        full_texts (list of str): List of full texts of research papers.

    Returns:
        str: A synthesized analysis integrating key points across the research papers.
    """
    combined_text = "\n\n".join(full_texts)  # Combine all papers into one context for synthesis
    return synthesis_chain.invoke({"context": combined_text})

if __name__ == "__main__":
    # Set the directory path for raw_data
    raw_data_dir = "raw_data"
    
    # Collect JSON files from the raw_data directory
    file_paths = [os.path.join(raw_data_dir, file) for file in os.listdir(raw_data_dir) if file.endswith(".json")]
    
    full_texts = []
    for file_path in file_paths:
        with open(file_path, "r", encoding="utf-8") as file:
            article_metadata = json.load(file)
            full_text = article_metadata.get("Full Text", "")
            if full_text:
                full_texts.append(full_text)
    
    # Generate synthesis paper
    synthesis_result = generate_synthesis(full_texts)

    # Print result
    print("Synthesis Paper:")
    print(synthesis_result)