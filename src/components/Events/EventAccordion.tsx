import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs'
import { useState } from 'react';

interface EventAccordionProps {
    event: {
        id: string;
        name: string;
        location: string;
        time: string;
        availableCount: number;
        isUserParticipating: boolean;
    };
    onToggle: (eventId: string, isParticipating: boolean) => void;
}


export const EventAccordion = ({ event, onToggle }: EventAccordionProps) => {
    const [isParticipating, setIsParticipating] = useState(event.isUserParticipating)


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        setIsParticipating(checked)
        onToggle(event.id, checked)
    }

    return (
        <Accordion sx={{
            backgroundColor: isParticipating ? 'primary.main' : "primary.light", borderRadius: "8px !important",
            boxShadow: "none",
            color: isParticipating ? "white" : "secondary.main",
            width: "100%",
            transition: "all 0.2s ease",
        }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: isParticipating ? "white" : "secondary.main" }} />}>
                <Typography sx={{ fontFamily: 'Consolas, monospace' }}>{event.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>{event.location}</Typography>
                <Typography>{event.time}</Typography>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">
                        <b>{event.availableCount}</b> participant.es
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                disableRipple
                                sx={{
                                    color: "secondary.main",
                                    py: 0,
                                    px: 0.5,

                                    '&.Mui-checked': {
                                        color: isParticipating ? "white" : "secondary.main",
                                    },
                                    '& .MuiSvgIcon-root': { fontSize: 24 }
                                }}
                                checked={isParticipating}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label={isParticipating ? 'Je participe !' : 'Participer ?'}
                        labelPlacement="start"
                    />
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}
