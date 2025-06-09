'use client'

import { useEffect, useState } from 'react'
import {
    Box, Table, TableHead, TableRow, TableCell,
    TableBody, Typography, CircularProgress, IconButton, useMediaQuery
} from '@mui/material'
import { Delete } from '@mui/icons-material'


type Suggestion = {
    id: string
    name: string
    location: string
    hour: string
    message: string
    userName: string
    userSurname: string
}

export default function SuggestionsAdmin() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const isMobile = useMediaQuery('(max-width: 640px)')

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette suggestion ?")
        if (!confirmed) return

        await fetch(`/api/admin/event-suggestions/${id}`, { method: 'DELETE' })
        setSuggestions(suggestions => suggestions.filter(e => e.id !== id))
    }

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await fetch('/api/admin/event-suggestions')
                const data = await res.json()
                setSuggestions(data)
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
                setError(errorMessage)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSuggestions()
    }, [])

    if (isLoading) return <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={16} />
        <Typography>Chargement...</Typography>
    </Box>

    if (error) return <Typography>Erreur : {error}</Typography>

    return (
        <>
            <Box sx={{ width: isMobile ? '100%' : '60%', overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Activité</strong></TableCell>
                            <TableCell><strong>Lieu</strong></TableCell>
                            <TableCell><strong>Heure</strong></TableCell>
                            <TableCell><strong>Message</strong></TableCell>
                            <TableCell><strong>Proposé par</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suggestions.map(s => (
                            <TableRow key={s.id}>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>{s.location}</TableCell>
                                <TableCell>{new Date(s.hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                <TableCell>{s.message}</TableCell>
                                <TableCell>{s.userSurname} {s.userName}</TableCell>
                                <TableCell>
                                    <IconButton
                                        title="Supprimer"
                                        onClick={() => handleDelete(s.id)}
                                        sx={{ backgroundColor: "error.main", '&:hover': { backgroundColor: "error.dark" } }}
                                    >
                                        <Delete fontSize="small" sx={{ color: "white" }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </Box>
        </>
    )
}
