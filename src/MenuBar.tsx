import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {IconButton} from "@mui/material";
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CoffeeIcon from '@mui/icons-material/Coffee';
import MailIcon from '@mui/icons-material/Mail';

function MenuBar() {
    const handleContactClick = () => window.location.href = "mailto:admin@cta4j.app";

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
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
                    <IconButton color="inherit" href="/holiday-train">
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            🎅🏻
                        </Typography>
                    </IconButton>
                    <IconButton color="inherit" href="https://buymeacoffee.com/cta4j" target="_blank">
                        <CoffeeIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleContactClick}>
                        <MailIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;
