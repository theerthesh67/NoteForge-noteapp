/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

interface FormattingToolbarProps {
  wordCount: number
  charCount: number
}

const ToolbarButton = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <button
    className="p-2 hover:bg-ink-700 rounded-lg text-text-muted hover:text-amber transition-all hover:scale-105"
    title={title}
  >
    {children}
  </button>
)

export default function FormattingToolbar({ wordCount, charCount }: FormattingToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 mt-4 pt-4 border-t border-ink-700">
      {/* Heading */}
      <ToolbarButton title="Heading">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      {/* Bold */}
      <ToolbarButton title="Bold (Ctrl+B)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 4H13C15.2091 4 17 5.79086 17 8C17 10.2091 15.2091 12 13 12H6V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6 12H14C16.2091 12 18 13.7909 18 16C18 18.2091 16.2091 20 14 20H6V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </ToolbarButton>

      {/* Italic */}
      <ToolbarButton title="Italic (Ctrl+I)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M10 4H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 20H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 4L10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      {/* Divider */}
      <div className="w-px h-5 bg-ink-600 mx-2" />

      {/* Bullet List */}
      <ToolbarButton title="Bullet List">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="5" cy="6" r="1.5" fill="currentColor" />
          <circle cx="5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="5" cy="18" r="1.5" fill="currentColor" />
          <path d="M9 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      {/* Numbered List */}
      <ToolbarButton title="Numbered List">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <text x="3" y="8" fill="currentColor" fontSize="6" fontFamily="sans-serif">1</text>
          <text x="3" y="14" fill="currentColor" fontSize="6" fontFamily="sans-serif">2</text>
          <text x="3" y="20" fill="currentColor" fontSize="6" fontFamily="sans-serif">3</text>
          <path d="M9 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      {/* Checkbox */}
      <ToolbarButton title="Checkbox">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ToolbarButton>

      {/* Divider */}
      <div className="w-px h-5 bg-ink-600 mx-2" />

      {/* Link */}
      <ToolbarButton title="Link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46998L11.75 5.17998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 11C13.5705 10.4259 13.0226 9.95088 12.3934 9.60708C11.7643 9.26329 11.0685 9.05886 10.3533 9.00766C9.63816 8.95645 8.92037 9.05972 8.24874 9.31026C7.57711 9.56081 6.96706 9.95298 6.46 10.46L3.46 13.46C2.54918 14.403 2.04519 15.6661 2.05659 16.977C2.06799 18.288 2.59383 19.5421 3.52087 20.4691C4.44791 21.3962 5.70198 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ToolbarButton>

      {/* Code */}
      <ToolbarButton title="Code Block">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M8 6L4 12L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 6L20 12L16 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ToolbarButton>

      {/* Image */}
      <ToolbarButton title="Image">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 16L8 12L12 16L16 12L20 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ToolbarButton>

      {/* Word/Char Count */}
      <div className="ml-auto flex items-center gap-3 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {wordCount} words
        </span>
        <span className="text-ink-600">•</span>
        <span>{charCount} chars</span>
      </div>
    </div>
  )
}
