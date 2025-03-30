
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#2DB7C4',
            light: '#FFB905',
        },
        secondary: {
            main: '#3C3C3B',
            light: '#E9E9E9',
        },
    },

    typography: {
        fontFamily: '"Roboto", sans-serif',
    },
})

export default theme
