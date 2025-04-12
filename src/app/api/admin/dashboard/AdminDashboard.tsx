'use client'

import { useState } from 'react'
import { Box, Button, Stack, Tab, Tabs, useMediaQuery } from '@mui/material'
import UsersAdmin from './tabs/UsersAdmin'
import EventsAdmin from './tabs/EventsAdmin'
import LocationsAdmin from './tabs/LocationsAdmin'
import LogoutButton from '@/components/Login/LogoutButton'


export default function AdminDashboard() {
    const [tab, setTab] = useState(0)
    const isMobile = useMediaQuery('(max-width: 640px)')

    return (
        <Box sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Stack direction={"row"} gap={1} sx={{ width: '100%', justifyContent: isMobile ? 'center' : 'flex-end' }}>
                <Button href="/">
                    Quitter le dashboard
                </Button>
                <LogoutButton />
            </Stack>
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
                <Tab label="Users" />
                <Tab label="Events" />
                <Tab label="Locations" />
            </Tabs>

            {tab === 0 && <UsersAdmin />}
            {tab === 1 && <EventsAdmin />}
            {tab === 2 && <LocationsAdmin />}
        </Box>
    )
}
