'use client'

import {
    Box,
    Typography,
    useMediaQuery,
} from '@mui/material'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/fr'
import { useState, useMemo, useEffect } from 'react'
import DayCard from '../Cards/DayCard'
import CalendarHeader from './CalendarHeader'
import { Header } from '../Header/Header'

dayjs.extend(localeData)
dayjs.locale('fr')

type CalendarEvent = {
    id: string
    name: string
    locations: { id: string; name: string, address: string, link: string }[];
    time: string
    availableCount: number
    isUserParticipating: boolean
    date: string
}

export const CustomCalendar = () => {
    const isSmallScreen = useMediaQuery('(max-width: 1080px)')
    const isMobile = useMediaQuery('(max-width: 640px)')
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
            const res = await fetch('/api/user-events')
            const data = await res.json()
            setEvents(data)
        }

        fetchEvents()
    }, [])

    const today = dayjs()
    const maxDate = today.add(1, 'year')
    const [currentMonth, setCurrentMonth] = useState(today.startOf('month'))

    const handleMonthChange = (direction: 'prev' | 'next') => {
        const nextMonth =
            direction === 'prev'
                ? currentMonth.subtract(1, 'month')
                : currentMonth.add(1, 'month')

        if (nextMonth.isBefore(today.startOf('month'))) return
        if (nextMonth.isAfter(maxDate.startOf('month'))) return

        setCurrentMonth(nextMonth)
    }

    const daysInMonth = useMemo(() => {
        const totalDays = currentMonth.daysInMonth()
        const baseDays = Array.from({ length: totalDays }, (_, i) => {
            const currentDate = currentMonth.add(i, 'day')
            return {
                date: currentDate.format('YYYY-MM-DD'),
                today: currentDate.isSame(today, 'day'),
                dimmed: false,
                isPast: currentDate.isBefore(today, 'day'),
            }
        })


        const columns = isMobile ? 2 : isSmallScreen ? 3 : 4
        const missing = columns - (baseDays.length % columns || columns)

        const nextMonthStart = currentMonth.add(1, 'month').startOf('month')
        const extraDays = Array.from({ length: missing }, (_, i) => ({
            date: nextMonthStart.add(i, 'day').format('YYYY-MM-DD'),
            today: false,
            dimmed: true,
            isPast: false,
        }))

        return [...baseDays, ...extraDays]
    }, [currentMonth, isMobile, isSmallScreen])

    const eventsByDate = useMemo(() => {
        if (!Array.isArray(events)) return {}

        return events.reduce((acc: Record<string, CalendarEvent[]>, event: CalendarEvent) => {
            if (!acc[event.date]) acc[event.date] = []
            acc[event.date].push(event)
            return acc
        }, {})
    }, [events])

    const refreshEvents = async () => {
        const res = await fetch('/api/user-events')
        const data = await res.json()
        setEvents(data)
    }


    return (
        <>
            <Header />

            <CalendarHeader
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                minMonth={today.startOf('month')}
                maxMonth={maxDate.startOf('month')}
            />

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
                {daysInMonth.map(({ date, dimmed, isPast, today }, i) => {
                    const eventsForThisDay = eventsByDate[date] || []

                    return (
                        <DayCard
                            key={i}
                            date={date}
                            dimmed={dimmed}
                            today={today}
                            isPast={isPast}
                            events={eventsForThisDay}
                            onClick={() => console.log('Clicked:', date)}
                            refreshEvents={refreshEvents}

                        />
                    )
                })}
            </Box>
        </>
    )
}
