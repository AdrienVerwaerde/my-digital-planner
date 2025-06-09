import { Dialog, DialogContent, DialogActions, TextField, Button, Typography, Stack, useMediaQuery } from "@mui/material"
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
    const isMobile = useMediaQuery('(max-width: 740px)')

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
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 300, width: isMobile ? "100%" : "450px" }}>
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
                    <Button sx={{ width: "100%" }} disabled>En cours...</Button>
                </DialogActions>
            ) : (
                <DialogActions>
                    <Stack direction={isMobile ? "column" : "row"} gap={1} sx={{alignItems: "center", width: "100%"}}>
                        <Button sx={{ width: "100%" }} onClick={onClose}>Annuler</Button>
                        <Button sx={{ width: "100%" }} onClick={handleSubmit}>
                            {location ? "Mettre à jour" : "Créer"}
                        </Button>
                    </Stack>
                </DialogActions>
            )}
        </Dialog>
    )
}
