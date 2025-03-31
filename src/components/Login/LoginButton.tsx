"use client";

import { Button } from "@mui/material";
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
            onClick={() => handleLogin()}
            disabled={isLoading}
        >
            {isLoading ? "En cours..." : "Connecte-toi"}
        </Button>
    );
}

export default LoginButton;