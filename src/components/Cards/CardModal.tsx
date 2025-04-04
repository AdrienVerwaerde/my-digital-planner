
import { Box, Button, Card, CardContent, CircularProgress, IconButton, List, ListItem, Modal, Stack, Typography, useMediaQuery } from '@mui/material'
import { useState } from 'react';
import { EventAccordion } from '../Events/EventAccordion';
import { useFormattedDate } from '@/app/hooks/useFormattedDate';
import { Close } from '@mui/icons-material';
import CardDialogDemo from './CardDialog';

interface CardModalProps {
    isModalOpen: boolean;
    handleCloseModal: (value: boolean) => void;
    date: string;
    events: {
        id: string;
        name: string;
        locations: { id: string; name: string }[];
        time: string;
        availableCount: number;
        isUserParticipating: boolean;
    }[]
    refreshEvents: () => Promise<void>;
}


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 2,
    border: "none",
    width: 400,
    height: 600,
    boxShadow: 24,
    p: 1,
};

const mobileModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 2,
    border: "none",
    width: 350,
    height: 500,
    boxShadow: 24,
    p: 1,
};

const CardModal = ({ isModalOpen, handleCloseModal, date, events, refreshEvents }: CardModalProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 640px)')
    const [isAvailable, setIsAvailable] = useState<boolean>(false)



    const handleClose = () => {
        handleCloseModal(false);
    };
    const formattedDate = useFormattedDate(date)
    const [responses, setResponses] = useState<{ [eventId: string]: boolean }>({})

    const handleToggleParticipation = (eventId: string, isParticipating: boolean) => {
        setResponses(prev => ({ ...prev, [eventId]: isParticipating }))
    }

    const handleSubmit = async () => {
        setIsLoading(true)

        try {
            // Update participation
            const submissionPromises = events.map(event => {
                const isParticipating = responses[event.id] ?? event.isUserParticipating
                return fetch('/api/events/participate', {
                    method: 'POST',
                    body: JSON.stringify({ eventId: event.id, isParticipating }),
                    headers: { 'Content-Type': 'application/json' },
                })
            })

            // Handle availability
            if (isAvailable !== undefined) {
                submissionPromises.push(
                    fetch('/api/availability', {
                        method: 'POST',
                        body: JSON.stringify({ date, isAvailable }),
                        headers: { 'Content-Type': 'application/json' },
                    })
                )
            }

            await Promise.all(submissionPromises)
            await refreshEvents()
            handleCloseModal(false)
        } catch (err) {
            console.error("Submission error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}

        >
            <Card sx={isMobile ? mobileModalStyle : modalStyle}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', color: "secondary.main", height: "100%", gap: 1 }}>
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        pr: 1,
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }} >
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, fontFamily: 'Roboto, sans-serif' }}>
                            {formattedDate}
                        </Typography>
                        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 5, right: 5 }}>
                            <Close fontSize="small" />
                        </IconButton>
                        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <ListItem key={event.id} sx={{ width: '100%', p: 0 }}>
                                        <EventAccordion
                                            key={event.id}
                                            event={event}
                                            onToggle={handleToggleParticipation}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontFamily: 'Consolas, monospace' }}
                                >
                                    Aucun événement
                                </Typography>
                            )}
                        </List>
                        {/* <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAvailable}
                                    disableRipple
                                    onChange={(e) => {
                                        setIsAvailable(e.target.checked)
                                    }}
                                    sx={{
                                        color: "secondary.main",
                                        '&.Mui-checked': {
                                            color: isAvailable? "primary.main" : "secondary.main",
                                        },
                                        '& .MuiSvgIcon-root': { fontSize: 24 }
                                    }}
                                />
                            }
                            label="Je suis disponible !"
                            sx={{ mt: 2, color: isAvailable ? "primary.main" : "secondary.main", transition: "all 0.2s ease" }}
                        /> */}
                        <CardDialogDemo
                            date={date}
                            refreshEvents={refreshEvents} />
                    </Box>
                    <Button
                        sx={{ mt: 'auto' }}
                        onClick={handleSubmit}
                        disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Valider"}
                    </Button>
                </CardContent>
            </Card>
        </Modal>
    )
}

export default CardModal
