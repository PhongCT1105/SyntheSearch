import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-14">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-400">About Us</h1>
        <p className="text-lg mb-8">
          Welcome to our project! We are a team of passionate individuals working together to build something amazing.
        </p>

        {/* About the Project Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">About the Project</h2>
          <p className="text-lg text-justify">
            SyntheSearch is a web application designed to streamline the research process for students and researchers by efficiently locating relevant research papers. Researchers often spend hours sifting through papers, hoping to find the studies that best match their interests. SyntheSearch aims to reduce this time by intelligently suggesting the most relevant papers and generating a synthesis to reveal how the studies interrelate, offering users an insightful overview that saves time and enhances understanding.
          </p>
        </div>

        {/* Inspiration Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Inspiration</h2>
          <p className="text-lg text-justify">
            The inspiration for SyntheSearch came from our own experiences as students. Before HackUMass XII, one team member struggled to find research papers on machine-learning applications in cancer detection. This frustration inspired us to develop a more efficient search engine that leverages Large Language Models (LLM) and vector databases to quickly surface relevant research and summarize findings.
          </p>
        </div>

        {/* How We Built the Project Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">How We Built the Project</h2>
          <p className="text-lg text-justify">
            We chose Python for the back end because of its extensive frameworks for AI development. Databricks was used to streamline our machine-learning pipeline. Here’s how we approached building SyntheSearch:
          </p>
          <ul className="text-lg text-justify list-disc list-inside ml-6">
            <li><strong>Data Collection:</strong> We scraped data from the CORE collection of open-access research papers.</li>
            <li><strong>Embedding:</strong> Using LangChain, we implemented OpenAI's text-embedding-3-large model to convert paper texts into vector embeddings.</li>
            <li><strong>Storage:</strong> We utilized LanceDB as our vector database, storing the embedded vectors for fast retrieval.</li>
            <li><strong>Summarization and Synthesis:</strong> We employed OpenAI’s gpt-4o-mini model to generate summaries, suggestions, and synthesized insights.</li>
            <li><strong>Front-end:</strong> We built the user interface using React.JS with a TypeScript template, providing a clean and responsive experience.</li>
          </ul>
        </div>

        {/* Team Members Section */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-indigo-400">Team Members</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "Phong Cao", role: "Team Lead - Backend Developer" },
              { name: "Hien Hoang", role: "Backend Developer" },
              { name: "Doanh Phung", role: "Frontend Developer" },
              { name: "Minh Bui", role: "Frontend Developer" }
            ].map((member, index) => (
              <div
                key={index}
                className="w-72 bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-gray-700"
              >
                <h3 className="text-xl font-semibold text-indigo-400">{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Acknowledgment Section */}
        <div className="mt-12 text-center">
          <p className="text-lg">
            This is our project for HackUMass XII - Thank you for visiting our About page!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
