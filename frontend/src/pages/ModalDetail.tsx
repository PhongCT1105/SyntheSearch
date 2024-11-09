import React from "react";

interface ModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
}

const ModalDetail: React.FC<ModalProps> = ({ isOpen, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full h-96 overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500"
        >
          ✖
        </button>
        <h2 className="text-2xl mb-4">Research Paper Abstract</h2>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default ModalDetail;
