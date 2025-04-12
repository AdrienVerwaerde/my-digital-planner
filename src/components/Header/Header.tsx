'use client'

import { Box, Divider, Stack, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import GreetMessage from './GreetMessage'
import LogoutButton from '../Login/LogoutButton'
import { useSession } from 'next-auth/react'
import AdminButton from '../AdminButton/AdminButton'

export const Header = () => {
    const isMobile = useMediaQuery('(max-width: 640px)')
    const isSmallScreen = useMediaQuery('(max-width: 1080px)')
    const { data: session } = useSession()

    return (
        <Box sx={{ width: isMobile ? "inherit" : "100%", px: isMobile ? "0" : "2rem" }}>
            {session &&
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'space-between' : 'flex-end', width: '100%', px: '1rem', my: '1rem', gap: isMobile ? '0' : '2rem' }}>
                    <GreetMessage />
                    <Stack direction="row" gap={1}>
                        {session.user.role === 'ADMIN' && <AdminButton />}
                        <LogoutButton />
                    </Stack>
                </Box>
            }
            {isMobile &&
                <Divider sx={{ backgroundColor: 'white', borderColor: 'white', opacity: 0.5 }} />}
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: '1rem' }}>
                <img src='/images/LOGO_MDS_WHITEBG.png' width={isMobile ? 100 : 350} />
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        mt: isMobile ? '0rem' : '2rem',
                        color: 'white',
                        textTransform: 'uppercase',
                        fontFamily: 'Solano, sans-serif',
                        fontWeight: 600,
                        fontSize: isMobile ? '1.7rem' : '3rem',
                    }}
                >
                    Planning des Événements
                </Typography>
            </Box>
        </Box>
    )
}
