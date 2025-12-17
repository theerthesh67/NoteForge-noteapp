/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface NoteContentRendererProps {
  content: string
}

export default function NoteContentRenderer({ content }: NoteContentRendererProps) {
  return (
    <div className="markdown-content min-h-full">
      {content ? (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Asegurar que las listas se rendericen correctamente
            ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
            ol: ({ children, ...props }) => <ol {...props}>{children}</ol>,
            li: ({ children, ...props }) => <li {...props}>{children}</li>,
            // Asegurar que los blockquotes se rendericen correctamente
            blockquote: ({ children, ...props }) => <blockquote {...props}>{children}</blockquote>
          }}
        >
          {content}
        </ReactMarkdown>
      ) : (
        <p className="text-[#a0a0a0] italic">Start writing in Markdown...</p>
      )}
    </div>
  )
}
