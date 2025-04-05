'use client'

import { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import UsersAdmin from './tabs/UsersAdmin'
import EventsAdmin from './tabs/EventsAdmin'
import LocationsAdmin from './tabs/LocationsAdmin'


export default function AdminDashboard() {
    const [tab, setTab] = useState(0)

    return (
        <Box sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
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
