'use client'

import '../styles/styles.css'
import { CustomCalendar } from '@/components/Calendar/CustomCalendar'
import { Footer } from '@/components/Footer/Footer'
import { ThemeContext } from '@emotion/react'
import { Box } from '@mui/material'

export default function HomePage() {
  return (
    <main>
      <CustomCalendar />
      <Footer />
    </main>
  )
}
