/* eslint-disable prettier/prettier */
import { Settings, defaultSettings } from '../types/settings'

const SETTINGS_KEY = 'inkdrop-settings'

export const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge con defaults para asegurar que todas las propiedades existan
      return {
        ...defaultSettings,
        ...parsed,
        editor: {
          ...defaultSettings.editor,
          ...parsed.editor,
          appearance: {
            ...defaultSettings.editor.appearance,
            ...parsed.editor?.appearance
          },
          behavior: {
            ...defaultSettings.editor.behavior,
            ...parsed.editor?.behavior
          },
          markdown: {
            ...defaultSettings.editor.markdown,
            ...parsed.editor?.markdown
          }
        },
        keyboard: {
          ...defaultSettings.keyboard,
          ...parsed.keyboard,
          shortcuts: parsed.keyboard?.shortcuts || defaultSettings.keyboard.shortcuts
        },
        ui: {
          ...defaultSettings.ui,
          ...parsed.ui,
          theme: {
            ...defaultSettings.ui.theme,
            ...parsed.ui?.theme
          },
          visibility: {
            ...defaultSettings.ui.visibility,
            ...parsed.ui?.visibility
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
  return defaultSettings
}

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

export const resetSettings = (): Settings => {
  saveSettings(defaultSettings)
  return defaultSettings
}

