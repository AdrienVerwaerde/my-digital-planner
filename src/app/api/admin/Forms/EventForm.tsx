'use client'

import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Select,
    OutlinedInput,
    Chip,
    SelectChangeEvent,
    CircularProgress,
} from "@mui/material"
import { useEffect, useState } from "react"
import dayjs from "dayjs"

type Event = {
    id: string
    activity: string
    date: string
    locations: { id: string; name: string }[]
}

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (data: { activity: string; date: string; locationIds: string[] }) => void
    event?: Event | null
}

export default function EventForm({ open, onClose, onSubmit, event }: Props) {
    const [activity, setActivity] = useState('')
    const [dateOnly, setDateOnly] = useState('')
    const [timeOnly, setTimeOnly] = useState('')
    const [locationIds, setLocationIds] = useState<string[]>([])
    const [locations, setLocations] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetch('/api/locations')
            .then(res => res.json())
            .then(setLocations)
    }, [])

    useEffect(() => {
        if (event) {
            const date = dayjs(event.date)
            setActivity(event.activity)
            setDateOnly(date.format('YYYY-MM-DD'))
            setTimeOnly(date.format('HH:mm'))
            setLocationIds(event.locations?.map(loc => loc.id) || [])
        } else {
            setActivity('')
            setDateOnly('')
            setTimeOnly('')
            setLocationIds([])
        }
    }, [event, open])

    const handleSubmit = async () => {
        if (!activity || !dateOnly || !timeOnly || locationIds.length === 0) {
            return alert("Tous les champs sont requis.")
        }

        setIsLoading(true)
        const isoDate = dayjs(`${dateOnly}T${timeOnly}`).toISOString()

        try {
            await onSubmit({ activity, date: isoDate, locationIds })
        } catch (err) {
            console.error("Error during form submission", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <Typography variant="h6" sx={{ fontFamily: 'Consolas, monospace', p: 2 }}>
                {event ? "Modifier l'événement" : "Créer un événement"}
            </Typography>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
                <TextField
                    label="Activité"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                />
                <Typography>Date</Typography>
                <TextField
                    type="date"
                    value={dateOnly}
                    onChange={(e) => setDateOnly(e.target.value)}
                />
                <Typography>Heure</Typography>
                <TextField
                    type="time"
                    value={timeOnly}
                    onChange={(e) => setTimeOnly(e.target.value)}
                />
                <Select
                    multiple
                    value={locationIds}
                    onChange={(e: SelectChangeEvent<string[]>) =>
                        setLocationIds(typeof e.target.value === 'string'
                            ? e.target.value.split(',')
                            : e.target.value)
                    }
                    input={<OutlinedInput label="Lieux" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((id) => {
                                const loc = locations.find(l => l.id === id)
                                return <Chip key={id} label={loc?.name || id} />
                            })}
                        </Box>
                    )}
                    fullWidth
                >
                    {locations.map((loc) => (
                        <MenuItem key={loc.id} value={loc.id}>
                            {loc.name}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            {isLoading ? (
                <DialogActions>
                    <Button sx={{ width: "100%" }} disabled><CircularProgress size={24} sx={{ color: "white" }} /></Button>
                </DialogActions>
            ) : (
                <DialogActions>
                    <Button sx={{ width: "100%" }} onClick={onClose}>Annuler</Button>
                    <Button sx={{ width: "100%" }} onClick={handleSubmit}>
                        {event ? "Mettre à jour" : "Créer"}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}
