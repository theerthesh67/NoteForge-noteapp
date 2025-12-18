/* eslint-disable prettier/prettier */
import React from 'react'
import KeyboardProfiles from './profiles/KeyboardProfiles'
import KeyboardShortcuts from './shortcuts/KeyboardShortcuts'

export default function KeyboardSettings(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Shortcut Profiles */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Shortcut Profiles</h3>
        <KeyboardProfiles />
      </div>

      {/* Keyboard Shortcuts */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Keyboard Shortcuts</h3>
        <KeyboardShortcuts />
      </div>
    </div>
  )
}
