import React from "react";
// Custom Modal Component (replaces alert())
interface CustomModalProps {
  message: string;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-xl font-semibold text-yellow-500 mb-4">
          Notification
        </h3>
        <p className="text-gray-200 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomModal;