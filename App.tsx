import React, { useState, useCallback } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { OutputPanel } from './components/OutputPanel';
import Header from './components/Header';
import { generateText } from './services/geminiService';
// FIX: Import specific types for casting initial state values.
import type { GeneratorOptions, FormatOption, ModeOption, ToneOption, EmojiOption, FontOption, FontSizeOption } from './types';
import { FORMAT_OPTIONS, MODE_OPTIONS, TONE_OPTIONS, EMOJI_OPTIONS, FONT_OPTIONS, FONT_SIZE_OPTIONS } from './constants';

const initialOptions: GeneratorOptions = {
  // FIX: Cast string value from constant to the specific `FormatOption` type.
  format: FORMAT_OPTIONS[1].value as FormatOption, // Default to E-mail
  // FIX: Cast string value from constant to the specific `ModeOption` type.
  mode: MODE_OPTIONS[0].value as ModeOption,     // Default to Actie
  // FIX: Cast string value from constant to the specific `ToneOption` type.
  tone: TONE_OPTIONS[0].value as ToneOption,     // Default to Neutraal
  input: '',
  // FIX: Cast string value from constant to the specific `EmojiOption` type.
  emoji: EMOJI_OPTIONS[0].value as EmojiOption,   // Default to Geen
  responseInstructions: '', // New field for response content guidance
  font: FONT_OPTIONS[0].value as FontOption, // Default to Arial
  fontSize: FONT_SIZE_OPTIONS[0].value as FontSizeOption, // Default to 11pt
};


const App: React.FC = () => {
  const [options, setOptions] = useState<GeneratorOptions>(initialOptions);

  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!options.input.trim()) {
      setError('Voer alstublieft een opdracht of tekst in.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedText('');

    try {
      const result = await generateText(options);
      setGeneratedText(result);
    } catch (e) {
      console.error(e);
      setError('Er is een fout opgetreden bij het genereren van de tekst. Controleer uw API-sleutel en probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  }, [options]);
  
  const handleReset = useCallback(() => {
    setOptions(initialOptions);
    setGeneratedText('');
    setIsLoading(false);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-amber-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header onReset={handleReset} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ControlsPanel
            options={options}
            setOptions={setOptions}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <OutputPanel
            generatedText={generatedText}
            isLoading={isLoading}
            error={error}
            options={options}
          />
        </div>
      </main>
    </div>
  );
};

export default App;