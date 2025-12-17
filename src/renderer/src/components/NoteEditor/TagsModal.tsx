/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'

interface TagsModalProps {
  isOpen: boolean
  newTagName: string
  newTagColor: string
  tagColors: string[]
  modalRef: React.RefObject<HTMLDivElement | null>
  onTagNameChange: (name: string) => void
  onTagColorChange: (color: string) => void
  onAdd: () => void
  onCancel: () => void
}

export default function TagsModal({
  isOpen,
  newTagName,
  newTagColor,
  tagColors,
  modalRef,
  onTagNameChange,
  onTagColorChange,
  onAdd,
  onCancel
}: TagsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        ref={modalRef}
        className="bg-[#252525] border border-[#333] rounded-lg p-6 w-96 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[#e0e0e0] mb-4">Add Tag</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Tag Name</label>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => onTagNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAdd()
                } else if (e.key === 'Escape') {
                  onCancel()
                }
              }}
              placeholder="Enter tag name"
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-[#e0e0e0] placeholder-[#a0a0a0] focus:outline-none focus:border-[#3b82f6]"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {tagColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onTagColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    newTagColor === color ? 'border-[#e0e0e0] scale-110' : 'border-[#333]'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-[#a0a0a0] hover:text-[#e0e0e0]"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
