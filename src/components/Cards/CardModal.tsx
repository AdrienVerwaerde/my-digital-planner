
import { Box, Button, Card, CardContent, List, ListItem, Modal, Typography, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs';
import { use, useState } from 'react';
import { EventAccordion } from '../Events/EventAccordion';

interface CardModalProps {
    isModalOpen: boolean;
    handleCloseModal: (value: boolean) => void;
    date: string
    events: {
        id: string
        name: string
        location: string
        time: string
        availableCount: number
        isUserParticipating: boolean
    }[];
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

const CardModal = ({ isModalOpen, handleCloseModal, date, events }: CardModalProps) => {
    const isMobile = useMediaQuery('(max-width: 640px)')
    const handleClose = () => {
        handleCloseModal(false);
    };
    const formattedDate = dayjs(date)
        .format('dddd DD/MM')
        .replace(/^\w/, (c) => c.toUpperCase())
    const [responses, setResponses] = useState<{ [eventId: string]: boolean }>({})

    const handleToggleParticipation = (eventId: string, isParticipating: boolean) => {
        setResponses(prev => ({ ...prev, [eventId]: isParticipating }))
    }

    const handleSubmit = async () => {
        // call your API here with event IDs where isParticipating is true
        const participatingEvents = Object.entries(responses)
            .filter(([_, isIn]) => isIn)
            .map(([eventId]) => eventId)

        // Example:
        await fetch('/api/participate', {
            method: 'POST',
            body: JSON.stringify({ participatingEvents }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        handleCloseModal(false)
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
                        <List sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <ListItem key={event.id} sx={{width: '100%', p: 0}}>
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
                    </Box>
                    <Button sx={{ mt: 'auto' }} onClick={handleSubmit}>
                        Valider
                    </Button>
                </CardContent>
            </Card>
        </Modal>
    )
}

export default CardModal
