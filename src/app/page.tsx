'use client'

import '../styles/styles.css'
import { CustomCalendar } from '@/components/Calendar/CustomCalendar'
import { Footer } from '@/components/Footer/Footer'
import { SessionProvider } from 'next-auth/react'

export default function HomePage() {
  return (
    <SessionProvider>
      <main>
        <CustomCalendar />
        <Footer />
      </main>
    </SessionProvider>
  )
}
