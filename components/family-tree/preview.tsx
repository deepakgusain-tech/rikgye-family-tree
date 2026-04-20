"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

const PreviewItem = ({
  src,
  readOnly,
  onDelete,
}: {
  src: string;
  readOnly?: boolean;
  onDelete: () => void;
}) => {

  return (
    <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md">
      <img src={src} className="w-full h-full object-cover" />

      {!readOnly && (
        <button
          type="button"
          className="absolute top-1 right-1 bg-white rounded-full p-1"
          onClick={onDelete}
        >
          <X className="w-3 h-3 text-red-500" />
        </button>
      )}
    </div>
  );
};

export default PreviewItem