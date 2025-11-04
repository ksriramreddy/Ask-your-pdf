import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewerProps {
  fileUrl: string | null;
}

export const Pdfviewer = ({ fileUrl }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(0.8);
  const [pageWidth, setPageWidth] = useState<number>(window.innerWidth / 2 - 50);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth >= 768 ? window.innerWidth / 2 - 50 : window.innerWidth - 40;
      setPageWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setScale(0.8);

  return (
    <div className='p-3 bg-gray-50 rounded-lg shadow-md h-[90vh] flex flex-col'>
      <div className='flex justify-between mb-2'>
        <h2 className='text-sm text-gray-700 font-semibold'>📄 PDF Preview</h2>
        <div className='space-x-2'>
          <button
            onClick={zoomOut}
            className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm'
          >
            ➖
          </button>
          <button
            onClick={resetZoom}
            className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm'
          >
            🔁
          </button>
          <button
            onClick={zoomIn}
            className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm'
          >
            ➕
          </button>
        </div>
      </div>

      <div className='flex-1 overflow-auto rounded-lg border bg-white'>
        <Document
        key={fileUrl}
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p className='text-gray-500 text-sm p-4'>Loading PDF...</p>}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={`page_${index + 1}`}
              className='flex justify-center mb-4 transition-all duration-300'
            >
              <Page
                pageNumber={index + 1}
                scale={scale}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};
