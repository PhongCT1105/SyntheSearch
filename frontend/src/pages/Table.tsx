import React, { useState, useEffect } from 'react';
import {
  Table as UiTable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PDFDocument, StandardFonts } from 'pdf-lib';

interface Paper {
  Title: string;
  Authors: string;
  Year: string;
  Abstract: string;
  Keywords: string;
  Publisher: string;
  "Publication Date": string;
  Journal: string;
  "Citation Count": number;
  FullText: string;
}

import paperData from '../../article_metadata.json';
import { Button } from '@/components/ui/button';

const Table = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };

  return (
    <div>
      <UiTable className='w-[780px]'>
        <TableCaption>Research Paper Summary</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[300px]'>Title</TableHead>
            <TableHead className='w-[200px]'>Authors</TableHead>
            <TableHead>Publication Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{paperData.Title}</TableCell>
            <TableCell>{paperData.Authors}</TableCell>
            <TableCell>{paperData.Year}</TableCell>
            <TableCell className='w-[100px]'>
              <Button>View Summarize </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </UiTable>

      {/* Modal */}
      {isModalOpen && pdfUrl && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full h-full h-96 overflow-hidden relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800 focus:outline-none"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              ✖
            </button>
            <h2 className="text-2xl mb-4">Research Paper PDF</h2>
            <iframe
              src={pdfUrl}
              title="Research Paper PDF"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;