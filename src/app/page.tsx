'use client'

import '../styles/styles.css'
import { CustomCalendar } from '@/components/Calendar/CustomCalendar'
import { Footer } from '@/components/Footer/Footer'

export default function HomePage() {
  return (
    <main>
      <CustomCalendar />
      <Footer />
    </main>
  )
}
