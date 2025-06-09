'use client'

import { Typography } from "@mui/material"
import { useSession } from "next-auth/react"

export default function GreetMessage() {
    const { data: session } = useSession()

    if (!session?.user?.surname) return null

    return (
        <Typography sx={{ fontFamily: 'Consolas, monospace', color:"white"}}>
            Bonjour, {session.user.surname.split(' ')[0]} 👋
        </Typography>
    )
}
