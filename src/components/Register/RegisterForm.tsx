"use client";

import { useState } from "react";
import { TextField, Button, Stack, CircularProgress, Typography, useMediaQuery, Divider } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { signIn } from "next-auth/react";

export default function RegisterForm() {
    const isMobile = useMediaQuery("(max-width: 740px)");
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isSecurePassword = (pw: string) =>
        /^(?=.*[A-Z])(?=.*[\W\d]).{8,}$/.test(pw);

    const handleGoogleRegister = async () => {
        setLoading(true);
        await signIn("google", {
            callbackUrl: "/",
        });
        setLoading(false);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage(null);

        if (!isSecurePassword(password)) {
            setMessage("Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 spécial/chiffre.");
            setIsLoading(false);
            return;
        }

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name, surname }),
        });

        const data = await res.json();

        if (res.ok) {
            await signIn("credentials", {
                redirect: true,
                email,
                password,
                callbackUrl: "/",
            });
            } else {
                setMessage(data.error || "Erreur lors de la création du compte.");
        }

        setIsLoading(false);
    };

    return (
        <Stack spacing={2} sx={{ width: isMobile ? '100%' : '300px' }}>
            <TextField label="Nom" value={name} onChange={e => setName(e.target.value)} />
            <TextField label="Prénom" value={surname} onChange={e => setSurname(e.target.value)} />
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <TextField label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            {message && (
                <Typography textAlign="center" color={message.includes("succès") ? "#2DB7C4" : "error"}>
                    {message}
                </Typography>
            )}
            <Button
                onClick={handleSubmit}
                disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : "Créer un compte"}
            </Button>
            <Divider />
            <Button
                onClick={handleGoogleRegister}
                disabled={loading}
                startIcon={<GoogleIcon />}
            >
                {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                    "S'inscrire avec Google"
                )}
            </Button>
        </Stack>
    );
}
