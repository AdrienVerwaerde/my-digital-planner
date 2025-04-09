import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"

type Location = {
    id: string
    name: string
    address: string
    link: string
}

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (data: Omit<Location, 'id'>) => void
    location?: Location | null
    isLoading?: boolean
}

export default function LocationForm({ open, onClose, onSubmit, location, isLoading }: Props) {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [link, setLink] = useState('')

    useEffect(() => {
        if (location) {
            setName(location.name ?? '')
            setAddress(location.address ?? '')
            setLink(location.link ?? '')
        } else {
            setName('')
            setAddress('')
            setLink('')
        }
    }, [location, open])

    const handleSubmit = () => {
        if (!name || !address || !link) {
            alert("Tous les champs sont requis.")
            return
        }

        onSubmit({ name, address, link })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <Typography variant="h6" sx={{ fontFamily: 'Consolas, monospace', p: 2 }}>
                {location ? "Modifier le lieu" : "Créer un lieu"}
            </Typography>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 300 }}>
                <TextField
                    label="Nom du lieu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Adresse"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                    label="Lien Google Maps"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </DialogContent>
            {isLoading ? (
                <DialogActions>
                    <Button sx={{ width: "100%" }} disabled>
                        <CircularProgress size={24} sx={{ color: "white" }} />
                    </Button>
                </DialogActions>
            ) : (
                <DialogActions>
                    <Button sx={{ width: "100%" }} onClick={onClose}>Annuler</Button>
                    <Button sx={{ width: "100%" }} onClick={handleSubmit}>
                        {location ? "Mettre à jour" : "Créer"}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}
