export interface Option {
  value: string;
  label: string;
}

export type FormatOption = 'brief' | 'email' | 'platte tekst' | 'bericht voor whatsapp';
export type ModeOption = 'actie' | 'reactie';
export type ToneOption = 'Neutraal' | 'Officieel' | 'Geïrriteerd' | 'Vriendelijk' | 'Informatief' | 'Kritisch';
export type EmojiOption = 'geen' | '😊' | '👍' | '⚠️' | '❌' | '📅' | '✅' | '❗' | '😞' | '🔥';
export type FontOption = 'Arial' | 'Calibri' | 'Times New Roman';
export type FontSizeOption = '11pt' | '12pt';

export interface GeneratorOptions {
  format: FormatOption;
  mode: ModeOption;
  input: string;
  tone: ToneOption;
  emoji: EmojiOption | '';
  responseInstructions: string;
  font: FontOption;
  fontSize: FontSizeOption;
}