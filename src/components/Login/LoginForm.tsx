"use client";

import { useState } from "react";
import { Button, CircularProgress, Stack, useMediaQuery, TextField, Typography, Divider } from "@mui/material";
import { signIn } from "next-auth/react";
import GoogleIcon from '@mui/icons-material/Google';

function LoginForm() {
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const isMobile = useMediaQuery("(max-width: 640px)");

    const handleGoogleLogin = async () => {
        setIsLoadingGoogle(true);
        await signIn('google', { callbackUrl: '/' });
        setIsLoadingGoogle(false);
    };

    const handleEmailLogin = async () => {
        setIsLoadingEmail(true);
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false, // stay on page to catch error
        });

        setIsLoadingEmail(false);

        if (result?.error) {
            setError("Email ou mot de passe incorrect.");
        } else {
            window.location.href = '/'; // redirect manually
        }
    };

    return (
        <Stack spacing={2} sx={{ width: isMobile ? '100%' : '300px' }}>

            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Mot de passe"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
                <Typography color="error" align="center" fontSize="0.875rem">
                    {error}
                </Typography>
            )}
            <Button
                onClick={handleEmailLogin}
                disabled={isLoadingEmail}
                sx={{ p: 1 }}
            >
                {isLoadingEmail ? (
                    <CircularProgress size={24} />
                ) : (
                    "Connexion par email"
                )}
            </Button>
            <Divider />
            <Button
                onClick={handleGoogleLogin}
                disabled={isLoadingGoogle}
                sx={{ p: 1 }}
            >
                {isLoadingGoogle ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                    <Stack direction="row" gap={1} alignItems="center">
                        <GoogleIcon /> Connexion avec Google
                    </Stack>
                )}
            </Button>
        </Stack>
    );
}

export default LoginForm;
