'use client'

import { AuthGuard } from '@/components/AuthGuard/AuthGuard'
import '../../styles/styles.css'
import { CustomCalendar } from '@/components/Calendar/CustomCalendar'
import { Footer } from '@/components/Footer/Footer'
import { SessionProvider } from 'next-auth/react'

export default function HomePage() {

  return (
    <main>
      <SessionProvider>
        <AuthGuard>
          <CustomCalendar />
          <Footer />
        </AuthGuard>
      </SessionProvider>
    </main>
  )
}
