import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Link, MenuItem} from "@mui/material";

function MenuBar() {
    const handleContactClick = () => window.location.href = "mailto:admin@cta4j.app";

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        cta4j
                    </Typography>
                    <MenuItem component={Link} href="/trains">
                        TRAINS
                    </MenuItem>
                    <MenuItem component={Link} href="/buses">
                        BUSES
                    </MenuItem>
                    <MenuItem onClick={handleContactClick}>
                        CONTACT
                    </MenuItem>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;
