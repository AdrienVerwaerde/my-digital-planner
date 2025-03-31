"use client";

import { Button, CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";

function LoginButton() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        setIsLoading(true);
        await signIn("microsoft-entra-id");
        setIsLoading(false);
        console.log("Signed in", signIn);
    };

    return (
        <Button
            variant="contained"
            onClick={() => handleLogin()}
            disabled={isLoading}
        >
            {isLoading ? <CircularProgress size={24} sx={{color: "white"}}/> : "Connecte-toi"}
        </Button>
    );
}

export default LoginButton;