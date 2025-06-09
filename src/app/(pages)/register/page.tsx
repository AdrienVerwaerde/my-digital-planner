/* eslint-disable react/no-unescaped-entities */

"use client";

import { Typography, Box, Card, useMediaQuery } from "@mui/material";
import Image from "next/image";
import RegisterForm from "@/components/Register/RegisterForm";

function Register() {
    const isMobile = useMediaQuery('(max-width: 740px)')


    return (
        <Box sx={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "radial-gradient(circle, #2db8c44c, #2db7c4)",
            backgroundAttachment: "fixed", p: 5
        }}>

            <Card elevation={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", p: isMobile ? "2rem" : "4rem", borderRadius: "8px", maxWidth: isMobile ? "100%" : "500px", maxHeight: isMobile ? "100%" : "750px" }}>
                <Image alt={"logo"} src="/images/LOGO_MDS.png" width={200} height={200} style={{}} />
                <Typography variant="h4" fontFamily={'Solano'} fontWeight={'bold'}>S'ENREGISTRER</Typography>
                <RegisterForm />
            </Card>
        </Box>
    );
}

export default Register;