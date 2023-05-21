//import { useState, useMemo, useCallback, useRef } from "react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import * as LatLngLiteral from "leaflet";
import { Dropdown } from "./Dropdown";
import {
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Circle,
    MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import { addDoc, collection } from "firebase/firestore";
import { db } from '../pages/firebase';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;


const addNewDocument = async (position: LatLngLiteral
) => {
    try {
        const docRef = await addDoc(collection(db, "susLocation"), {
            lat: position.lat,
            lng: position.lng,
            crimeType: "Theft",
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

function clickMe(position: LatLngLiteral) {
    addNewDocument(position);
    alert('Your response has been submitted!');
}

export default function Map() {
    const [office, setOffice] = useState<LatLngLiteral | undefined>(undefined);
    const [directions, setDirections] = useState<DirectionsResult>();
    const mapRef = useRef<GoogleMap>();
    let [location, setLocation] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
    location = office as LatLngLiteral;

    /*const center = useMemo<LatLngLiteral>(
        () => ({ lat: 43.45, lng: -80.49 }),
        []
    );*/
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lng: longitude });
        });
    }, []);
    const options = useMemo<MapOptions>(
        () => ({
            mapId: "50b6b3b1d1c6cb1b",
            disableDefaultUI: true,
            clickableIcons: false,
        }),
        []
    );
    const onLoad = useCallback((map) => (mapRef.current = map), []);
    const houses = useMemo(() => generateHouses(center), [center]);

    const fetchDirections = (house: LatLngLiteral) => {
        if (!office) return;

        const service = new google.maps.DirectionsService();
        service.route(
            {
                origin: house,
                destination: office,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                }
            }
        );
    };
    const dropdownoptions = [
        { value: "Theft", label: "Theft" },
        { value: "Assault", label: "Assault" },
        { value: "Other", label: "Other" },
    ];
    return (
        <div className="container">
            <div className="controls">
                <h1>Am I Safe?</h1>
                <Places
                    setOffice={(position) => {
                        setOffice(position);
                        mapRef.current?.panTo(position);
                    }}
                />
                {!office && <p>Enter the location of the suspicious activity.</p>}
                {directions && <Distance leg={directions.routes[0].legs[0]} />}
                <Dropdown placeHolder="Select..." dropdownoptions={dropdownoptions} />
                <br></br>
                <br></br>
                <button
                    className="my-button"
                    onClick={() => {
                        clickMe(location);
                    }}>
                    Add a location with suspicious acitivty
                </button>
            </div>

            <div className="map">
                <GoogleMap
                    zoom={10}
                    center={center}
                    mapContainerClassName="map-container"
                    options={options}
                    onLoad={onLoad}
                >
                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                polylineOptions: {
                                    zIndex: 50,
                                    strokeColor: "#1976D2",
                                    strokeWeight: 5,
                                },
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
        </div>
    );
}

const defaultOptions = {
    strokeOpacity: 0.5,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
};
const closeOptions = {
    ...defaultOptions,
    zIndex: 3,
    fillOpacity: 0.05,
    strokeColor: "#8BC34A",
    fillColor: "#8BC34A",
};
const middleOptions = {
    ...defaultOptions,
    zIndex: 2,
    fillOpacity: 0.05,
    strokeColor: "#FBC02D",
    fillColor: "#FBC02D",
};
const farOptions = {
    ...defaultOptions,
    zIndex: 1,
    fillOpacity: 0.05,
    strokeColor: "#FF5252",
    fillColor: "#FF5252",
};

const generateHouses = (position: LatLngLiteral) => {
    const _houses: Array<LatLngLiteral> = [];
    for (let i = 0; i < 100; i++) {
        const direction = Math.random() < 0.5 ? -2 : 2;
        _houses.push({
            lat: position.lat + Math.random() / direction,
            lng: position.lng + Math.random() / direction,
        });
    }
    return _houses;
};
