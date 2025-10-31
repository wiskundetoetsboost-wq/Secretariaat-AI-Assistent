import React, { useRef, useEffect } from 'react';
import type { GeneratorOptions, FormatOption, ModeOption, ToneOption, EmojiOption, FontOption, FontSizeOption } from '../types';
import { FORMAT_OPTIONS, MODE_OPTIONS, TONE_OPTIONS, EMOJI_OPTIONS, FONT_OPTIONS, FONT_SIZE_OPTIONS } from '../constants';
import { GenerateIcon, UploadIcon, PasteIcon } from './icons';

interface ControlsPanelProps {
  options: GeneratorOptions;
  setOptions: React.Dispatch<React.SetStateAction<GeneratorOptions>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const ControlWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    {children}
  </div>
);

export const ControlsPanel: React.FC<ControlsPanelProps> = ({ options, setOptions, onGenerate, isLoading }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const instructionsRef = useRef<HTMLTextAreaElement>(null);

  const handleOptionChange = <K extends keyof GeneratorOptions,>(key: K, value: GeneratorOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  // Auto-resize logic for textareas
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [options.input]);

  useEffect(() => {
    if (instructionsRef.current) {
      instructionsRef.current.style.height = 'auto';
      instructionsRef.current.style.height = `${instructionsRef.current.scrollHeight}px`;
    }
  }, [options.responseInstructions]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/plain') {
        alert('Accepteert alleen .txt-bestanden.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setOptions(prev => ({
          ...prev,
          input: text,
          mode: 'reactie' // Switch automatically to 'reactie' mode
        }));
      };
      reader.onerror = () => {
        alert('Fout bij het lezen van het bestand.');
      };
      reader.readAsText(file);
    }
    // Reset file input value to allow uploading the same file again
    event.target.value = '';
  };

  const handlePaste = async () => {
    try {
      // Check for permission first for a better user experience
      // The 'as PermissionName' cast is necessary for TypeScript
      const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });

      if (permissionStatus.state === 'denied') {
        alert('Toestming om van het klembord te lezen is geblokkeerd. Controleer de site-instellingen van uw browser.');
        return;
      }

      // If granted or prompt, proceed. The browser will prompt if needed.
      const text = await navigator.clipboard.readText();
      if (text) {
        setOptions(prev => ({
          ...prev,
          input: text,
          mode: 'reactie' // Switch automatically to 'reactie' mode
        }));
      } else {
        alert('Klembord is leeg.');
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert('Kon niet van het klembord lezen. Dit kan komen door de beveiligingsinstellingen van uw browser.');
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-3">Instellingen</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlWrapper label="Formaat">
          <select
            value={options.format}
            onChange={(e) => handleOptionChange('format', e.target.value as FormatOption)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {FORMAT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </ControlWrapper>
        
        <ControlWrapper label="Modus">
          <select
            value={options.mode}
            onChange={(e) => handleOptionChange('mode', e.target.value as ModeOption)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {MODE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </ControlWrapper>

        <ControlWrapper label="Toon">
          <select
            value={options.tone}
            onChange={(e) => handleOptionChange('tone', e.target.value as ToneOption)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {TONE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </ControlWrapper>

        <ControlWrapper label="Emoji">
          <select
            value={options.emoji}
            onChange={(e) => handleOptionChange('emoji', e.target.value as EmojiOption)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {EMOJI_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </ControlWrapper>

        <ControlWrapper label="Lettertype">
          <select
            value={options.font}
            onChange={(e) => handleOptionChange('font', e.target.value as FontOption)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </ControlWrapper>

        <ControlWrapper label="Tekengrootte">
          <select
            value={options.fontSize}
            onChange={(e) => handleOptionChange('fontSize', e.target.value as FontSizeOption)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {FONT_SIZE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </ControlWrapper>
      </div>

      <ControlWrapper label="Invoer">
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <label htmlFor="file-upload" className="flex-1 cursor-pointer bg-amber-200 dark:bg-gray-700 hover:bg-amber-300 dark:hover:bg-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-200 p-2 text-center flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 transition-colors">
                <UploadIcon />
                <span>Upload .txt Bestand</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt" onChange={handleFileUpload} />
            </label>
            
            <button
                onClick={handlePaste}
                type="button"
                className="flex-1 bg-amber-200 dark:bg-gray-700 hover:bg-amber-300 dark:hover:bg-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-200 p-2 text-center flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 transition-colors"
            >
                <PasteIcon />
                <span>Plak van Klembord</span>
            </button>
        </div>

        <textarea
          ref={inputRef}
          value={options.input}
          onChange={(e) => handleOptionChange('input', e.target.value)}
          placeholder="De inhoud verschijnt hier. U kunt hier ook direct typen of een opdracht geven, b.v. 'Herinnering factuur 123'..."
          maxLength={2000}
          rows={8}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        />
        <p className="text-xs text-right text-gray-400 dark:text-gray-500 mt-1">{options.input.length}/2000</p>
      </ControlWrapper>
      
      {options.mode === 'reactie' && (
        <ControlWrapper label="Instructies voor antwoord (optioneel)">
            <textarea
                ref={instructionsRef}
                value={options.responseInstructions}
                onChange={(e) => handleOptionChange('responseInstructions', e.target.value)}
                placeholder="Geef hier de kernpunten voor het antwoord aan, bijv. 'Bevestig de afspraak voor dinsdag om 10:00'..."
                maxLength={500}
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            />
            <p className="text-xs text-right text-gray-400 dark:text-gray-500 mt-1">{options.responseInstructions.length}/500</p>
        </ControlWrapper>
      )}


      <button
        onClick={onGenerate}
        disabled={isLoading || !options.input}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors duration-200"
      >
        <GenerateIcon />
        {isLoading ? 'Tekst genereren...' : 'Genereer Tekst'}
      </button>
    </div>
  );
};