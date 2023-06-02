import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface MenuBarProps {
    title: string
}

function MenuBar(props: MenuBarProps) {
    const handleBusesClick = () => window.location.href = "https://cta4j.com/buses.html";

    const handleContactClick = () => window.location.href = "mailto:admin@cta4j.app";

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {
                            props.title
                        }
                    </Typography>
                    <Button color="inherit" onClick={handleBusesClick}>
                        Buses
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
