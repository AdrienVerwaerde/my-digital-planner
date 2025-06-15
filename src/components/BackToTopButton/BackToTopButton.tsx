import { Box, IconButton } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useFooterVisible } from '../hooks/useFooterVisible.'


export default function BackToTopButton() {
    const isFooterVisible = useFooterVisible()

    if (isFooterVisible) return null

    return (
        <Box sx={{ position: 'fixed', bottom: '2rem', right: '0.5rem' }}>
            <IconButton
                disableFocusRipple
                disableRipple
                onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                sx={{
                    color: 'secondary.main',
                    backgroundColor: 'primary.light',
                    '&:hover': { backgroundColor: 'primary.light' },
                }}
            >
                <KeyboardArrowUpIcon />
            </IconButton>
        </Box>
    )
}
