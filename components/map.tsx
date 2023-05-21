//import { useState, useMemo, useCallback, useRef } from "react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
import Distance from "./distance";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../pages/firebase';
import { xa } from "./Dropdown";

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

    const iconOption = {
        url: '~/Documents/HackDavis/redDot.png',
        size: 10
    }

    const dropdownoptions = [
        { value: "Theft", label: "Theft" },
        { value: "Assault", label: "Assault" },
        { value: "Violence", label: "Violence" },
        { value: "Other", label: "Other" },
    ];


    // useEffect(() => {
    //     const locations: Array<LatLngLiteral> = [];

    //     const querySnapshot = await getDocs(collection(db, "susLocation"));
    //     querySnapshot.forEach((doc) => {
    //         const data = doc.data();
    //         const x = data.lat;
    //         const y = data.lng;

    //         locations.push({
    //             lat: x,
    //             lng: y,
    //         });
    //     });
    // }, []);

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
                <p className="title">AM I SAFE</p>
                <p className="description">Use this web application to report occurrences of suspicious activity and view the safety of the area you plan to travel to before doing so. Stay safe and contribute to keeping your community safe. </p>
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
                        clickMe(location, xa);
                    }}>
                    Add a location with suspicious acitivty
                </button>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <CircleIcon color="yellow" text="Theft" />
                <CircleIcon color="amber" text="Assault" />
                <CircleIcon color="orange" text="Violence" />
                <CircleIcon color="red" text="Other" />
            </div>

            <div className="map">
                <GoogleMap
                    zoom={12}
                    center={center}
                    mapContainerClassName="map-container"
                    options={options}
                    onLoad={onLoad}
                >

                    {office && (
                        <>
                            <Marker
                                position={center}
                            />

                            <Circle center={center} radius={1000} options={closeOptions} />
                            //<Circle center={center} radius={1500} options={closeOptions} />
                            //<Circle center={center} radius={2000} options={closeOptions} />
                        </>
                    )}

                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={location}
                        //icon="../Icons/redDot.png"
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
    strokeColor: "#8BC34A",
    fillColor: "#8BC34A",
};
const middleOptions = {
    ...defaultOptions,
    zIndex: 2,
    fillOpacity: 0.07,
    strokeColor: "#FBC02D",
    fillColor: "#FBC02D",
};
const farOptions = {
    ...defaultOptions,
    zIndex: 1,
    fillOpacity: 0.07,
    strokeColor: "#FF5252",
    fillColor: "#FF5252",

};


const generatePoints = async () => {
    const _susLocs: Array<LatLngLiteral> = [];

    const querySnapshot = await getDocs(collection(db, "susLocation"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const x = data.lat;
        const y = data.lng;

        locations.push({
            lat: x,
            lng: y,
        });
    });
};

/*const generatePoints = async () => {
    const _susLocs: Array<LatLngLiteral> = [];

    const querySnapshot = await getDocs(collection(db, "susLocation"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const x = data.lat;
        const y = data.lng;

        _susLocs.push({
            lat: x,
            lng: y,
        });

        // const curData: LatLngLiteral = {
        //     lat: x,
        //     lng: y
        // };

        // //<Marker
        // //  position={curData}
        // ///>
        // {
        //     location && (
        //         <>
        //             <Marker
        //                 position={curData}
        //             />
        //         </>
        //     )
        // }

        susLoc.map((loc) => (
                            <Marker
                                position={loc}
                            />))

        console.log(`${doc.id} => ${doc.data()}`);
        console.log(x, y);
    });

    return _susLocs;
};*/

// const getDocumentCount = async () => {
//     const querySnapshot = await getDocs(collection(db, 'susLocation'));
//     const count = querySnapshot.size;
//     console.log('Number of documents:', count);
//     return count;
// };
