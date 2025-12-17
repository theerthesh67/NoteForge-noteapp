/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useSettings } from '../../../contexts/SettingsContext'
import Select from '../Select'

export default function KeyboardSettings(): React.ReactElement {
  const { settings, updateKeyboardSettings } = useSettings()
  const [editingShortcut, setEditingShortcut] = useState<string | null>(null)

  const handleProfileChange = (profile: string): void => {
    updateKeyboardSettings({ profile: profile as 'default' | 'vim' | 'emacs' })
    // Here you could apply the shortcuts from the selected profile
  }

  const handleShortcutChange = (shortcutId: string, newKey: string): void => {
    const updatedShortcuts = settings.keyboard.shortcuts.map((s) =>
      s.id === shortcutId ? { ...s, currentKey: newKey } : s
    )
    updateKeyboardSettings({ shortcuts: updatedShortcuts })
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Shortcut Profiles</h3>
        <div className="space-y-1 border-t border-ink-700 pt-4">
          <Select
            label="Profile"
            description="Select a predefined keyboard shortcut profile"
            value={settings.keyboard.profile}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'vim', label: 'Vim' },
              { value: 'emacs', label: 'Emacs' }
            ]}
            onChange={handleProfileChange}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-1 border-t border-ink-700 pt-4">
          {settings.keyboard.shortcuts.map((shortcut) => (
            <div key={shortcut.id} className="flex items-center justify-between py-3 border-b border-ink-700 last:border-0">
              <div className="flex-1">
                <label className="text-sm font-medium text-text-primary">{shortcut.name}</label>
              </div>
              <div className="flex items-center gap-2">
                {editingShortcut === shortcut.id ? (
                  <input
                    type="text"
                    value={shortcut.currentKey}
                    onChange={(e) => handleShortcutChange(shortcut.id, e.target.value)}
                    onBlur={() => setEditingShortcut(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingShortcut(null)
                    }}
                    className="px-3 py-1.5 bg-ink-800 border border-amber rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-amber/20 w-32"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setEditingShortcut(shortcut.id)}
                    className="px-3 py-1.5 bg-ink-800 border border-ink-600 rounded text-sm text-text-primary hover:border-amber transition-all w-32 text-left"
                  >
                    {shortcut.currentKey}
                  </button>
                )}
                <button
                  onClick={() => handleShortcutChange(shortcut.id, shortcut.defaultKey)}
                  className="text-xs text-text-muted hover:text-amber transition-colors"
                  title="Restore default value"
                >
                  Reset
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-ink-700">
        <button className="px-4 py-2 bg-ink-800 border border-ink-600 rounded-lg text-sm text-text-primary hover:border-amber transition-all">
          Import shortcuts
        </button>
        <button className="px-4 py-2 bg-ink-800 border border-ink-600 rounded-lg text-sm text-text-primary hover:border-amber transition-all">
          Export shortcuts
        </button>
      </div>
    </div>
  )
}

