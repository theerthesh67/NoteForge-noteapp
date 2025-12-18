/* eslint-disable prettier/prettier */
import { useMemo } from 'react'
import { useSettings } from '../contexts/SettingsContext'

export function useEditorStyles() {
  const { settings } = useSettings()

  const editorStyles = useMemo(() => {
    const appearance = settings.editor.appearance
    
    // Mapeo de fuentes a sus nombres CSS
    // Nota: Cascadia Code y Hack requieren instalación local del sistema
    const fontFamilyMap: Record<string, string> = {
      'JetBrains Mono': "'JetBrains Mono', ui-monospace, monospace",
      'Fira Code': "'Fira Code', ui-monospace, monospace",
      'Source Code Pro': "'Source Code Pro', ui-monospace, monospace",
      'Cascadia Code': "'Cascadia Code', 'Consolas', ui-monospace, monospace",
      'Consolas': "'Consolas', 'Courier New', monospace",
      'Monaco': "'Monaco', 'Menlo', ui-monospace, monospace",
      'Menlo': "'Menlo', 'Monaco', ui-monospace, monospace",
      'Courier New': "'Courier New', monospace",
      'Ubuntu Mono': "'Ubuntu Mono', ui-monospace, monospace",
      'Roboto Mono': "'Roboto Mono', ui-monospace, monospace",
      'Inconsolata': "'Inconsolata', ui-monospace, monospace",
      'Space Mono': "'Space Mono', ui-monospace, monospace",
      'IBM Plex Mono': "'IBM Plex Mono', ui-monospace, monospace",
      'Hack': "'Hack', ui-monospace, monospace",
      'Anonymous Pro': "'Anonymous Pro', ui-monospace, monospace",
      'custom': `'${appearance.customFontFamily}', ui-monospace, monospace`
    }
    
    return {
      fontFamily: fontFamilyMap[appearance.fontFamily] || "'JetBrains Mono', ui-monospace, monospace",
      fontSize: `${appearance.fontSize}px`,
      lineHeight: appearance.lineHeight,
      maxWidth: appearance.maxTextWidth ? '800px' : '100%',
      margin: appearance.maxTextWidth ? '0 auto' : '0',
      padding: appearance.maxTextWidth ? '0 2rem' : '0'
    }
  }, [settings.editor.appearance])

  const editorClasses = useMemo(() => {
    const classes: string[] = ['markdown-contenteditable']
    
    if (settings.editor.appearance.lineNumbers) {
      classes.push('show-line-numbers')
    }
    
    if (settings.editor.appearance.highlightActiveLine) {
      classes.push('highlight-active-line')
    }
    
    return classes.join(' ')
  }, [settings.editor.appearance.lineNumbers, settings.editor.appearance.highlightActiveLine])

  return { editorStyles, editorClasses }
}

