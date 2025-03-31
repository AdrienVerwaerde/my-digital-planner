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

const accordionStyle = {
    backgroundColor: "#FFB905",
    borderRadius: "8px !important",
    boxShadow: "none",
    color: "secondary.main",
    width: "100%",
}


export const EventAccordion = ({ event, onToggle }: EventAccordionProps) => {
    const [isParticipating, setIsParticipating] = useState(false)

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsParticipating(event.target.checked)
    }

    return (
        <Accordion sx={accordionStyle}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                                sx={{
                                    color: "secondary.main",
                                    py: 0,
                                    px: 0.5,
                                    '&.Mui-checked': {
                                        color: "secondary.main",
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
