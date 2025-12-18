/* eslint-disable prettier/prettier */
import React from 'react'
import { useSettings } from '../../../../contexts/SettingsContext'
import { IconSet } from '../../../../types/settings'
import Toggle from '../../Toggle'
import Select from '../../Select'

export default function UIVisibility(): React.ReactElement {
  const { settings, updateUIVisibility } = useSettings()

  return (
    <div className="space-y-1 border-t border-ink-700 pt-4">
      <Toggle
        label="Show sidebar"
        checked={settings.ui.visibility.showSidebar}
        onChange={(checked) => updateUIVisibility({ showSidebar: checked })}
      />
      
      <Toggle
        label="Show notes bar"
        checked={settings.ui.visibility.showNotesBar}
        onChange={(checked) => updateUIVisibility({ showNotesBar: checked })}
      />
      
      <Toggle
        label="Show top bar"
        checked={settings.ui.visibility.showTopBar}
        onChange={(checked) => updateUIVisibility({ showTopBar: checked })}
      />
      
      <Select
        label="Icon set"
        value={settings.ui.visibility.iconSet}
        options={[
          { value: 'minimal', label: 'Minimal' },
          { value: 'outline', label: 'Outline' },
          { value: 'filled', label: 'Filled' }
        ]}
        onChange={(value) => updateUIVisibility({ iconSet: value as IconSet })}
      />
    </div>
  )
}
