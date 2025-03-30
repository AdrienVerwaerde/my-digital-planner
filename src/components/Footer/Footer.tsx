import { Box, IconButton } from '@mui/material'
import Link from 'next/link'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const Footer = () => {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100vw",
            backgroundColor: "#fff",
            mt: 2,
            p: "4px 16px"
        }}>
            <Link href={"https://www.mydigitalschool.com/"}><img src="/images/LOGO_MDS.png" width={100} /></Link>
                <IconButton onClick={() => window.scrollTo(0, 0)}><KeyboardArrowUpIcon /></IconButton>
        </Box>
    )
}
