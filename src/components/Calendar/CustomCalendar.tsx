'use client'

import {
    Box,
    Typography,
    useMediaQuery,
    IconButton,
} from '@mui/material'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/fr'
import { useState, useMemo } from 'react'
import DayCard from '../Cards/DayCard'
import CalendarHeader from './CalendarHeader';
import { Header } from '../Header/Header';

dayjs.extend(localeData)
dayjs.locale('fr')

export const CustomCalendar = () => {
    const isSmallScreen = useMediaQuery('(max-width: 1080px)')
    const isMobile = useMediaQuery('(max-width: 640px)')

    const today = dayjs()
    const maxDate = today.add(1, 'year')

    const [currentMonth, setCurrentMonth] = useState(today.startOf('month'))

    const handleMonthChange = (direction: 'prev' | 'next') => {
        const nextMonth =
            direction === 'prev'
                ? currentMonth.subtract(1, 'month')
                : currentMonth.add(1, 'month')

        // limit between today and today + 1 year
        if (nextMonth.isBefore(today.startOf('month'))) return
        if (nextMonth.isAfter(maxDate.startOf('month'))) return

        setCurrentMonth(nextMonth)
    }

    const daysInMonth = useMemo(() => {
        const totalDays = currentMonth.daysInMonth()
        const baseDays = Array.from({ length: totalDays }, (_, i) => ({
            date: currentMonth.add(i, 'day').format('YYYY-MM-DD'),
            dimmed: false,
        }))

        // Determine number of cards per row based on screen size
        const columns = isMobile ? 2 : isSmallScreen ? 3 : 4

        const missing = columns - (baseDays.length % columns || columns) // check if columns are missing a card

        const nextMonthStart = currentMonth.add(1, 'month').startOf('month')
        const extraDays = Array.from({ length: missing }, (_, i) => ({
            date: nextMonthStart.add(i, 'day').format('YYYY-MM-DD'),
            dimmed: true,
        }))

        return [...baseDays, ...extraDays]
    }, [currentMonth, isMobile, isSmallScreen])

    return (
        <>
            <Header />
            {/* Month/Year header */}
            <CalendarHeader
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                minMonth={today.startOf('month')}
                maxMonth={maxDate.startOf('month')}
            />

            {/* Grid of DayCards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile
                        ? 'repeat(2, 1fr)'
                        : isSmallScreen
                            ? 'repeat(3, 1fr)'
                            : 'repeat(4, 1fr)',

                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    p: 1,
                }}
            >
                {daysInMonth.map(({ date, dimmed }, i) => (
                    <DayCard
                        key={i}
                        date={date}
                        dimmed={dimmed}
                        eventName={i % 3 === 0 ? 'Board Games Night' : undefined}
                        availableCount={i % 2 === 0 ? 5 + i : 0}
                        onClick={() => console.log('Clicked:', date)}
                    />
                ))}
            </Box>
        </>
    )
}
