import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";

export default function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCNG0IAvVs4e34OJpUp-z87p5Q6dOVEf4c",
        libraries: ["places"],
    });

    if (!isLoaded) return <div>Loading...</div>;
    return <Map />;
}
