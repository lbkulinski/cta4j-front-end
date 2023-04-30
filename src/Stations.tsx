import {useQuery} from "@apollo/client";
import React from "react";
import {Autocomplete, TextField} from "@mui/material";
import {gql} from "./__generated__";

interface StationsProps {
    stationId: number | null,
    setStationId: (stationId: number | null) => void
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
    id: number;
    label: string;
}

function Stations(props: StationsProps) {
    const {data} = useQuery(GET_STATIONS);

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
            renderInput={(params) => <TextField {...params} label="Station"/>}
            options={options}
            defaultValue={defaultOption}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, value) => {
                if (!value) {
                    return;
                }

                props.setStationId(value.id);

                const optionString = JSON.stringify(value);

                sessionStorage.setItem("option", optionString);
            }}
        />
    );
}

export default Stations;
