// components/UserDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Typography, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"

type User = {
    id: string
    name: string
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
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('STUDENT')

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
        onSubmit({ name, email, role })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <Typography variant="h6" sx={{ fontFamily: 'Consolas, monospace', p: 2 }}>{user ? "Modifier l'utilisateur" : "Créer un utilisateur"}</Typography>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 300 }}>
                <TextField
                    label="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    <Button sx={{ width: "100%"}} disabled><CircularProgress size={24} sx={{ color: "white" }} /></Button>
                </DialogActions>
                ) : (
                <DialogActions> 
                    <Button sx={{ width: "100%" }} onClick={onClose}>Annuler</Button>
                    <Button sx={{ width: "100%" }} onClick={handleSubmit}>
                        {user ? "Mettre à jour" : "Créer"}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}
