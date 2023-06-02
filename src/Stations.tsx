import {useQuery} from "@apollo/client";
import {Autocomplete, TextField} from "@mui/material";
import {gql} from "./__generated__";

interface StationsProps {
    stationId: string | null,
    setStationId: (stationId: string | null) => void
}

const GET_STATIONS = gql(`
query GetStations {
    getStations {
        id
        name
    }
}
`);

interface Option {
    id: string;
    label: string;
}

function Stations(props: StationsProps) {
    const {loading, error, data} = useQuery(GET_STATIONS);

    if (loading) {
        return null;
    }

    if (error) {
        return (
            <p>
                {
                    "Error: The stations could not be loaded. Please refresh the page or try again later."
                }
            </p>
        );
    }

    if (!data) {
        return null;
    }

    const stations = data.getStations;

    const names = new Set<string>();

    const options = new Array<Option>();

    let defaultOption: Option | null = null;

    stations.forEach(station => {
        const id = station.id;

        const name = station.name;

        if ((id === props.stationId)) {
            defaultOption = {
                id: id,
                label: name
            };
        }

        if (names.has(name)) {
            return;
        }

        names.add(name);

        options.push({
            id: station.id,
            label: name
        });
    });

    options.sort((option0, option1) => option0.label.localeCompare(option1.label));

    return (
        <Autocomplete
            sx={{p: 2, maxWidth: 500}}
            size={"small"}
            renderInput={(params) => <TextField {...params} label="Station"/>}
            options={options}
            value={defaultOption}
            defaultValue={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
                if (!value) {
                    return;
                }

                props.setStationId(value.id);

                localStorage.setItem("stationId", value.id);

                window.history.replaceState(null, "", window.location.pathname);
            }}
        />
    );
}

export default Stations;
