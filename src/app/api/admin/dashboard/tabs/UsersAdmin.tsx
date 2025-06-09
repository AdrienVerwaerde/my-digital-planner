'use client'

import { useEffect, useState } from 'react'
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress, IconButton, useMediaQuery } from '@mui/material'
import { Snackbar, Alert } from '@mui/material'
import UserForm from '../../Forms/UserForm'
import { Add, Delete, Edit } from '@mui/icons-material'

type User = {
    id: string
    name: string
    email: string
    role: string
}

export default function UsersAdmin() {
    const [users, setUsers] = useState<User[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isMobile = useMediaQuery('(max-width: 640px)')

    const openUserDialog = () => {
        console.log(dialogMode);
        setEditingUser(null)
        setDialogMode('create')
        setDialogOpen(true)
    }

    const handleDialogSubmit = async (data: Omit<User, 'id'>) => {
        setIsSubmitting(true)
        try {
            let res
            if (editingUser) {
                res = await fetch(`/api/admin/users/${editingUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
            } else {
                res = await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
            }

            if (!res.ok) throw new Error("Erreur lors de la sauvegarde")

            const savedUser = await res.json()
            setUsers(users => {
                if (editingUser) {
                    return users.map(u => u.id === savedUser.id ? savedUser : u)
                } else {
                    return [...users, savedUser]
                }
            })

            setDialogOpen(false)
            setSnackbarMessage(editingUser ? "Utilisateur modifié" : "Utilisateur créé")
            setSnackbarOpen(true)
        } catch (err) {
            console.error(err)
            alert("Erreur lors de la sauvegarde")
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/users')
                if (!res.ok) throw new Error('Erreur serveur')
                const data = await res.json()
                setUsers(data)

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
                setError(errorMessage)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [])


    const handleEdit = (user: User) => {
        setEditingUser(user)
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
        if (!confirmed) return

        await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
        setUsers(users => users.filter(u => u.id !== id))
    }

    if (isLoading) return <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={16} />
        <Typography>Chargement...</Typography>
    </Box>

    if (error) return <Typography>Erreur : {error}</Typography>

    return (
        <>
            <Box sx={{ width: isMobile ? '100%' : '60%', overflowX: 'auto' }}>
                <IconButton title="Ajouter un utilisateur" onClick={openUserDialog} sx={{ backgroundColor: "primary.main", ml: 1, '&:hover': { backgroundColor: "primary.light" } }}><Add fontSize='medium' sx={{ color: "white" }} />
                </IconButton>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Rôle</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            title="Éditer"
                                            sx={{ backgroundColor: "secondary.main", '&:hover': { backgroundColor: "primary.main" } }}
                                            onClick={() => handleEdit(user)}>
                                            <Edit fontSize='small' sx={{ color: "white" }} />
                                        </IconButton>
                                        <IconButton
                                            title="Supprimer"
                                            sx={{ backgroundColor: "error.main", '&:hover': { backgroundColor: "error.dark" } }}
                                            onClick={() => handleDelete(user.id)}>
                                            <Delete fontSize='small' sx={{ color: "white" }} />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
            <UserForm
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleDialogSubmit}
                isLoading={isSubmitting}
                user={editingUser}
            />
        </>
    )
}
