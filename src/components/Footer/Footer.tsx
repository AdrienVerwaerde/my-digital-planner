import { Box, IconButton, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useFooterVisible } from '../hooks/useFooterVisible.'

export const Footer = () => {
    const isFooterVisible = useFooterVisible()

    return (
        <Box
            component="footer"
            id="app-footer"
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100vw',
                backgroundColor: '#fff',
                mt: 2,
                p: '4px 16px',
            }}
        >
            <Stack direction="row" gap={1}>
                <Typography
                    variant="body2"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        ml: 1,
                        fontSize: '0.8rem',
                        fontFamily: 'Consolas, monospace',
                    }}
                >
                    Made with 🤍 by
                </Typography>
                <Link href="https://adrienverwaerde.github.io/Portfolio/">
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '0.8rem',
                            fontFamily: 'Consolas, monospace',
                            color: '#FFB905',
                            fontWeight: 'bold',
                        }}
                    >
                        Adrien Verwaerde
                    </Typography>
                </Link>
            </Stack>

            {isFooterVisible && (
                <IconButton
                    disableFocusRipple
                    disableRipple
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    sx={{
                        color: 'secondary.main',
                        pr: 0  
                        
                    }}
                >
                    <KeyboardArrowUpIcon />
                </IconButton>
            )}
        </Box>
    )
}
