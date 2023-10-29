import '../App.css';
import HolidayTrain from "./HolidayTrain.tsx";
import Box from "@mui/material/Box";

function HolidayTrainApp() {
    return (
        <div>
            <Box sx={{p: 2}}>
                <h2 style={{color: "#B3000C"}}>Holiday Train &#127877;&#128647;</h2>
            </Box>
            <HolidayTrain />
        </div>
    );
}

export default HolidayTrainApp;
