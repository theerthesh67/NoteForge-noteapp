/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useRef } from 'react'
import { renderMarkdownWithColorsHTML } from '../../utils/markdownUtils'

interface NoteContentEditorProps {
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export default function NoteContentEditor({
  content,
  onContentChange,
  onSave,
  onKeyDown
}: NoteContentEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  // Actualizar highlight cuando cambia el contenido
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = content
        ? renderMarkdownWithColorsHTML(content)
        : '<div style="color: #a0a0a0; font-style: italic;">Start writing in Markdown...</div>'
    }
  }, [content])

  // Sincronizar scroll
  const handleScroll = () => {
    if (highlightRef.current && editorRef.current) {
      highlightRef.current.scrollTop = editorRef.current.scrollTop
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft
    }
  }

  return (
    <div className="relative w-full h-full" style={{ position: 'relative' }}>
      {/* Highlight overlay */}
      <div
        ref={highlightRef}
        className="absolute inset-0 pointer-events-none font-mono text-sm leading-relaxed"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          padding: 0,
          margin: 0,
          border: 'none',
          overflow: 'visible',
          zIndex: 0
        }}
        dangerouslySetInnerHTML={{
          __html: content
            ? renderMarkdownWithColorsHTML(content)
            : '<div style="color: #a0a0a0; font-style: italic;">Start writing in Markdown...</div>'
        }}
      />
      {/* Textarea transparente */}
      <textarea
        ref={editorRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onSave}
        onScroll={handleScroll}
        className="relative w-full h-full bg-transparent text-transparent font-mono text-sm resize-none focus:outline-none leading-relaxed"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          caretColor: '#e0e0e0',
          zIndex: 1,
          position: 'relative',
          overflow: 'auto'
        }}
        placeholder=""
        autoFocus
      />
    </div>
  )
}
