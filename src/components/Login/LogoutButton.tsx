"use client";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

function LogoutButton() {
    return (
        <Button
            onClick={() => signOut()}
            variant="contained"
        >
            Déconnexion
        </Button>
    );
}

export default LogoutButton;
