import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs'
import { useState } from 'react';

interface EventAccordionProps {
    date: string
    eventName?: string
    availableCount?: number
}

const accordionStyle = {
    backgroundColor: "#FFB905",
    borderRadius: "8px !important",
    boxShadow: "none",
    color: "secondary.main",
}


export const EventAccordion = () => {
    const [isParticipating, setIsParticipating] = useState(false)

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsParticipating(event.target.checked)
    }

    return (
        <>
            <Accordion sx={accordionStyle}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography sx={{ fontFamily: 'Consolas, monospace' }}>Event Name</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ fontFamily: 'Roboto, sans-serif' }}>
                    Lieu
                    Heure
                    <Divider sx={{ my: 1 }} />
                    <Stack direction={"row"} sx={{alignItems: "center"}}>
                        <Typography variant="caption" sx={{ whiteSpace: "nowrap", fontFamily: 'Roboto, sans-serif' }}><b>5</b> participant.es</Typography>
                        <FormControlLabel control={<Checkbox checked={isParticipating} onChange={handleCheckboxChange} sx={{
                            color: "secondary.main",
                            py: 0,
                            px: 0.5,
                            '&.Mui-checked': {
                                color: "secondary.main",
                            },
                            '& .MuiSvgIcon-root': { fontSize: 24 }
                        }} />} labelPlacement="start" label={isParticipating ? 'Je participe !' : 'Participer ?'} sx={{ ml: 'auto' }} />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </>
    )
}
