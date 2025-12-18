/* eslint-disable prettier/prettier */
import React from 'react'
import { useSettings } from '../../../../contexts/SettingsContext'
import Select from '../../Select'

export default function KeyboardProfiles(): React.ReactElement {
  const { settings, updateKeyboardSettings } = useSettings()

  const handleProfileChange = (profile: string): void => {
    updateKeyboardSettings({ profile: profile as 'default' | 'vim' | 'emacs' })
    // Here you could apply the shortcuts from the selected profile
  }

  return (
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
  )
}
