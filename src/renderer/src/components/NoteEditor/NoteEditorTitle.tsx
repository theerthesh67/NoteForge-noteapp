/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'

interface NoteEditorTitleProps {
  title: string
  isEditing: boolean
  onStartEdit: () => void
  onSave: (title: string) => void
  onCancel: () => void
}

export default function NoteEditorTitle({
  title,
  isEditing,
  onStartEdit,
  onSave,
  onCancel
}: NoteEditorTitleProps) {
  const [editedTitle, setEditedTitle] = React.useState(title)

  React.useEffect(() => {
    setEditedTitle(title)
  }, [title])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave(editedTitle)
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  if (isEditing) {
    return (
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        onBlur={() => onSave(editedTitle)}
        onKeyDown={handleKeyDown}
        className="text-2xl font-serif font-semibold bg-transparent text-text-primary border-b-2 border-amber focus:outline-none w-full pb-1 tracking-tight"
        autoFocus
      />
    )
  }

  return (
    <h1
      className="text-2xl font-serif font-semibold text-text-primary cursor-text hover:text-amber transition-colors tracking-tight"
      onClick={onStartEdit}
    >
      {title}
    </h1>
  )
}
