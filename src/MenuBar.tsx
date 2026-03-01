import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {IconButton} from "@mui/material";
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import MailIcon from '@mui/icons-material/Mail';

function MenuBar() {
    return (
        <Box>
            <AppBar position="static" sx={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #c60c30' }}>
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
                    <IconButton color="inherit" href="mailto:admin@cta4j.app">
                        <MailIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;
