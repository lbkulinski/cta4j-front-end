import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button} from "@mui/material";

function MenuBar() {
    const handleContactClick = () => window.location.href = "mailto:admin@cta4j.app";

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        cta4j
                    </Typography>
                    <Button color="inherit" href="/trains">
                        Trains
                    </Button>
                    <Button color="inherit" href="/buses">
                        Buses
                    </Button>
                    <Button color="inherit" href="/holiday-train">
                        &#127877;&#128647;&#128652;
                    </Button>
                    <Button color="inherit" onClick={handleContactClick}>
                        Contact
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;
