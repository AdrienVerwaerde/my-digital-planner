'use client'

import { useEffect, useState } from 'react'
import {
  Box, CircularProgress, IconButton, Snackbar, Alert,
  Table, TableBody, TableCell, TableHead, TableRow, Typography,
  useMediaQuery
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import LocationForm from '../../Forms/LocationForm'

type Location = {
  id: string
  name: string
  address: string
  link: string
}

export default function LocationsAdmin() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const isMobile = useMediaQuery('(max-width: 640px)')

  const fetchLocations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/locations')
      const data = await res.json()
      setLocations(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const handleDialogSubmit = async (data: Omit<Location, 'id'>) => {
    setIsSubmitting(true)
    try {
      let res
      if (editingLocation) {
        res = await fetch(`/api/admin/locations/${editingLocation.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        res = await fetch('/api/admin/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")

      await fetchLocations()
      setSnackbarMessage(editingLocation ? "Lieu modifié" : "Lieu créé")
      setSnackbarOpen(true)
      setDialogOpen(false)
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Supprimer ce lieu ?")
    if (!confirmed) return

    await fetch(`/api/admin/locations/${id}`, { method: 'DELETE' })
    setLocations(locations => locations.filter(loc => loc.id !== id))
  }

  const openCreateDialog = () => {
    setEditingLocation(null)
    setDialogOpen(true)
  }

  if (loading) return (
    <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={16} />
      <Typography>Chargement...</Typography>
    </Box>
  )

  if (error) return <Typography>Erreur : {error}</Typography>

  return (
    <>
      <Box sx={{ width: isMobile ? '100%' : '60%', overflowX: 'auto' }}>
        <IconButton title="Ajouter un lieu" onClick={openCreateDialog} sx={{
          backgroundColor: "primary.main",
          ml: 1,
          '&:hover': { backgroundColor: "primary.light" }
        }}>
          <Add fontSize="medium" sx={{ color: "white" }} />
        </IconButton>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map(loc => (
              <TableRow key={loc.id}>
                <TableCell>{loc.name}</TableCell>
                <TableCell><a href={loc.link} target="_blank" style={{ color: '#2DB7C4' }}>{loc.address}</a></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton title="Éditer" sx={{ backgroundColor: "secondary.main", '&:hover': { backgroundColor: "primary.main" } }} onClick={() => handleEdit(loc)}>
                      <Edit fontSize='small' sx={{ color: "white" }} />
                    </IconButton>
                    <IconButton title="Supprimer" sx={{ backgroundColor: "error.main", '&:hover': { backgroundColor: "error.dark" } }} onClick={() => handleDelete(loc.id)}>
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

      <LocationForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        location={editingLocation}
        isLoading={isSubmitting}
      />
    </>
  )
}
