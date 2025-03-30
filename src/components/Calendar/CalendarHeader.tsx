import { Box, IconButton, Typography } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/fr';

type CalendarHeaderProps = {
    currentMonth: Dayjs
    onMonthChange: (direction: 'prev' | 'next') => void
    minMonth: Dayjs
    maxMonth: Dayjs
}

dayjs.locale('fr');



const CalendarHeader = ({ currentMonth, onMonthChange, minMonth,
    maxMonth, }: CalendarHeaderProps) => {
    const monthLabel = currentMonth.format('MMM YYYY')
    const isPrevDisabled = currentMonth.isSame(minMonth, 'month')
    const isNextDisabled = currentMonth.isSame(maxMonth, 'month')

    return (
        <>
            < Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 1,
                    gap: 1,
                }
                }
            >
                <IconButton disabled={isPrevDisabled} onClick={() => onMonthChange('prev')}>
                    {isPrevDisabled ? (<KeyboardArrowLeftIcon sx={{ color: "#ffffff66" }} />) : (<KeyboardArrowLeftIcon sx={{ color: "white" }} />)}
                </IconButton>

                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', textAlign: "center", textTransform: "uppercase", width: "115px", fontFamily: 'Roboto, sans-serif' }}>
                    {monthLabel}
                </Typography>

                <IconButton disabled={isNextDisabled} onClick={() => onMonthChange('next')}>
                    {isNextDisabled ? (<KeyboardArrowRightIcon sx={{ color: "#ffffff66" }} />) : (<KeyboardArrowRightIcon sx={{ color: "white" }} />)}
                </IconButton>
            </Box >
        </>
    )
}

export default CalendarHeader