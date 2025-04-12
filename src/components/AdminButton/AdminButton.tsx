import { Button, Typography } from '@mui/material'
import React from 'react'

const AdminButton = () => {
    return (
        <Button
            href="/api/admin/dashboard"
            variant="contained"
            sx={{ lineHeight: 1, p: 1.25 }}
        >
            Admin
        </Button>
    );
}

export default AdminButton