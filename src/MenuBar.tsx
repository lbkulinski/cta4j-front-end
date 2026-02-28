import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {IconButton} from "@mui/material";
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CoffeeIcon from '@mui/icons-material/Coffee';
import MailIcon from '@mui/icons-material/Mail';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';

function MenuBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#111111', borderBottom: '1px solid #c60c30' }}>
                <Toolbar variant="dense">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        cta4j
                    </Typography>
                    <IconButton color="inherit" href="/trains">
                        <DirectionsSubwayIcon />
                    </IconButton>
                    <IconButton color="inherit" href="/buses">
                        <DirectionsBusIcon />
                    </IconButton>
                    <IconButton color="inherit" href="https://ctasmokers.com" target="_blank" rel="noopener noreferrer">
                        <SmokeFreeIcon />
                    </IconButton>
                    <IconButton color="inherit" href="https://buymeacoffee.com/cta4j" target="_blank" rel="noopener noreferrer">
                        <CoffeeIcon />
                    </IconButton>
                    <IconButton color="inherit" href="mailto:admin@cta4j.app">
                        <MailIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;
