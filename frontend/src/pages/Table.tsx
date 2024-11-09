import React, { useState } from 'react';
import {
  Table as UiTable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Simulated JSON data (this could be fetched from an API later)
const jsonData = [
  {
    "Title": "Large Margin Neural Language Model",
    "Authors": "Huang, Jiaji, Huang, Liang, Li, Yi, Ping, Wei",
    "Year": "No year available",
    "Abstract": "We propose a large margin criterion for training neural language models...",
  },
  {
    "Title": "Deep Learning for Natural Language Processing",
    "Authors": "Smith, John, Lee, Lisa",
    "Year": "2021",
    "Abstract": "This paper explores deep learning models for NLP tasks...",
  },
  // Add more papers as needed
];

const Table = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Function to handle modal opening and setting the content
  const openModal = (abstract: string) => {
    setModalContent(abstract);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  return (
    <div>
      <UiTable>
        <TableCaption>A list of research papers related to your search.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jsonData.map((paper, index) => (
            <TableRow key={index}>
              <TableCell>{paper.Title}</TableCell>
              <TableCell>{paper.Authors}</TableCell>
              <TableCell>{paper.Year}</TableCell>
              <TableCell>
                <button
                  onClick={() => openModal(paper.Abstract)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  View Details
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </UiTable>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full h-96 overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-lg text-gray-500"
            >
              ✖
            </button>
            <h2 className="text-2xl mb-4 bg-black">Research Paper Abstract</h2>
            <p>{modalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
