import React, { useId, useState } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ImageUpload = ({ onImageSelect, defaultImage }) => {
  const inputId = useId();
  const [preview, setPreview] = useState(defaultImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageFile = (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image must be 2MB or smaller');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        toast.error('Could not read the selected image');
        return;
      }

      setPreview(reader.result);
      onImageSelect(reader.result);
    };
    reader.onerror = () => toast.error('Could not read the selected image');
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    handleImageFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div className="w-full">
      <div
        className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
          isDragging
            ? 'border-teal-600 bg-teal-50'
            : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="peer sr-only"
        />
        {preview ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <div className="relative shrink-0">
              <img
                src={preview}
                alt="Profile photo preview"
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white shadow-md"
              />
              <button
                type="button"
                onClick={removeImage}
                aria-label="Remove profile photo"
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white shadow transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">Photo added</p>
              <p className="mt-1 text-xs text-slate-500">Choose another image or remove this one.</p>
              <label
                htmlFor={inputId}
                className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                <Upload className="h-4 w-4" />
                Change photo
              </label>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg px-3 py-4 text-center outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              {isDragging ? <ImagePlus className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
            </div>
            <span className="mt-3 text-sm font-semibold text-slate-800">
              {isDragging ? 'Drop your photo here' : 'Upload a profile photo'}
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Drag and drop or click to browse · JPG, PNG up to 2MB
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload; 