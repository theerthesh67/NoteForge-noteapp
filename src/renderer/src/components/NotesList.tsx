/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect, useRef } from 'react'
import { Note } from '../types/note'

interface NotesListProps {
  notes: Note[]
  selectedNoteId?: string
  onNoteSelect: (note: Note) => void
  onNewNote: () => void
  onPinNote: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
}

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6L12 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

export default function NotesList({
  notes,
  selectedNoteId,
  onNoteSelect,
  onNewNote,
  onPinNote,
  onDeleteNote
}: NotesListProps) {
  const [contextMenu, setContextMenu] = useState<{ noteId: string; x: number; y: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu(null)
      }
    }

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
    return undefined
  }, [contextMenu])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getPreview = (content: string): string => {
    const cleaned = content.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').replace(/\*/g, '')
    return cleaned.substring(0, 80).replace(/\n/g, ' ').trim() + (cleaned.length > 80 ? '...' : '')
  }

  const handleContextMenu = (e: React.MouseEvent, noteId: string): void => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ noteId, x: e.clientX, y: e.clientY })
  }

  const handlePin = (noteId: string): void => {
    onPinNote(noteId)
    setContextMenu(null)
  }

  const handleDelete = (noteId: string): void => {
    onDeleteNote(noteId)
    setContextMenu(null)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort: pinned first, then by date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return (
    <div className="w-80 h-full bg-ink-900 border-r border-ink-700 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-ink-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Notes</h2>
            <p className="text-xs text-text-muted mt-0.5">{notes.length} notes</p>
          </div>
          <button
            onClick={onNewNote}
            className="w-9 h-9 flex items-center justify-center bg-linear-to-br from-amber to-amber-dark rounded-lg text-ink-900 hover:shadow-glow transition-all hover:scale-105"
            title="New Note"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ink-800 border border-ink-600 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {sortedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-text-muted">
                <path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-text-secondary font-medium mb-1">No notes yet</p>
            <p className="text-text-muted text-sm">Create your first note to get started</p>
          </div>
        ) : (
          <div className="py-2">
            {sortedNotes.map((note, index) => {
              const isSelected = selectedNoteId === note.id
              return (
                <div
                  key={note.id}
                  onClick={() => onNoteSelect(note)}
                  onContextMenu={(e) => handleContextMenu(e, note.id)}
                  className={`group mx-2 mb-1 px-4 py-3 rounded-lg cursor-pointer transition-all duration-150 border-l-2 ${
                    isSelected
                      ? 'bg-linear-to-r from-amber/15 to-transparent border-amber'
                      : 'border-transparent hover:bg-ink-800 hover:border-amber/30'
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3
                      className={`text-sm font-medium line-clamp-1 ${
                        isSelected ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                      }`}
                    >
                      {note.title || 'Untitled'}
                    </h3>
                    {note.pinned && (
                      <span className="text-amber shrink-0">
                        <StarIcon filled />
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs line-clamp-2 mb-2 ${
                      isSelected ? 'text-text-secondary' : 'text-text-muted'
                    }`}
                  >
                    {getPreview(note.content) || 'No content'}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isSelected ? 'text-amber' : 'text-text-muted'}`}>
                      {formatDate(note.updatedAt)}
                    </span>
                    {note.tags && note.tags.length > 0 && (
                      <>
                        <span className="text-text-muted">·</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-amber/20 text-amber' : 'bg-ink-700 text-text-muted'
                          }`}
                        >
                          {note.tags[0]}
                        </span>
                        {note.tags.length > 1 && (
                          <span className="text-xs text-text-muted">+{note.tags.length - 1}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed bg-ink-700 border border-ink-600 rounded-lg shadow-xl z-50 min-w-[160px] py-1 animate-fade-in"
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
        >
          <button
            onClick={() => handlePin(contextMenu.noteId)}
            className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-ink-600 hover:text-text-primary flex items-center gap-2 transition-colors"
          >
            <StarIcon />
            {notes.find((n) => n.id === contextMenu.noteId)?.pinned ? 'Unstar' : 'Star'}
          </button>
          <div className="h-px bg-ink-600 my-1" />
          <button
            onClick={() => handleDelete(contextMenu.noteId)}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-ink-600 flex items-center gap-2 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
