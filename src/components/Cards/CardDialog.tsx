import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import { Box, CircularProgress, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import { Add } from '@mui/icons-material';

type CardDialogProps = {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
    eventTypes: string[];
}

type EventCreateDialogProps = {
    open: boolean;
    onClose: () => void;
    selectedValue: string;
    selectedDate: string;
    refreshEvents: () => Promise<void>;
}

function EventCreateDialog({ open, onClose, selectedValue, selectedDate, refreshEvents }: EventCreateDialogProps) {
    const [selectedTime, setSelectedTime] = React.useState<dayjs.Dayjs | null>(null);
    const [formError, setFormError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [locationId, setLocationId] = React.useState('');
    const [locations, setLocations] = React.useState<{ id: string, address: string, name: string }[]>([]);
    const handleChange = (event: SelectChangeEvent) => {
        setLocationId(event.target.value as string);
    };

    React.useEffect(() => {
        if (open) {
            fetch('/api/locations')
                .then(res => res.json())
                .then(data => setLocations(data))
                .catch(err => console.error("Failed to load locations", err));
        }
    }, [open]);

    const handleSubmit = async () => {
        setIsLoading(true);
        console.log("selectedTime:", selectedTime)
        console.log("locationId:", locationId)

        if (!selectedTime || !locationId) {
            setFormError("Choisis le lieu et l'heure");
            setIsLoading(false);
            return;
        }

        setFormError('');
        try {
            const isoDate = dayjs(`${selectedDate}T${selectedTime.format('HH:mm')}`).toISOString()

            const res = await fetch('/api/user-events', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    activity: selectedValue,
                    date: isoDate,
                    locationId,
                }),
            });
            if (res.ok) {
                await refreshEvents();
                onClose();
            } else {
                console.error("Failed to create event");
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (open) {
            setSelectedTime(null)
            setLocationId('')
            setFormError('')
            fetch('/api/locations')
                .then(res => res.json())
                .then(data => setLocations(data))
                .catch(err => console.error("Failed to load locations", err))
        }
    }, [open])


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle sx={{ fontFamily: 'Consolas, monospace', pb: 0 }}>Où et quand ?</DialogTitle>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: "16px", gap: 2, width: "100%" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Lieu</InputLabel>
                        <Select
                            labelId="location-select-label"
                            id="location-select"
                            value={locationId}
                            label="Lieu"
                            onChange={handleChange}

                        >
                            {locations.map(loc => (
                                <MenuItem key={loc.id} value={loc.id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                    <Typography sx={{ fontFamily: 'Roboto, sans-serif' }}>{loc.name}</Typography>
                                    <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.875rem', opacity: 0.6 }}>{loc.address}</Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TimePicker
                        ampm={false}
                        value={selectedTime}
                        onChange={(value) => setSelectedTime(value)}
                        slotProps={{
                            textField: {
                                placeholder: 'Heure',
                                fullWidth: true,
                                size: 'small',
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        color: 'secondary.main',
                                        pr: 1.5,
                                        py: 1,
                                        '&.Mui-error fieldset': {
                                            borderColor: 'secondary.main',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                    {formError && (
                        <Box sx={{ color: 'error.main', fontSize: '0.875rem', fontFamily: 'Consolas, monospace', textAlign: 'center', fontWeight: 'bold' }}>
                            {formError}
                        </Box>
                    )}
                    <Button
                        sx={{ mt: 'auto', width: '100%' }}
                        onClick={handleSubmit}
                        disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Valider"}
                    </Button>
                </Box>
            </Dialog>
        </LocalizationProvider>
    )
}

function CardDialog({ open, onClose, eventTypes, selectedValue }: CardDialogProps) {
    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={() => onClose('')} open={open}>
            <DialogTitle sx={{ fontFamily: 'Consolas, monospace' }}>Sélectionner une activité</DialogTitle>
            <List sx={{ pt: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {eventTypes.map((type) => (
                    <ListItem disablePadding key={type}>
                        <ListItemButton onClick={() => handleListItemClick(type)}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={type} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleListItemClick('Autre')}>
                        <ListItemAvatar>
                            <Avatar>
                                <AddIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Proposer un nouveau type..." />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

type CardDialogDemoProps = {
    date: string
    refreshEvents: () => Promise<void>
}

export default function CardDialogDemo({ date, refreshEvents }: CardDialogDemoProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');
    const [eventTypes, setEventTypes] = React.useState<string[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [proposedType, setProposedType] = React.useState<string | null>(null)


    const handleClickOpen = async () => {
        const res = await fetch('/api/event-types');
        const data = await res.json();
        setEventTypes(data);
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false)
        if (value) {
            setProposedType(value)
            setIsCreateDialogOpen(true)
        }
    }

    return (
        <Box>
            <Stack direction="row" alignItems="center" gap={1} sx={{my: 2}}>
                <IconButton title="Proposer une activité" sx={{ backgroundColor: "secondary.main", color: "white", '&:hover': { backgroundColor: 'primary.main' } }} onClick={handleClickOpen}>
                    <AddIcon fontSize='medium' />
                </IconButton>
                <Typography sx={{fontFamily: "Roboto, sans-serif"}}>
                    Proposer une sortie
                </Typography>
            </Stack>
            <CardDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                eventTypes={eventTypes}
            />
            <EventCreateDialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                selectedValue={proposedType ?? ''}
                selectedDate={date}
                refreshEvents={refreshEvents}
            />
        </Box>
    );
}