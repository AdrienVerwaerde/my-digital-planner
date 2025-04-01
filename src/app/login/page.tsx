'use client'

import LoginButton from "@/components/Login/LoginButton";
import { Box, Card, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";


function Login() {
    const isMobile = useMediaQuery('(max-width: 740px)')
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "radial-gradient(circle, #2db8c44c, #2db7c4)",
            backgroundAttachment: "fixed", p: 5
        }}>

            <Card elevation={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", p: isMobile ? "2rem" : "4rem", borderRadius: "8px", maxWidth: isMobile ? "100%" : "500px", maxHeight: isMobile ? "100%" : "600px" }}>
                <Image alt={"logo"} src="/images/LOGO_MDS.png" width={200} height={200} style={{}} />
                <Typography variant="h4" fontFamily={'Solano'} fontWeight={'bold'}>LOGIN</Typography>
                <Typography variant="body1" fontFamily={'Roboto, sans-serif'}>
                    Bienvenue sur <span style={{ fontWeight: "bold", color: '#2DB7C4' }}>MyDigitalPlanner</span>, la plateforme conçue spécialement pour les élèves de MyDigitalSchool ! <br></br><br></br>
                    Connecte-toi avec ton <b>email MyDigitalSchool</b> pour ne rater aucun des événements organisés par ton BDE 🎉
                </Typography>
                <LoginButton />
            </Card>
        </Box>
    );
}

export default Login;
