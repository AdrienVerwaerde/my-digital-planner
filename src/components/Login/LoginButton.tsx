"use client";

import { Button, CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";

function LoginButton() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        setIsLoading(true);
        await signIn('microsoft-entra-id', {
            callbackUrl: '/',
        })
        setIsLoading(false);
        console.log("Signed in", signIn);
    };

    return (
        <Button
            variant="contained"
            onClick={() => handleLogin()}
            disabled={isLoading}
            sx={{width:'100%', mt: 1}}
        >
            {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "se connecter"}
        </Button>
    );
}

export default LoginButton;