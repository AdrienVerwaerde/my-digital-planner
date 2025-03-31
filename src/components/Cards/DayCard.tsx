import { Card, CardContent, Typography, Box, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import CardModal from './CardModal'
import { mockEvents } from '@/app/data/dummyData'

type DayCardProps = {
    date: string
    eventName?: string
    availableCount?: number
    dimmed?: boolean
    onClick?: () => void
}



const DayCard = ({ date, eventName, availableCount = 0, dimmed }: DayCardProps) => {
    const formattedDate = dayjs(date)
        .format('dddd DD/MM')
        .replace(/^\w/, (c) => c.toUpperCase())
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

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => { setOpen(!open) };

    return (
        <>
            <Card elevation={1}
                onClick={handleModalOpen}
                sx={cardStyle}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: "secondary.main", height: "100%", opacity: dimmed ? 0.4 : 1 }}>
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, fontFamily: 'Roboto, sans-serif' }}>
                            {formattedDate}
                        </Typography>
                        {eventName ? (
                            <Typography variant="body2" sx={{ backgroundColor: "primary.light", borderRadius: 2, p: 1, fontFamily: 'Consolas, monospace' }}>{eventName}</Typography>
                        ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Consolas, monospace' }}>
                                Aucun événement
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="caption" sx={{ whiteSpace: "nowrap", mt: "auto", fontFamily: 'Roboto, sans-serif' }}><b>{availableCount}</b> participant.es</Typography>
                </CardContent>
            </Card>
            <CardModal
                isModalOpen={open}
                handleCloseModal={handleModalOpen}
                date={date}
                events={mockEvents}
            />
        </>
    )
}

export default DayCard
