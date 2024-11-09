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
import { PDFDocument } from 'pdf-lib';

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

const Table = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePDF = async (paper: Paper) => {
    const pdfDoc = await PDFDocument.create();
    const fontSize = 12;
    const lineSpacing = 16;
    let page = pdfDoc.addPage([600, 800]);
    let y = page.getHeight() - 50;

    const addText = (text: string) => {
      const lines = text.split('\n');
      lines.forEach((line) => {
        if (y < 50) {
          page = pdfDoc.addPage([600, 800]);
          y = page.getHeight() - 50;
        }
        page.drawText(line, { x: 50, y, size: fontSize });
        y -= lineSpacing;
      });
    };

    // Add paper details and full text to the PDF
    addText(`Title: ${paper.Title}`);
    addText(`Authors: ${paper.Authors}`);
    addText(`Year: ${paper.Year}`);
    addText(`Abstract: ${paper.Abstract}`);
    addText(`Full Text: ${paper.FullText}`);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);

    setPdfUrl(pdfUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };

  return (
    <div>
      <UiTable>
        <TableCaption>Research Paper Summary</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{paperData.Title}</TableCell>
            <TableCell>
              <button
                onClick={() => generatePDF(paperData)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                View PDF
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </UiTable>

      {/* Modal */}
      {isModalOpen && pdfUrl && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full h-96 overflow-hidden relative">
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