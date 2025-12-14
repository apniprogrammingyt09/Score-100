"use client";

import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EbookUpload({ onUpload, currentUrl, onRemove }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-ebook', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      onUpload(url);
      toast.success('eBook uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload eBook');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        eBook PDF File
      </label>
      
      {currentUrl ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <FileText className="text-green-600" size={20} />
          <span className="text-sm text-green-700 flex-1">eBook uploaded</span>
          <Button
            size="sm"
            variant="light"
            color="danger"
            onClick={onRemove}
            isIconOnly
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="ebook-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload PDF eBook
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PDF files up to 50MB
                </span>
              </label>
              <input
                id="ebook-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>
            <Button
              as="label"
              htmlFor="ebook-upload"
              color="primary"
              variant="flat"
              className="mt-4"
              isLoading={isUploading}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Choose PDF File'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}