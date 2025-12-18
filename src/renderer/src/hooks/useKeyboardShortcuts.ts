/* eslint-disable prettier/prettier */
import { useEffect, useCallback } from 'react'
import { useSettings } from '../contexts/SettingsContext'

interface KeyboardShortcutsHandlers {
  onCreateNote?: () => void
  onSwitchNote?: () => void
  onTogglePreview?: () => void
  onToggleSidebar?: () => void
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutsHandlers): void {
  const { settings } = useSettings()

  // Función para normalizar nombres de teclas
  const normalizeKey = useCallback((key: string): string => {
    if (!key) return ''
    
    const normalized = key.toLowerCase().trim()
    const keyMap: Record<string, string> = {
      'tab': 'tab',
      ' ': 'space',
      'space': 'space',
      'enter': 'enter',
      'escape': 'esc',
      'esc': 'esc',
      'arrowup': 'up',
      'up': 'up',
      'arrowdown': 'down',
      'down': 'down',
      'arrowleft': 'left',
      'left': 'left',
      'arrowright': 'right',
      'right': 'right',
      'n': 'n',
      'p': 'p',
      'b': 'b'
    }
    
    // Si está en el mapa, usar el valor del mapa
    if (keyMap[normalized]) {
      return keyMap[normalized]
    }
    
    // Si es una sola letra, devolverla en minúscula
    if (normalized.length === 1 && /[a-z]/.test(normalized)) {
      return normalized
    }
    
    return normalized
  }, [])

  // Función para parsear el shortcut desde settings
  const parseShortcut = useCallback((shortcutString: string): { key: string; ctrl: boolean; shift: boolean; alt: boolean } => {
    if (!shortcutString) {
      return { key: '', ctrl: false, shift: false, alt: false }
    }
    
    const parts = shortcutString.toLowerCase().split('+').map(p => p.trim())
    const key = normalizeKey(parts[parts.length - 1])
    
    return {
      key,
      ctrl: parts.includes('ctrl') || parts.includes('cmd'),
      shift: parts.includes('shift'),
      alt: parts.includes('alt')
    }
  }, [normalizeKey])

  // Obtener shortcuts desde settings
  const getShortcut = useCallback((id: string): string => {
    const shortcut = settings.keyboard.shortcuts.find((s) => s.id === id)
    return shortcut?.currentKey || shortcut?.defaultKey || ''
  }, [settings.keyboard.shortcuts])

  // Función para verificar si un shortcut coincide
  const matchesShortcut = useCallback((
    e: KeyboardEvent,
    shortcut: { key: string; ctrl: boolean; shift: boolean; alt: boolean }
  ): boolean => {
    const eventKey = normalizeKey(e.key)
    const hasCtrl = e.ctrlKey || e.metaKey
    const hasShift = e.shiftKey
    const hasAlt = e.altKey

    return (
      eventKey === shortcut.key &&
      hasCtrl === shortcut.ctrl &&
      hasShift === shortcut.shift &&
      hasAlt === shortcut.alt
    )
  }, [normalizeKey])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Ignorar si estamos escribiendo en un input o textarea (excepto shortcuts especiales)
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      // Obtener todos los shortcuts
      const createNoteShortcut = parseShortcut(getShortcut('new-note'))
      const switchNoteShortcut = parseShortcut(getShortcut('switch-note'))
      const togglePreviewShortcut = parseShortcut(getShortcut('toggle-preview'))
      const toggleSidebarShortcut = parseShortcut(getShortcut('toggle-sidebar'))

      // Create note
      if (matchesShortcut(e, createNoteShortcut)) {
        if (!isInput || (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          handlers.onCreateNote?.()
          return
        }
      }

      // Switch note (Ctrl+Tab is special, works even in inputs)
      if (matchesShortcut(e, switchNoteShortcut)) {
        e.preventDefault()
        handlers.onSwitchNote?.()
        return
      }

      // Toggle preview (siempre funciona)
      if (matchesShortcut(e, togglePreviewShortcut)) {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('toggle-preview'))
        handlers.onTogglePreview?.()
        return
      }

      // Toggle sidebar (siempre funciona)
      if (matchesShortcut(e, toggleSidebarShortcut)) {
        e.preventDefault()
        handlers.onToggleSidebar?.()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handlers, getShortcut, parseShortcut, matchesShortcut])
}
