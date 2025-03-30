'use client'

import {
    Box,
    Typography,
    useMediaQuery,
    IconButton,
} from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/fr'
import { useState, useMemo } from 'react'
import DayCard from '../Cards/DayCard'
import CalendarHeader from './CalendarHeader';

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
        return Array.from({ length: totalDays }, (_, i) =>
            currentMonth.add(i, 'day').format('YYYY-MM-DD')
        )
    }, [currentMonth])

    return (
        <>
            <Typography
                variant="h3"
                sx={{
                    textAlign: 'center',
                    padding: '1rem',
                    mt: isMobile ? '1rem' : '1rem',
                    color: 'white',
                    textTransform: 'uppercase',
                    fontFamily: 'Solano, sans-serif',
                    fontWeight: 600,
                }}
            >
                Planning des Événements
            </Typography>

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
                {daysInMonth.map((date, i) => (
                    <DayCard
                        key={i}
                        date={date}
                        eventName={i % 3 === 0 ? 'Board Games Night' : undefined}
                        availableCount={i % 2 === 0 ? 5 + i : 0}
                    />
                ))}
            </Box>
        </>
    )
}
