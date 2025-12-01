import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Advent Calendar 2025',
  description: 'Archive your precious memories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

