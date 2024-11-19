
# SyntheSearch

### Authors  
**Phong Cao, Hien Hoang, Doanh Phung, Minh Bui**

---

## Project Overview
SyntheSearch: A smart research tool that finds and synthesizes the most relevant papers, saving researchers time and enhancing insight.

---

### **Getting Started**

#### **Start Server (Backend)**

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Set up a virtual environment:
   ```bash
   python3 -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```
   > **Note:** On iOS, ensure `pywin32` is removed from `requirement.txt`.

5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

---

#### **Start Client (Frontend)**

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## **Introduction**
SyntheSearch is a web application designed to streamline the research process for students and researchers by efficiently locating relevant research papers. Researchers often spend hours sifting through papers, hoping to find the studies that best match their interests. SyntheSearch aims to reduce this time by intelligently suggesting the most relevant papers and generating a synthesis to reveal how the studies interrelate, offering users an insightful overview that saves time and enhances understanding.

---

## **Inspiration**
The inspiration for SyntheSearch came from our own experiences as students. Before HackUMass XII, one team member struggled to find research papers on machine-learning applications in cancer detection. The process of locating credible sources was exhausting and time-consuming, even with optimized library search tools. This frustration inspired us to develop a more efficient search engine that leverages Large Language Models (LLM) and vector databases to quickly surface relevant research and summarize findings.

---

## **How We Built the Project**
We chose Python for the back end because of its extensive frameworks for AI development. Databricks was used to streamline our machine-learning pipeline. Here’s how we approached building SyntheSearch:

1. **Data Collection**: We started by scraping data from the CORE collection of open-access research papers.
2. **Embedding**: Using LangChain, we implemented OpenAI's text-embedding-3-large model to convert paper texts into vector embeddings.
3. **Storage**: We utilized LanceDB as our vector database, storing the embedded vectors for fast and efficient retrieval.
4. **Summarization and Synthesis**: We employed OpenAI’s GPT-4o-mini model to generate summaries, suggestions, and synthesized insights.
5. **Front-End**: We built the user interface using React.JS with a TypeScript template, providing a clean and responsive experience for users.

---

## **Challenges Faced**
- **GitHub Workflow Issues**: Frequent pull request conflicts slowed our progress due to merge conflicts.
- **Communication Gaps**: Miscommunication led to duplicated work and inefficiencies.

---

## **Lessons Learned**
This project was an invaluable learning experience. As it was our first LLM project, we gained hands-on experience with GenAI technologies, particularly the power of vector databases. We learned the importance of clear team communication, and we now have a deeper understanding of LLMs and their capabilities in revolutionizing information retrieval.

---

## **Built With**
- **Python** (Backend Development)
- **LangChain** (Embedding)
- **LanceDB** (Vector Database)
- **OpenAI GPT Models** (Summarization and Synthesis)
- **React** with **TypeScript** (Front-End Development)
- **TailwindCSS** (Styling)
- **Vite** (Tooling)
- **Databricks** (Machine Learning Pipeline)

---

## **Empowering Researchers**
Through SyntheSearch, we’re excited to contribute to the efficiency of the research process, empowering researchers to focus on insights rather than information overload.
