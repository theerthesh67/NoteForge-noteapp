/**
 * Colores del editor Markdown
 * Paleta mejorada con mejor contraste y legibilidad
 */
export const markdownEditorColors = {
  // Headings (diferentes colores por nivel)
  heading1: '#60a5fa', // blue-400
  heading2: '#7dd3fc', // sky-300
  heading3: '#a78bfa', // violet-400
  heading4: '#c084fc', // fuchsia-400
  heading5: '#f472b6', // pink-400
  heading6: '#fb7185', // rose-400
  // Texto normal
  text: '#e0e0e0',
  // Formato de texto
  bold: '#c084fc', // fuchsia-400
  italic: '#7dd3fc', // sky-300
  strikethrough: '#9ca3af', // gray-400
  // Links
  link: '#60a5fa', // blue-400
  // Listas
  listMarker: '#a78bfa', // violet-400
  listText: '#e0e0e0',
  // Código
  codeInline: '#a78bfa', // violet-400
  codeBackground: '#1a1a1a',
  codeBlockBorder: '#a78bfa', // violet-400
  // Blockquotes
  blockquote: '#cbd5e1', // slate-300
  blockquoteBorder: '#60a5fa', // blue-400
  // Placeholder
  placeholder: '#a0a0a0'
} as const
