/* eslint-disable prettier/prettier */
import React from 'react'
import { useSettings } from '../../../../contexts/SettingsContext'
import { FontFamily } from '../../../../types/settings'
import Toggle from '../../Toggle'
import Slider from '../../Slider'
import Select from '../../Select'
import Input from '../../Input'

export default function EditorAppearance(): React.ReactElement {
  const { settings, updateEditorAppearance } = useSettings()

  return (
    <div className="space-y-1 border-t border-ink-700 pt-4">
      <Slider
        label="Font size"
        value={settings.editor.appearance.fontSize}
        min={10}
        max={24}
        unit="px"
        onChange={(value) => updateEditorAppearance({ fontSize: value })}
      />
      
      <Select
        label="Font family"
        description="Select a font for the entire application"
        value={settings.editor.appearance.fontFamily}
        options={[
          { value: 'JetBrains Mono', label: 'JetBrains Mono' },
          { value: 'Fira Code', label: 'Fira Code' },
          { value: 'Source Code Pro', label: 'Source Code Pro' },
          { value: 'Cascadia Code', label: 'Cascadia Code' },
          { value: 'Consolas', label: 'Consolas' },
          { value: 'Monaco', label: 'Monaco' },
          { value: 'Menlo', label: 'Menlo' },
          { value: 'Courier New', label: 'Courier New' },
          { value: 'Ubuntu Mono', label: 'Ubuntu Mono' },
          { value: 'Roboto Mono', label: 'Roboto Mono' },
          { value: 'Inconsolata', label: 'Inconsolata' },
          { value: 'Space Mono', label: 'Space Mono' },
          { value: 'IBM Plex Mono', label: 'IBM Plex Mono' },
          { value: 'Hack', label: 'Hack' },
          { value: 'Anonymous Pro', label: 'Anonymous Pro' },
          { value: 'DM Sans', label: 'DM Sans' },
          { value: 'Inter', label: 'Inter' },
          { value: 'Roboto', label: 'Roboto' },
          { value: 'Open Sans', label: 'Open Sans' },
          { value: 'Lato', label: 'Lato' },
          { value: 'Montserrat', label: 'Montserrat' },
          { value: 'Poppins', label: 'Poppins' },
          { value: 'Raleway', label: 'Raleway' },
          { value: 'custom', label: 'Custom font...' }
        ]}
        onChange={(value) => updateEditorAppearance({ fontFamily: value as FontFamily })}
      />
      
      {settings.editor.appearance.fontFamily === 'custom' && (
        <Input
          label="Custom font"
          value={settings.editor.appearance.customFontFamily}
          onChange={(value) => updateEditorAppearance({ customFontFamily: value })}
          placeholder="e.g., JetBrains Mono, Fira Code..."
        />
      )}
      
      <Slider
        label="Line height"
        value={settings.editor.appearance.lineHeight}
        min={1}
        max={3}
        step={0.1}
        onChange={(value) => updateEditorAppearance({ lineHeight: value })}
      />
      
      <Toggle
        label="Maximum text width"
        description="Limits content width for better readability"
        checked={settings.editor.appearance.maxTextWidth}
        onChange={(checked) => updateEditorAppearance({ maxTextWidth: checked })}
      />
      
      <Toggle
        label="Word wrap"
        description="Automatically wrap long lines"
        checked={settings.editor.appearance.wordWrap}
        onChange={(checked) => updateEditorAppearance({ wordWrap: checked })}
      />
      
      <Toggle
        label="Line numbers"
        checked={settings.editor.appearance.lineNumbers}
        onChange={(checked) => updateEditorAppearance({ lineNumbers: checked })}
      />
      
      <Toggle
        label="Highlight active line"
        checked={settings.editor.appearance.highlightActiveLine}
        onChange={(checked) => updateEditorAppearance({ highlightActiveLine: checked })}
      />
    </div>
  )
}

