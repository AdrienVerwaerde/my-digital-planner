// components/UserDialog.tsx
import { Dialog, DialogContent, DialogActions, TextField, Button, MenuItem, Typography, Stack, useMediaQuery, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"

type User = {
    id: string
    name: string
    surname: string
    email: string
    role: string
}

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (data: Omit<User, 'id'>) => void
    user?: User | null
    isLoading?: boolean
}

export default function UserForm({ open, onClose, onSubmit, user, isLoading }: Props) {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('STUDENT')
    const isMobile = useMediaQuery('(max-width: 740px)')

    useEffect(() => {
        if (user) {
            setName(user.name ?? '')
            setEmail(user.email ?? '')
            setRole(user.role ?? 'STUDENT')
        } else {
            setName('')
            setEmail('')
            setRole('STUDENT')
        }
    }, [user, open])

    const handleSubmit = () => {
        onSubmit({ name, surname, email, role })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <Typography variant="h6" sx={{ fontFamily: 'Consolas, monospace', p: 2 }}>{user ? "Modifier l'utilisateur" : "Créer un utilisateur"}</Typography>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 300, width: isMobile ? "100%" : "450px" }}>
                <TextField
                    label="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{}}
                />
                <TextField
                    label="Prénom"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    sx={{}}
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    select
                    label="Rôle"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="STUDENT">STUDENT</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                </TextField>
            </DialogContent>
            {isLoading ? (
                <DialogActions>
                    <Button sx={{ width: "100%" }} disabled><CircularProgress size={24} /></Button>
                </DialogActions>
            ) : (
                <DialogActions>
                    <Stack direction={isMobile ? "column" : "row"} gap={1} sx={{ alignItems: "center", width: "100%" }}>
                        <Button sx={{ width: "100%" }} onClick={onClose}>Annuler</Button>
                        <Button sx={{ width: "100%" }} onClick={handleSubmit}>
                            {user ? "Mettre à jour" : "Créer"}
                        </Button>
                    </Stack>
                </DialogActions>
            )}
        </Dialog>
    )
}
