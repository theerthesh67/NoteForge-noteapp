/* eslint-disable prettier/prettier */
import React from 'react'
import { useSettings } from '../../../contexts/SettingsContext'
import { EditorView, MarkdownDialect } from '../../../types/settings'
import Toggle from '../Toggle'
import Slider from '../Slider'
import Select from '../Select'
import Input from '../Input'

export default function EditorSettings(): React.ReactElement {
  const { settings, updateEditorAppearance, updateEditorBehavior, updateMarkdownSettings } = useSettings()

  return (
    <div className="space-y-8">
      {/* Editor Appearance */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Editor Appearance</h3>
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
            value={settings.editor.appearance.fontFamily}
            options={[
              { value: 'monospace', label: 'Monospace' },
              { value: 'custom', label: 'Custom font' }
            ]}
            onChange={(value) => updateEditorAppearance({ fontFamily: value as 'monospace' | 'custom' })}
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
      </div>

      {/* Behavior */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Behavior</h3>
        <div className="space-y-1 border-t border-ink-700 pt-4">
          <Select
            label="View"
            value={settings.editor.behavior.view}
            options={[
              { value: 'editor-only', label: 'Editor only' },
              { value: 'editor-preview', label: 'Editor + live preview' },
              { value: 'preview-only', label: 'Preview only' }
            ]}
            onChange={(value) => updateEditorBehavior({ view: value as EditorView })}
          />
          
          <Toggle
            label="Synchronized scroll editor / preview"
            checked={settings.editor.behavior.syncScroll}
            onChange={(checked) => updateEditorBehavior({ syncScroll: checked })}
            disabled={settings.editor.behavior.view !== 'editor-preview'}
          />
          
          <Toggle
            label="Auto-save"
            checked={settings.editor.behavior.autoSave}
            onChange={(checked) => updateEditorBehavior({ autoSave: checked })}
          />
          
          {settings.editor.behavior.autoSave && (
            <Slider
              label="Auto-save interval"
              description="Time in seconds between automatic saves"
              value={settings.editor.behavior.autoSaveInterval}
              min={1}
              max={60}
              unit="s"
              onChange={(value) => updateEditorBehavior({ autoSaveInterval: value })}
            />
          )}
          
          <Toggle
            label="Confirm when closing unsaved notes"
            checked={settings.editor.behavior.confirmOnClose}
            onChange={(checked) => updateEditorBehavior({ confirmOnClose: checked })}
          />
          
          <Toggle
            label="Restore previous session on startup"
            checked={settings.editor.behavior.restoreSession}
            onChange={(checked) => updateEditorBehavior({ restoreSession: checked })}
          />
        </div>
      </div>

      {/* Markdown */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Markdown</h3>
        <div className="space-y-1 border-t border-ink-700 pt-4">
          <Select
            label="Dialect selection"
            value={settings.editor.markdown.dialect}
            options={[
              { value: 'commonmark', label: 'CommonMark' },
              { value: 'gfm', label: 'GitHub Flavored Markdown' }
            ]}
            onChange={(value) => updateMarkdownSettings({ dialect: value as MarkdownDialect })}
          />
          
          <Toggle
            label="Tables"
            checked={settings.editor.markdown.tables}
            onChange={(checked) => updateMarkdownSettings({ tables: checked })}
          />
          
          <Toggle
            label="Task lists"
            checked={settings.editor.markdown.taskLists}
            onChange={(checked) => updateMarkdownSettings({ taskLists: checked })}
          />
          
          <Toggle
            label="Footnotes"
            checked={settings.editor.markdown.footnotes}
            onChange={(checked) => updateMarkdownSettings({ footnotes: checked })}
          />
          
          <Toggle
            label="Math support (KaTeX / LaTeX)"
            checked={settings.editor.markdown.mathSupport}
            onChange={(checked) => updateMarkdownSettings({ mathSupport: checked })}
          />
          
          <Toggle
            label="Diagrams (Mermaid)"
            checked={settings.editor.markdown.diagrams}
            onChange={(checked) => updateMarkdownSettings({ diagrams: checked })}
          />
          
          <Toggle
            label="Embedded HTML rendering"
            checked={settings.editor.markdown.htmlEmbedded}
            onChange={(checked) => updateMarkdownSettings({ htmlEmbedded: checked })}
          />
        </div>
      </div>
    </div>
  )
}

