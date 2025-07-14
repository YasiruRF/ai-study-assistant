'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import Button from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxSize?: number;
  label?: string;
  error?: string;
}

const FileUpload = ({
  onFileSelect,
  acceptedFileTypes = 'image/*,application/pdf,text/plain',
  maxSize = 10485760, // 10MB
  label = 'Upload a file',
  error,
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.split(',').reduce((acc: Record<string, string[]>, type) => {
      const trimmedType = type.trim();
      const category = trimmedType.split('/')[0];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(trimmedType.split('/')[1]);
      return acc;
    }, {}),
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
  };

  const fileRejectionError = fileRejections.length > 0
    ? fileRejections[0].errors[0].message
    : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">
          {label}
        </label>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div className="flex items-center">
              <FiFile className="text-indigo-500 mr-2" size={20} />
              <span className="text-sm text-gray-700 truncate max-w-xs">
                {file.name}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              icon={<FiX />}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div>
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag and drop a file here, or click to select a file'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supported file types: PDF, images, text files (Max: 10MB)
            </p>
          </div>
        )}
      </div>
      
      {(error || fileRejectionError) && (
        <p className="mt-1 text-sm text-red-600">
          {error || fileRejectionError}
        </p>
      )}
    </div>
  );
};

export default FileUpload;