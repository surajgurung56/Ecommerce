import React, { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const ImageUploader = ({
  className,
  setImage,
  defaultImage = "",
  label,
  mustFill,
  error,
}) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(defaultImage);

  useEffect(() => {
    setPreviewImage(defaultImage);
  }, [defaultImage]);

  const resetImage = () => {
    setPreviewImage(defaultImage);
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    resetImage();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      return;
    }

    const fileURL = URL.createObjectURL(file);
    setPreviewImage(fileURL);
    setImage(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-gray-600 block mb-1.5">
          {label}
          {mustFill && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`${
          className
            ? className
            : "relative w-full aspect-[10/16] border-2 border-dashed items-center con border-gray-300 rounded-lg overflow-hidden"
        } 
                ${error ? "border-red-300 bg-red-50" : ""} 
                cursor-pointer group`}
        onClick={() => fileInputRef.current.click()}
      >
        {previewImage ? (
          <div className="relative w-full h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md">
              {previewImage !== defaultImage && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <ImagePlus
                size={15}
                className="text-gray-400 group-hover:text-gray-500"
              />
            </div>
            <div className="text-sm text-center px-4">
              <p className="font-medium text-gray-700">Click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
