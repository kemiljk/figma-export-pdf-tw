import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { PDFDocument } from 'pdf-lib';
import Input from './components/Input';
import './ui.css';

function App() {
  const [imageData, setImageData] = React.useState(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [title, setTitle] = React.useState('Exported PDF');

  window.onmessage = async (event: MessageEvent) => {
    const msgType = event.data.pluginMessage.type;
    const msg = event.data.pluginMessage;

    if (msgType === 'exportImage') {
      const base64img = `data:image/png;base64,${btoa(String.fromCharCode(...msg.data))}`;
      setImageData(base64img);
    }

    if (msgType === 'pageCount') {
      setPageCount(msg.data);
    }

    if (msgType === 'exportPDF') {
      const pdfDoc = await PDFDocument.create();
      for (const item of msg.data) {
        const bytes = new Uint8Array(item);
        const itemPdf = await PDFDocument.load(bytes);
        const copiedPages = await pdfDoc.copyPages(itemPdf, itemPdf.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));
      }
      const pdfBytes = await pdfDoc.save();
      const file = new Blob([pdfBytes], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = title + '.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleExportPDF = () => {
    parent.postMessage({ pluginMessage: { type: 'EXPORT' } }, '*');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let title = event.target.value;
    setTitle(title);
    parent.postMessage({ pluginMessage: { type: 'setTitle', data: title } }, '*');
  };

  return (
    <main className='h-full flex flex-col justify-start items-center w-full p-4 gap-4'>
      {imageData ? (
        <img src={imageData} id='image' className='h-[200px] w-full object-contain' />
      ) : (
        <div className='flex h-[200px] w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800'>
          <p className='text-xs text-figma-secondary'>Select one or more Frames to export</p>
        </div>
      )}
      <p className='text-xs text-figma-secondary'>{pageCount} pages</p>
      <Input label='title' text='PDF title' onChange={handleTitleChange} value={title} icon={false} disabled={false} placeholder='Enter a PDF title' />
      <button className='w-full cursor-default rounded-md bg-figma-blue py-3 text-xs font-semibold text-figma-onBrand hover:bg-figma-blue-hover' id='export' onClick={handleExportPDF}>
        Export PDF
      </button>
    </main>
  );
}

const root = createRoot(document.getElementById('react-page')!);
root.render(<App />);
