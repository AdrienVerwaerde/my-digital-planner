import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Divider, FormControlLabel, IconButton, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { Place } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete'

interface EventAccordionProps {
    event: {
        id: string;
        name: string;
        locations: {
            id: string;
            name: string;
            address: string;
            link: string;
        }[];
        time: string;
        availableCount: number;
        isUserParticipating: boolean;
    };
    onToggle: (eventId: string, isParticipating: boolean) => void;
    onDelete: (eventId: string) => Promise<void>
    canDelete: boolean
}


export const EventAccordion = ({ event, onToggle, onDelete, canDelete }: EventAccordionProps) => {
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
            <AccordionDetails sx={{ pt: 0 }}>
                {event.locations?.map(loc => (
                    <Box key={loc.id}>
                        <Typography
                            sx={{ fontFamily: 'Roboto, sans-serif' }}>
                            {loc.name}
                        </Typography>
                        <Typography 
                        component={"a"}
                        href={loc.link}
                        target="_blank"
                        sx={{
                            fontFamily: 'Roboto, sans-serif', fontSize: '0.875rem', opacity: 0.6, cursor: "pointer",
                            color: "inherit",
                            transition: "all 0.2s ease",
                            '&:hover': {
                                opacity: 1
                            },
                        }}>
                            <Place fontSize='small' />
                            {loc.address}
                        </Typography>
                    </Box>
                ))}
                <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                    <Typography>{event.time}</Typography>
                    {canDelete && (
                        <IconButton
                        title="Supprimer cette sortie"
                            onClick={() => onDelete(event.id)}
                            size="medium"
                            sx={{
                                ml: 1,
                                
                                color: isParticipating ? 'white' : 'secondary.main',
                                
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                </Stack>
                <Divider sx={{ my: 1, backgroundColor: isParticipating ? "white" : "secondary.main", borderColor: isParticipating ? "white" : "secondary.main" }} />
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
