'use client'

import { RamadanPopup } from './RamadanPopup'

export function HomePageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <RamadanPopup />
    </>
  )
}
