import TableViewIcon from '@mui/icons-material/TableView';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CasinoIcon from '@mui/icons-material/Casino';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MusicNoteIcon from '@mui/icons-material/MusicNote';


export const activityTypes = (type: string) => {
    switch (type) {
        case "AUTRE":
            return <TableViewIcon />
        case "GAMING":
            return <SportsEsportsIcon />
        case "JEUX_DE_SOCIETE":
            return <CasinoIcon />
        case "BAR_CLUB":
            return <LocalBarIcon />
        case "SPORT":
            return <SportsBasketballIcon />
        case "CODE_WEB_TECH":
            return <KeyboardIcon />
        case "ART":
            return <ColorLensIcon />
        case "CULTURE":
            return <MenuBookIcon />
        case "SCOLAIRE":
            return <SchoolIcon />
        case "MUSIQUE":
            return <MusicNoteIcon />
    }
}