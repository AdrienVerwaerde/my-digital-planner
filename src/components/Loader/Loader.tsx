import { Box, CircularProgress } from '@mui/material'
import Image from 'next/image'
import React from 'react'

export const Loader = () => {
    return (
        <Box sx={{ height: "100vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 2 }}>
            <Image alt="logo-loader" src="/images/LOGO_MDS_WHITEBG.png" width={150} height={150} style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} />
            <CircularProgress size={200} thickness={0.5} sx={{ color: "white" }} />
        </Box>
    )
}
