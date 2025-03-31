'use client'

import { Card, CardContent, Typography, Box, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import CardModal from './CardModal'
import { useFormattedDate } from '@/app/hooks/useFormattedDate'

type DayCardProps = {
    date: string
    dimmed?: boolean
    events?: {
        id: string
        name: string
        location: string
        time: string
        availableCount: number
        isUserParticipating: boolean
    }[]
    refreshEvents: () => Promise<void>
    onClick?: () => void
}

const DayCard = ({ date, dimmed, events = [], refreshEvents }: DayCardProps) => {
    const formattedDate = useFormattedDate(date)

    const isMobile = useMediaQuery('(max-width: 640px)')

    const cardStyle = {
        width: isMobile ? 170 : 200,
        height: 170,
        borderRadius: 2,
        m: "2px",
        cursor: 'pointer',
        transition: 'all 0.05s ease',
        '&:hover': {
            border: '2px solid #FFB905',
            boxShadow: "none",
        },
    }

    const [open, setOpen] = useState(false)
    const handleModalOpen = () => { setOpen(!open) }

    const participantCount = events.reduce(
        (total, event) => total + (event.availableCount || 0),
        0
    )

    return (
        <>
            <Card elevation={1} onClick={handleModalOpen} sx={cardStyle}>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: "secondary.main",
                        height: "100%",
                        opacity: dimmed ? 0.4 : 1
                    }}
                >
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, fontFamily: 'Roboto, sans-serif' }}>
                            {formattedDate}
                        </Typography>
                        {events.length > 0 ? (
                            <Typography
                                variant="body2"
                                sx={{
                                    backgroundColor: events.some(e => e.isUserParticipating) ? 'primary.main' : 'primary.light',
                                    color: events.some(e => e.isUserParticipating) ? 'white' : 'secondary.main',
                                    borderRadius: 2,
                                    p: 1,
                                    fontFamily: 'Consolas, monospace'
                                }}
                            >
                                {events.length === 1 ? events[0].name : `${events.length} événements`}
                            </Typography>
                        ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Consolas, monospace' }}>
                                Aucun événement
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="caption" sx={{ whiteSpace: "nowrap", mt: "auto", fontFamily: 'Roboto, sans-serif' }}>
                        <b>{participantCount}</b> participant.es
                    </Typography>
                </CardContent>
            </Card>

            <CardModal
                isModalOpen={open}
                handleCloseModal={handleModalOpen}
                date={date}
                events={events}
                refreshEvents={refreshEvents}
            />
        </>
    )
}

export default DayCard
