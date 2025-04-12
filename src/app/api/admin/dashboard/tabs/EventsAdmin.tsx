'use client'

import { useEffect, useState } from 'react'
import {
  Box, Button, Table, TableHead, TableRow, TableCell,
  TableBody, Typography, CircularProgress, IconButton, Snackbar, Alert
} from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import EventForm from '../../Forms/EventForm'


type Event = {
  id: string
  activity: string
  type: string
  locations: { id: string, name: string }[]
  proposable: boolean
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const openEventDialog = () => {
    setEditingEvent(null)
    setDialogOpen(true)
  }

  const handleDialogSubmit = async (data: {
    activity: string
    locationIds: string[]
  }) => {
    try {
      let res
      if (editingEvent) {
        res = await fetch(`/api/admin/events/${editingEvent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        res = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")
      const savedEvent = await res.json()
      setEvents(events =>
        editingEvent
          ? events.map(e => e.id === savedEvent.id ? savedEvent : e)
          : [...events, savedEvent]
      )

      setDialogOpen(false)
      setSnackbarMessage(editingEvent ? "Événement modifié" : "Événement créé")
      setSnackbarOpen(true)
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la sauvegarde")
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")
    if (!confirmed) return

    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    setEvents(events => events.filter(e => e.id !== id))
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/admin/events')
        const data = await res.json()
        setEvents(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (isLoading) return <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 1 }}>
    <CircularProgress size={16} />
    <Typography>Chargement...</Typography>
  </Box>

  if (error) return <Typography>Erreur : {error}</Typography>

  return (
    <>
      <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <IconButton title="Ajouter un événement" onClick={openEventDialog} sx={{ backgroundColor: "primary.main", ml: 1, '&:hover': { backgroundColor: "primary.light" } }}>
          <Add fontSize="medium" sx={{ color: "white" }} />
        </IconButton>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activité</TableCell>
              <TableCell>Lieu(x)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map(event => (
              <TableRow key={event.id}>
                <TableCell>{event.activity}</TableCell>
                <TableCell>
                  {event.locations?.map(loc => (
                    <div key={loc.id}>{loc.name}</div>
                  ))}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton title="Éditer" onClick={() => handleEdit(event)} sx={{ backgroundColor: "secondary.main", '&:hover': { backgroundColor: "primary.main" } }}>
                      <Edit fontSize='small' sx={{ color: "white" }} />
                    </IconButton>
                    <IconButton title="Supprimer" onClick={() => handleDelete(event.id)} sx={{ backgroundColor: "error.main", '&:hover': { backgroundColor: "error.dark" } }}>
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
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>

      <EventForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        event={editingEvent}
      />
    </>
  )
}
