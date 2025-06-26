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
    FormControlLabel,
    Checkbox,
    useMediaQuery,
    Stack,
    CircularProgress,
} from "@mui/material"
import { useEffect, useState } from "react"

type Event = {
    id: string
    activity: string
    locations: { id: string; name: string }[]
    type: string
    proposable: boolean
}

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (data: { activity: string; locationIds: string[], type: string, proposable: boolean }) => void
    event?: Event | null
}

export default function EventForm({ open, onClose, onSubmit, event }: Props) {
    const [activity, setActivity] = useState('')
    const [locationIds, setLocationIds] = useState<string[]>([])
    const [locations, setLocations] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [type, setType] = useState('');
    const [proposable, setProposable] = useState(true)
    const isMobile = useMediaQuery('(max-width: 740px)')

    useEffect(() => {
        fetch('/api/locations')
            .then(res => res.json())
            .then(setLocations)
    }, [])

    useEffect(() => {
        if (event) {
            setActivity(event.activity)
            setLocationIds(event.locations?.map(loc => loc.id) || [])
        } else {
            setActivity('')
            setLocationIds([])
        }
    }, [event, open])

    const handleSubmit = async () => {
        if (!activity || locationIds.length === 0) {
            return alert("Tous les champs sont requis.")
        }

        setIsLoading(true)

        try {
            await onSubmit({ activity, locationIds, type, proposable })
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
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, width: isMobile ? "100%" : "450px" }}>
                <TextField
                    label="Activité"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                />
                <TextField
                    select
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="AUTRE">Autre</MenuItem>
                    <MenuItem value="GAMING">Gaming</MenuItem>
                    <MenuItem value="JEUX_DE_SOCIETE">Jeux de Société</MenuItem>
                    <MenuItem value="BAR_CLUB">Bar/Club/Resto</MenuItem>
                    <MenuItem value="SPORT">Sport</MenuItem>
                    <MenuItem value="CODE_WEB_TECH">Code/Web/Tech</MenuItem>
                    <MenuItem value="ART">Art</MenuItem>
                    <MenuItem value="CULTURE">Culture</MenuItem>
                    <MenuItem value="SCOLAIRE">Scolaire</MenuItem>
                    <MenuItem value="MUSIQUE">Musique</MenuItem>
                </TextField>
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={proposable}
                            disableRipple
                            onChange={(e) => setProposable(e.target.checked)}
                        />
                    }
                    label="Proposable par les utilisateurs ?"
                />
            </DialogContent>
            {isLoading ? (
                <DialogActions>
                    <Button sx={{ width: "100%" }} disabled><CircularProgress size={24} /></Button>
                </DialogActions>
            ) : (
                <DialogActions>
                    <Stack direction={isMobile ? "column" : "row"} gap={1} sx={{alignItems: "center", width: "100%"}}>
                        <Button sx={{ width: "100%" }} onClick={onClose}>Annuler</Button>
                        <Button sx={{ width: "100%" }} onClick={handleSubmit}>
                            {event ? "Mettre à jour" : "Créer"}
                        </Button>
                    </Stack>
                </DialogActions>
            )}
        </Dialog>
    )
}
