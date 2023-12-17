import '../App.css';
import Box from "@mui/material/Box";
import HolidayBus from "./HolidayBus.tsx";

function HolidayApp() {
    return (
        <div>
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Bus &#127877;&#128652;</h2>
            </Box>
            <HolidayBus />
        </div>
    );
}

export default HolidayApp;
