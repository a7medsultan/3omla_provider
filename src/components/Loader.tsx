// src/components/OverlayLoader.tsx
import React from "react";

interface OverlayLoaderProps {
  message?: string;
}

const OverlayLoader: React.FC<OverlayLoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      {message && (
        <p className="mt-4 text-yellow-400 font-medium text-lg">{message}</p>
      )}
    </div>
  );
};

export default OverlayLoader;
