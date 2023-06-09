import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

function MenuBar() {
    const handleContactClick = () => window.location.href = "mailto:admin@cta4j.app";

    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        cta4j
                    </Typography>
                    <Button onClick={() => navigate("/trains")}>
                        Trains
                    </Button>
                    <Button onClick={() => navigate("/buses")}>
                        Buses
                    </Button>
                    <Button onClick={handleContactClick}>
                        Contact
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;
