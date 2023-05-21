//import { useState, useMemo, useCallback, useRef } from "react";
import { useState, useMemo, useCallback, useRef, useEffect, SetStateAction } from "react";
import L, * as LatLngLiteral from "leaflet";
import { Dropdown } from "./Dropdown";
import {
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Circle,
    MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
//import Distance from "./distance";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../pages/firebase';
import { xa } from "./Dropdown";
import { url } from "inspector";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const addNewDocument = async (position: LatLngLiteral, crime: String
) => {
    try {
        const docRef = await addDoc(collection(db, "susLocation"), {
            lat: position.lat,
            lng: position.lng,
            crimeType: crime,
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

function clickMe(position: LatLngLiteral, crimeType: String) {
    addNewDocument(position, crimeType);
    alert('Your response has been submitted!');
}

const locations: Array<LatLngLiteral> = [];

const iconBlue = {
    url: "https://storage.googleapis.com/support-kms-prod/SNP_2752068_en_v0", // url
    //scaledSize: new google.maps.Size(11, 11), // scaled size
};
// const iconYellow = {
//     url: "https://storage.googleapis.com/support-kms-prod/SNP_2752063_en_v0", // url
//     scaledSize: new google.maps.Size(11, 11), // scaled size
// };




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

    //const houses = useMemo(() => generateHouses(center), [center]);

    generatePoints();

    const dropdownoptions = [
        { value: "Theft", label: "Theft" },
        { value: "Assault", label: "Assault" },
        { value: "Violence", label: "Violence" },
        { value: "Other", label: "Other" },
    ];

    var circle = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#E3C565",
        scale: 10.5
    };


    interface CircleIconProps {
        color: string;
        text: string;
    }

    const CircleIcon: React.FC<CircleIconProps> = ({ color, text }) => {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: color,
                        marginRight: "5px",
                    }}
                />
                <span>{text}</span>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="controls">
                <p className="header">HACKDAVIS 2023</p>
                <hr className="line" />
                <p className="title">SafeZone</p>
                <p className="description">Use this web application to report occurrences of suspicious activity and view the safety of the area you plan to travel to before doing so. Stay safe and contribute to keeping your community safe. </p>
                <Places
                    setOffice={(position) => {
                        setOffice(position);
                        mapRef.current?.panTo(position);
                    }}
                />
                <br></br>
                <Dropdown placeHolder="Select..." dropdownoptions={dropdownoptions} />
                <br></br>
                <button
                    className="my-button"
                    onClick={() => {
                        clickMe(location, xa);
                    }}>
                    Add Location
                </button>
                <br></br>
                <br></br>
                <br></br>
                <div className="circlecontainer">
                    <p>Thefts: {totalThefts}</p>
                    <p>Assaults: {totalAssaults}</p>
                    <p>Violence: {totalViolences}</p>
                    <p>Other: {other}</p>
                </div>

            </div>

            <div className="map">
                <GoogleMap
                    zoom={12}
                    center={center}
                    mapContainerClassName="map-container"
                    options={options}
                    onLoad={onLoad}
                >
                    <Marker
                        position={center}
                    />

                    {office && (
                        <>
                            <Marker
                                position={office}
                            />

                            <Circle center={center} radius={1000} options={closeOptions} />
                            <Circle center={center} radius={1500} options={middleOptions} />
                            <Circle center={center} radius={2000} options={farOptions} />
                        </>
                    )}

                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={location}
                            icon="https://storage.googleapis.com/support-kms-prod/SNP_2752068_en_v0"
                        />
                    ))}

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
    fillOpacity: 0.07,
    strokeColor: "#151E3d", //"#8BC34A",
    fillColor: "#0492C2", //"#8BC34A",
};
const middleOptions = {
    ...defaultOptions,
    zIndex: 2,
    fillOpacity: 0.07,
    strokeColor: "#1F456E",//"#FBC02D",
    fillColor: "#1520A6",
};
const farOptions = {
    ...defaultOptions,
    zIndex: 1,
    fillOpacity: 0.07,
    strokeColor: "#59788E", //"#FF5252",
    fillColor: "##1338BE",

};

let totalThefts = 0;
let totalAssaults = 0;
let totalViolences = 0;
let other = 0;

const generatePoints = async () => {
    const querySnapshot = await getDocs(collection(db, "susLocation"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const x = data.lat;
        const y = data.lng;

        locations.push({
            lat: x,
            lng: y,
        });


        if (data.crimeType == "Theft") {
            totalThefts = totalThefts + 1;
        }
        else if (data.crimeType == "Assault") {
            totalAssaults++;
        }
        else if (data.crimeType == "Violence") {
            totalViolences++;
        } else if (data.crimeType == "Other") {
            other++;
        }

    });

};
