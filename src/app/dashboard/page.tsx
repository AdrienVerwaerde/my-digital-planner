"use client";

import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";

export default function Dashboard() {
    const session = useSession();
    return (
        <Box>
            <Typography>dashboard page </Typography>
            <Typography>User email: {session.data?.user?.email}</Typography>
        </Box>
    );
}