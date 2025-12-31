"use client";

import { Download, Smartphone, FileText } from "lucide-react";

export default function EbookDownloads({ ebooks, orderId, uid }) {
  if (!ebooks || ebooks.length === 0) return null;

  return (
    <div className="w-full max-w-md mt-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Smartphone className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-emerald-800">
              Your eBooks Are Ready! 🎉
            </h2>
            <p className="text-sm text-emerald-600">
              Download your digital books below
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {ebooks.map((ebook, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white p-3 rounded-lg border border-emerald-100"
            >
              <div className="relative flex-shrink-0">
                {ebook.image ? (
                  <img
                    src={ebook.image}
                    alt={ebook.name}
                    className="w-12 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-12 h-16 bg-emerald-100 rounded-md flex items-center justify-center">
                    <FileText className="text-emerald-600" size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
                  {ebook.name}
                </h3>
                <span className="text-xs text-emerald-600">PDF eBook</span>
              </div>
              <a
                href={ebook.ebookUrl ? `/api/download-ebook?productId=${ebook.productId || ebook.id}&filename=${encodeURIComponent(ebook.name + '.pdf')}` : '#'}
                className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                  ebook.ebookUrl 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={!ebook.ebookUrl ? (e) => e.preventDefault() : undefined}
              >
                <Download size={18} />
              </a>
            </div>
          ))}
        </div>

        <p className="text-xs text-emerald-600 mt-4 text-center">
           You can also access your eBooks anytime from "My eBooks" in your account
        </p>
      </div>
    </div>
  );
}
