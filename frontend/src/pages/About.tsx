// import React from "react";
// import { View, Text } from "lucide-react";

// const About = () => {
//     return (
//         <View>
//             <Text> Nothing here</Text>
//         </View>
//     )
// }

// export default About


const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-14">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-400">About Us</h1>
        <p className="text-lg mb-8">
          Welcome to our project! We are a team of passionate individuals working together to build something amazing.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">About the Project</h2>
          <p className="text-lg">
            SyntheSearch was born out of a desire to streamline the time-consuming process of literature review.
            Researchers often spend hours sorting through papers, hoping to find relevant studies. We aimed to simplify this
            process by building a tool that would intelligently suggest the most relevant research papers and then create a
            cohesive summary to show how these studies interrelate.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Inspiration</h2>
          <p className="text-lg">
            The inspiration for SyntheSearch came from observing the repetitive effort researchers go through to locate
            relevant papers and piece them together into a coherent narrative. I wanted to design a solution that not only
            finds relevant documents but also helps synthesize their insights, empowering researchers to focus on understanding
            rather than searching.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-indigo-400">Team Members</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-72 bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-400">Phong Cao</h3>
              <p>Team Lead - Backend Developer</p>
            </div>
            <div className="w-72 bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-400">Hien Hoang</h3>
              <p>Backend Developer</p>
            </div>
            <div className="w-72 bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-400">Doanh Phung</h3>
              <p>Frontend Developer</p>
            </div>
            <div className="w-72 bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-400">Minh Bui</h3>
              <p>Frontend Developer</p>
            </div>
          </div>
        </div>

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


