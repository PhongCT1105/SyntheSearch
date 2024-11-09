import React from 'react';
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
  return (
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
                onClick={() => {
                  alert(`Abstract: ${paper.Abstract}`); // Placeholder for View Details functionality
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                View Details
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </UiTable>
  );
};

export default Table;
