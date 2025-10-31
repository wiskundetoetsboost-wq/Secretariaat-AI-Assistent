import React, { useState, useEffect } from 'react';
import { CopyIcon, WordIcon, PdfIcon, SpinnerIcon, ErrorIcon } from './icons';
import type { GeneratorOptions, FontOption } from '../types';

interface OutputPanelProps {
  generatedText: string;
  isLoading: boolean;
  error: string | null;
  options: GeneratorOptions;
}

// Extend the Window interface to include our libraries for TypeScript
declare global {
  interface Window {
    docx: any;
    saveAs: any;
    jspdf: any;
  }
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; title?: string; }> = ({ onClick, children, disabled, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className="flex items-center gap-2 text-sm bg-amber-200 dark:bg-gray-700 hover:bg-amber-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

export const OutputPanel: React.FC<OutputPanelProps> = ({ generatedText, isLoading, error, options }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [libsLoaded, setLibsLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.docx && window.saveAs && window.jspdf) {
        setLibsLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const getNumericFontSize = (size: string): number => {
    return parseInt(size.replace('pt', ''), 10);
  }

  const handleDownloadPdf = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const fontSize = getNumericFontSize(options.fontSize);
    
    let fontName = 'helvetica'; // Default fallback for Arial/Calibri
    if (options.font === 'Times New Roman') {
        fontName = 'times';
    }
    
    doc.setFont(fontName, 'normal');
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(generatedText, 180);
    doc.text(lines, 15, 20);

    doc.save('gegenereerde_tekst.pdf');
  };

  const handleDownloadWord = () => {
    const fontSize = getNumericFontSize(options.fontSize);
    
    try {
      const doc = new window.docx.Document({
        sections: [{
          children: generatedText.split('\n').map(p => 
            new window.docx.Paragraph({
              children: [
                new window.docx.TextRun({
                  text: p,
                  font: options.font,
                  size: fontSize * 2,
                }),
              ],
            })
          ),
        }],
      });

      window.docx.Packer.toBlob(doc).then((blob: any) => {
        window.saveAs(blob, "gegenereerde_tekst.docx");
      }).catch((err: Error) => {
        console.error("Error packing DOCX:", err);
        alert("Er is een fout opgetreden bij het aanmaken van het Word-bestand.");
      });
    } catch(err) {
      console.error("Error creating DOCX document:", err);
      alert("Er is een fout opgetreden bij het aanmaken van het Word-bestand.");
    }
  };

  const hasContent = !isLoading && !error && generatedText;

  const lineHeightMultiplier = 1.8;
  const lineHeightEm = `${lineHeightMultiplier}em`;
  const backgroundOffsetY = 'calc(1rem + 0.7em)';

  const linedPaperStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to bottom, rgba(173, 216, 230, 0.8) 1px, transparent 1px)`,
    backgroundSize: `100% ${lineHeightEm}`,
    backgroundPosition: `0 ${backgroundOffsetY}`,
  };

  const getFontFamily = (font: FontOption) => {
      switch(font) {
          case 'Calibri': return 'Calibri, sans-serif';
          case 'Times New Roman': return '"Times New Roman", serif';
          default: return 'Arial, sans-serif';
      }
  }

  const previewStyle: React.CSSProperties = {
      fontFamily: getFontFamily(options.font),
      fontSize: options.fontSize,
      lineHeight: lineHeightEm,
      padding: 0,
      margin: 0,
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col min-h-[500px]">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <h2 className="text-xl font-semibold">Resultaat</h2>
        {hasContent && (
          <div className="flex items-center gap-2">
            <ActionButton onClick={handleCopy}>
              <CopyIcon />
              {copyStatus === 'copied' ? 'Gekopieerd!' : 'Kopieer'}
            </ActionButton>
            <ActionButton onClick={handleDownloadWord} disabled={!libsLoaded} title={!libsLoaded ? "Export-bibliotheken laden..." : "Download als Word"}>
              <WordIcon /> Word
            </ActionButton>
            <ActionButton onClick={handleDownloadPdf} disabled={!libsLoaded} title={!libsLoaded ? "Export-bibliotheken laden..." : "Download als PDF"}>
              <PdfIcon /> PDF
            </ActionButton>
          </div>
        )}
      </div>

      <div
        className="flex-grow p-4 bg-[#fdfaf2] dark:bg-gray-900/50 rounded-md overflow-y-auto"
        style={linedPaperStyle}
      >
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <SpinnerIcon />
            <p className="mt-2 text-lg">Aan het genereren...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-red-500">
            <ErrorIcon />
            <p className="mt-2 text-center">{error}</p>
          </div>
        )}
        {!isLoading && !error && !generatedText && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Uw gegenereerde tekst verschijnt hier.</p>
          </div>
        )}
        {generatedText && (
          <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200" style={previewStyle}>
            {generatedText}
          </pre>
        )}
      </div>
    </div>
  );
};