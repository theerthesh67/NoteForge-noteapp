/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { Note, Notebook } from '../../types/note'
import NoteEditorTitle from './NoteEditorTitle'
import NoteMetadata from './NoteMetadata'
import FormattingToolbar from './FormattingToolbar'

interface NoteEditorHeaderProps {
  note: Note
  notebooks: Notebook[]
  tags: Record<string, string>
  isEditingTitle: boolean
  statusLabel: string
  showStatusDropdown: boolean
  statusDropdownRef: React.RefObject<HTMLDivElement | null>
  wordCount: number
  charCount: number
  onTitleEditStart: () => void
  onTitleSave: (title: string) => void
  onTitleCancel: () => void
  onStatusToggle: () => void
  onStatusChange: (status: Note['status']) => void
  onRemoveTag: (tagName: string) => void
  onAddTagClick: () => void
}

export default function NoteEditorHeader({
  note,
  notebooks,
  tags,
  isEditingTitle,
  statusLabel,
  showStatusDropdown,
  statusDropdownRef,
  wordCount,
  charCount,
  onTitleEditStart,
  onTitleSave,
  onTitleCancel,
  onStatusToggle,
  onStatusChange,
  onRemoveTag,
  onAddTagClick
}: NoteEditorHeaderProps) {
  return (
    <div className="px-6 py-5 border-b border-ink-700 bg-ink-900/50 backdrop-blur-sm">
      {/* Title */}
      <div className="mb-3">
        <NoteEditorTitle
          title={note.title}
          isEditing={isEditingTitle}
          onStartEdit={onTitleEditStart}
          onSave={onTitleSave}
          onCancel={onTitleCancel}
        />
      </div>

      {/* Metadata Line */}
      <NoteMetadata
        note={note}
        notebooks={notebooks}
        tags={tags}
        statusLabel={statusLabel}
        showStatusDropdown={showStatusDropdown}
        statusDropdownRef={statusDropdownRef}
        onStatusToggle={onStatusToggle}
        onStatusChange={onStatusChange}
        onRemoveTag={onRemoveTag}
        onAddTagClick={onAddTagClick}
      />

      {/* Formatting Toolbar */}
      <FormattingToolbar wordCount={wordCount} charCount={charCount} />
    </div>
  )
}
