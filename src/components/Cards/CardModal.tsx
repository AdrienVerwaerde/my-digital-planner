
import { Box, Button, Card, CardContent, Modal, Typography, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs';
import { use, useState } from 'react';
import { EventAccordion } from '../Events/EventAccordion';

interface CardModalProps {
    isModalOpen: boolean;
    handleCloseModal: (value: boolean) => void;
    date: string
    eventName?: string
    availableCount?: number
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

const CardModal = ({ isModalOpen, handleCloseModal, date, eventName, availableCount }: CardModalProps) => {
    const isMobile = useMediaQuery('(max-width: 640px)')
    const handleClose = () => {
        handleCloseModal(false);
    };
    const formattedDate = dayjs(date)
        .format('dddd DD/MM')
        .replace(/^\w/, (c) => c.toUpperCase())

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}

        >
            <Card sx={isMobile ? mobileModalStyle : modalStyle}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', color: "secondary.main", height: "100%", gap: 1 }}>
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, fontFamily: 'Roboto, sans-serif' }}>
                            {formattedDate}
                        </Typography>
                        {eventName ? (
                            <EventAccordion />
                        ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Consolas, monospace' }}>
                                Aucun événement
                            </Typography>
                        )}
                    </Box>
                    <Button sx={{ mt: "auto"}}>Je suis dispo !</Button>
                </CardContent>
            </Card>
        </Modal>
    )
}

export default CardModal
