
import { Box, Button, Card, CardContent, CircularProgress, IconButton, List, ListItem, Modal, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react';
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
        locations: { id: string; name: string, address: string, link: string }[];
        time: string;
        availableCount: number;
        isUserParticipating: boolean;
        createdBy: { id: string; };
    }[]
    refreshEvents: () => Promise<void>;
    onDelete?: (eventId: string) => Promise<void>;
    canDelete?: boolean;
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
    const [isAvailable] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch('/api/me')
                const data = await res.json()
                setCurrentUser(data)
            } catch (err) {
                console.error("Error fetching user", err)
            }
        }

        fetchCurrentUser()
    }, [])

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
                return fetch('/api/user-events/participate', {
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

    const handleDeleteEvent = async (eventId: string) => {
        const confirm = window.confirm("Supprimer cet événement ?")
        if (!confirm) return

        try {
            await fetch(`/api/user-events/${eventId}`, { method: 'DELETE' })
            await refreshEvents()
        } catch (err) {
            console.error("Erreur suppression :", err)
        }
    }

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}

        >
            <Card sx={isMobile ? mobileModalStyle : modalStyle}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: "secondary.main", height: "100%", gap: 1 }}>
                    <Box sx={{
                        flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                    }}>
                        <Box sx={{
                            flex: 1,

                            pr: 1,

                        }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, fontFamily: 'Roboto, sans-serif' }}>
                                {formattedDate}
                            </Typography>
                            <IconButton onClick={handleClose} sx={{ position: "absolute", zIndex: "1000", '&:hover': { backgroundColor: "#F5F5F5" }, top: 5, right: 5 }}>
                                <Close fontSize="small" />
                            </IconButton>

                            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {events.length > 0 ? (
                                    events.map((event) => (
                                        <ListItem key={event.id} sx={{ width: '100%', p: 0 }}>
                                            <EventAccordion
                                                event={event}
                                                onToggle={handleToggleParticipation}
                                                onDelete={handleDeleteEvent}
                                                canDelete={
                                                    !!currentUser && (currentUser.id === event.createdBy?.id || currentUser.role === 'ADMIN')
                                                }
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
                        </Box>

                        <Box sx={{ pt: 1 }}>
                            <CardDialogDemo date={date} refreshEvents={refreshEvents} />
                        </Box>
                    </Box>

                    <Button
                        sx={{ mt: 'auto' }}
                        onClick={handleSubmit}
                        disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : "Valider"}
                    </Button>
                </CardContent>
            </Card>
        </Modal>
    )
}

export default CardModal
