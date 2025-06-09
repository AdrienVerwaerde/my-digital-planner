
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#2DB7C4', // blue
            light: '#FFBD1D', // yellow
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
            variants: [
                {
                    props: { variant: 'contained' },
                    style: {
                        borderRadius: "8px",
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.8rem',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        boxShadow: 'none',
                        backgroundColor: '#3C3C3B',
                        transition: 'all 0.2s ease',
                        "&:hover": {
                            boxShadow: 'none',
                            backgroundColor: '#FFB905',
                            color: '#3C3C3B'
                        }
                    },
                },
            ],
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    fontFamily: 'Roboto, sans-serif',
                    color: 'white',
                    fontWeight: 600,
                    padding: '0.5rem 1rem',
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
