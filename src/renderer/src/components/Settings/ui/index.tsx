/* eslint-disable prettier/prettier */
import React from 'react'
import UITheme from './theme/UITheme'
import UIVisibility from './visibility/UIVisibility'

export default function UISettings(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Theme and Visual */}
      <UITheme />

      {/* Element Visibility */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Element Visibility</h3>
        <UIVisibility />
      </div>
    </div>
  )
}
