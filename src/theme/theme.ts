
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#2DB7C4', // blue
            light: '#FFB905', // yellow
        },
        secondary: {
            main: '#3C3C3B', // dark grey
            light: '#E9E9E9', // light grey
        },
    },

    typography: {
        fontFamily: '"Roboto", sans-serif',
    },

    components: {
        MuiButton: {
            variants: [],
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    fontFamily: 'Roboto, sans-serif', 
                    color: 'white', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    boxShadow: 'none',
                    backgroundColor: '#3C3C3B',
                    transition: 'all 0.2s ease',
                    "&:hover": {
                        boxShadow: 'none',
                        backgroundColor: '#2DB7C4',
                    }
                },
            },
        },
    },
})

export default theme
