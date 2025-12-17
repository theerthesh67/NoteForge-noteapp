/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { Note, Notebook } from '../../types/note'

interface NoteMetadataProps {
  note: Note
  notebooks: Notebook[]
  tags: Record<string, string>
  statusLabel: string
  showStatusDropdown: boolean
  statusDropdownRef: React.RefObject<HTMLDivElement | null>
  onStatusToggle: () => void
  onStatusChange: (status: Note['status']) => void
  onRemoveTag: (tagName: string) => void
  onAddTagClick: () => void
}

const statusOptions: Array<{ value: Note['status']; label: string; color: string }> = [
  { value: 'active', label: 'Active', color: '#22c55e' },
  { value: 'on-hold', label: 'On Hold', color: '#f59e0b' },
  { value: 'completed', label: 'Completed', color: '#3b82f6' },
  { value: 'dropped', label: 'Dropped', color: '#6b7280' }
]

export default function NoteMetadata({
  note,
  notebooks,
  tags,
  statusLabel,
  showStatusDropdown,
  statusDropdownRef,
  onStatusToggle,
  onStatusChange,
  onRemoveTag,
  onAddTagClick
}: NoteMetadataProps) {
  const getNotebookName = (): string => {
    if (!note?.notebook) return 'No Notebook'
    const allNotebooks = notebooks.flatMap((nb) => [
      nb,
      ...(nb.children || []).map((child) => ({ ...child, parentId: nb.id }))
    ])
    const found = allNotebooks.find((nb) => nb.id === note.notebook)
    return found?.name || 'No Notebook'
  }

  const currentStatus = note.status || 'active'
  const currentStatusColor = statusOptions.find(s => s.value === currentStatus)?.color || '#22c55e'

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Notebook Selector */}
      <div className="flex items-center gap-2 text-sm text-text-muted cursor-pointer hover:text-text-primary transition-colors group">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-text-muted group-hover:text-amber transition-colors">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>{getNotebookName()}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-text-muted">
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <span className="text-ink-600">•</span>

      {/* Status Selector */}
      <div className="relative" ref={statusDropdownRef}>
        <div
          className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onStatusToggle}
        >
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: currentStatusColor, boxShadow: `0 0 6px ${currentStatusColor}` }} 
          />
          <span className="text-text-secondary">{statusLabel}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-text-muted">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {showStatusDropdown && (
          <div className="absolute top-full left-0 mt-2 bg-ink-700 border border-ink-600 rounded-lg shadow-xl z-50 min-w-[140px] py-1 animate-fade-in">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => onStatusChange(status.value)}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                  currentStatus === status.value
                    ? 'bg-amber/10 text-amber'
                    : 'text-text-secondary hover:bg-ink-600 hover:text-text-primary'
                }`}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: status.color }} 
                />
                {status.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tags Display */}
      {note.tags && note.tags.length > 0 && (
        <>
          <span className="text-ink-600">•</span>
          <div className="flex items-center gap-2 flex-wrap">
            {note.tags.map((tagName) => {
              const tagColor = tags[tagName] || '#f59e0b'
              return (
                <div
                  key={tagName}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${tagColor}20`,
                    color: tagColor,
                    border: `1px solid ${tagColor}40`
                  }}
                >
                  <span>{tagName}</span>
                  <button
                    onClick={() => onRemoveTag(tagName)}
                    className="hover:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Add Tags */}
      <button
        className="text-sm text-text-muted hover:text-amber transition-colors flex items-center gap-1"
        onClick={onAddTagClick}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Add Tag</span>
      </button>
    </div>
  )
}
