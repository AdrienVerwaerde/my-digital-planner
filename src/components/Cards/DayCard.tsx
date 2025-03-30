import { Card, CardContent, Typography, Box, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'

type DayCardProps = {
    date: string
    eventName?: string
    availableCount?: number
}

const DayCard = ({ date, eventName, availableCount = 0 }: DayCardProps) => {
    const formattedDate = dayjs(date)
        .format('dddd DD/MM')
        .replace(/^\w/, (c) => c.toUpperCase())
    const isMobile = useMediaQuery('(max-width: 640px)')


    return (
        <Card elevation={1} sx={{ width: isMobile ? 170 : 200, height: 170, borderRadius: 2, m: "2px" }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: "100%" }}>
                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, fontFamily: 'Roboto, sans-serif' }}>
                        {formattedDate}
                    </Typography>
                    {eventName ? (
                        <Typography variant="body2" sx={{ backgroundColor: "#ffb905", borderRadius: 2, p: 1, fontFamily: 'Consolas, monospace' }}>{eventName}</Typography>
                    ) : (
                        <Typography variant="caption" color="text.secondary" sx={{fontFamily: 'Consolas, monospace'}}>
                            No event planned
                        </Typography>
                    )}
                </Box>
                <Typography variant="caption" sx={{ whiteSpace: "nowrap", mt: "auto", fontFamily: 'Roboto, sans-serif' }}><b>{availableCount}</b> participant.es</Typography>
            </CardContent>
        </Card>
    )
}

export default DayCard
