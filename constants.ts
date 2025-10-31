import type { Option } from './types';

export const FORMAT_OPTIONS: Option[] = [
  { value: 'brief', label: 'Brief' },
  { value: 'email', label: 'E-mail' },
  { value: 'platte tekst', label: 'Platte Tekst' },
  { value: 'bericht voor whatsapp', label: 'WhatsApp' },
];

export const MODE_OPTIONS: Option[] = [
  { value: 'actie', label: 'Actie (genereer o.b.v. opdracht)' },
  { value: 'reactie', label: 'Reactie (antwoord op tekst)' },
];

export const TONE_OPTIONS: Option[] = [
  { value: 'Neutraal', label: 'Neutraal' },
  { value: 'Officieel', label: 'Officieel' },
  { value: 'Geïrriteerd', label: 'Geïrriteerd' },
  { value: 'Vriendelijk', label: 'Vriendelijk' },
  { value: 'Informatief', label: 'Informatief' },
  { value: 'Kritisch', label: 'Kritisch' },
];

export const EMOJI_OPTIONS: Option[] = [
  { value: 'geen', label: 'Geen Emoji' },
  { value: '😊', label: '😊 Vriendelijk' },
  { value: '👍', label: '👍 Akkoord' },
  { value: '⚠️', label: '⚠️ Waarschuwing' },
  { value: '❌', label: '❌ Afwijzing' },
  { value: '📅', label: '📅 Datum' },
  { value: '✅', label: '✅ Voltooid' },
  { value: '❗', label: '❗ Urgent' },
  { value: '😞', label: '😞 Teleurgesteld' },
  { value: '🔥', label: '🔥 Top' },
];

export const FONT_OPTIONS: Option[] = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Calibri', label: 'Calibri' },
    { value: 'Times New Roman', label: 'Times New Roman' },
];

export const FONT_SIZE_OPTIONS: Option[] = [
    { value: '11pt', label: '11 pt' },
    { value: '12pt', label: '12 pt' },
];