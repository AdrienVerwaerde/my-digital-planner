import { Box, Typography, useMediaQuery } from '@mui/material'
import React from 'react'

export const Header = () => {
    const isMobile = useMediaQuery('(max-width: 640px)')
    return (
        <Box sx={{display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: 2, mt: '1rem', p: '1rem'}}>
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
    )
}
