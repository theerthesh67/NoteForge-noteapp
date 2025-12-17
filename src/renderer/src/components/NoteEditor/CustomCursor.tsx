/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useRef, useState } from 'react'

interface CustomCursorProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  content: string
  isVisible: boolean
}

export default function CustomCursor({ textareaRef, content, isVisible }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorStyle, setCursorStyle] = useState<React.CSSProperties>({ 
    display: 'none',
    position: 'absolute',
    width: '2px',
    backgroundColor: '#ffffff',
    zIndex: 10,
    pointerEvents: 'none'
  })

  // Calcular el tipo de línea actual y su tamaño
  const getCurrentLineInfo = () => {
    if (!textareaRef.current) return { fontSize: '0.875rem', lineHeight: 40 }

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const lineEnd = content.indexOf('\n', start)
    const lineEndPos = lineEnd === -1 ? content.length : lineEnd
    const currentLine = content.substring(lineStart, lineEndPos)

    // Detectar si es un título
    const headingMatch = currentLine.match(/^(#{1,6})\s+/)
    if (headingMatch) {
      const fontSizes: Record<number, { fontSize: string; lineHeight: number; cursorHeight: number }> = {
        1: { fontSize: '2rem', lineHeight: 40, cursorHeight: 32 },
        2: { fontSize: '1.5rem', lineHeight: 40, cursorHeight: 24 },
        3: { fontSize: '1.25rem', lineHeight: 40, cursorHeight: 20 },
        4: { fontSize: '1.125rem', lineHeight: 40, cursorHeight: 18 },
        5: { fontSize: '1rem', lineHeight: 40, cursorHeight: 16 },
        6: { fontSize: '0.9375rem', lineHeight: 40, cursorHeight: 15 }
      }
      return headingMatch[1].length in fontSizes 
        ? fontSizes[headingMatch[1].length as keyof typeof fontSizes]
        : { fontSize: '0.875rem', lineHeight: 40, cursorHeight: 14 }
    }

    return { fontSize: '0.875rem', lineHeight: 40, cursorHeight: 14 }
  }

  // Calcular la posición del cursor
  const updateCursorPosition = () => {
    if (!textareaRef.current || !cursorRef.current) return

    const textarea = textareaRef.current

    // Solo mostrar cursor si no hay selección y está visible
    if (textarea.selectionStart !== textarea.selectionEnd || !isVisible) {
      setCursorStyle({ display: 'none' })
      return
    }

    // Obtener información de la línea actual
    const lineInfo = getCurrentLineInfo()

    // Crear un div de medición con las mismas propiedades que el textarea
    const measureDiv = document.createElement('div')
    measureDiv.style.position = 'absolute'
    measureDiv.style.visibility = 'hidden'
    measureDiv.style.whiteSpace = 'pre-wrap'
    measureDiv.style.wordWrap = 'break-word'
    measureDiv.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
    measureDiv.style.padding = '1.5rem'
    measureDiv.style.width = `${textarea.offsetWidth}px`
    measureDiv.style.boxSizing = 'border-box'
    document.body.appendChild(measureDiv)

    // Obtener el texto hasta el cursor
    const textBeforeCursor = content.substring(0, textarea.selectionStart)
    const lines = textBeforeCursor.split('\n')
    const currentLineIndex = lines.length - 1

    // Calcular la posición en la línea actual
    const start = textarea.selectionStart
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const textBeforeInLine = content.substring(lineStart, start)

    // Para cada línea anterior, calcular su altura
    let totalHeight = 24 // padding top (1.5rem = 24px)
    for (let i = 0; i < currentLineIndex; i++) {
      totalHeight += 40 // Todas las líneas tienen 2.5rem (40px) de altura
    }

    // Obtener la línea actual completa para determinar su tipo
    const lineEnd = content.indexOf('\n', start)
    const lineEndPos = lineEnd === -1 ? content.length : lineEnd
    const currentLine = content.substring(lineStart, lineEndPos)
    const currentLineHeadingMatch = currentLine.match(/^(#{1,6})\s+/)

    // Configurar el tamaño de fuente para medir correctamente
    if (currentLineHeadingMatch) {
      const level = currentLineHeadingMatch[1].length
      const fontSizes: Record<number, string> = {
        1: '2rem',
        2: '1.5rem',
        3: '1.25rem',
        4: '1.125rem',
        5: '1rem',
        6: '0.9375rem'
      }
      measureDiv.style.fontSize = fontSizes[level] || '0.875rem'
    } else {
      measureDiv.style.fontSize = '0.875rem'
    }
    measureDiv.style.lineHeight = '2.5rem'

    // Medir el texto antes del cursor en esta línea
    measureDiv.textContent = textBeforeInLine
    const textWidth = measureDiv.offsetWidth

    // Calcular posición X (padding left + ancho del texto)
    const x = 24 + textWidth

    // Aplicar estilos al cursor
    setCursorStyle({
      position: 'absolute',
      left: `${x}px`,
      top: `${totalHeight}px`,
      width: '2px',
      height: `${(lineInfo as { cursorHeight: number }).cursorHeight}px`,
      backgroundColor: '#ffffff',
      zIndex: 10,
      pointerEvents: 'none',
      display: 'block',
      willChange: 'opacity'
    })

    document.body.removeChild(measureDiv)
  }

  useEffect(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current

    const handleUpdate = () => {
      requestAnimationFrame(() => {
        updateCursorPosition()
      })
    }

    // Actualizar cuando cambia la selección
    textarea.addEventListener('input', handleUpdate)
    textarea.addEventListener('keyup', handleUpdate)
    textarea.addEventListener('keydown', handleUpdate)
    textarea.addEventListener('click', handleUpdate)
    textarea.addEventListener('select', handleUpdate)
    textarea.addEventListener('scroll', handleUpdate)

    // Actualizar periódicamente para mantener sincronizado
    const interval = setInterval(() => {
      updateCursorPosition()
    }, 100)

    // Actualizar inicialmente con un pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      updateCursorPosition()
    }, 50)

    return () => {
      textarea.removeEventListener('input', handleUpdate)
      textarea.removeEventListener('keyup', handleUpdate)
      textarea.removeEventListener('keydown', handleUpdate)
      textarea.removeEventListener('click', handleUpdate)
      textarea.removeEventListener('select', handleUpdate)
      textarea.removeEventListener('scroll', handleUpdate)
      clearInterval(interval)
      clearTimeout(timeoutId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, isVisible, textareaRef])

  // Parpadeo del cursor
  const [blink, setBlink] = useState(true)
  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => {
        setBlink(false)
      }, 0)
      return
    }

    // Iniciar visible
    setTimeout(() => {
      setBlink(true)
    }, 0)

    const interval = setInterval(() => {
      setTimeout(() => {
        setBlink((prev) => !prev)
      }, 0)
    }, 530)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <div
      ref={cursorRef}
      style={{
        ...cursorStyle,
        opacity: blink && isVisible ? 1 : 0,
        transition: 'opacity 0.1s ease-in-out',
        backgroundColor: '#ffffff',
        // Asegurar que siempre sea visible cuando está activo
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    />
  )
}
