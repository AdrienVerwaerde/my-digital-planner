"use client";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

function LogoutButton() {
    return (
        <Button
            onClick={() => signOut()}
            variant="contained"
            sx={{lineHeight:1, p:1.25}}
        >
            Déconnexion
        </Button>
    );
}

export default LogoutButton;
