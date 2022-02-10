import { Map, GoogleApiWrapper, Marker, InfoWindow} from "google-maps-react";
import { MongoClient } from "mongodb";
import { useState } from "react";

function Home({google, exPlaces}) {
    const [places, setPlaces] = useState(JSON.parse(exPlaces));
    const [active, setActive] = useState({
        activeMarker: {},
        activePlace: {},
        showInfo: false,
    })

    const onInfoWindowClose = () => {
        setActive({
            activeMarker: {},
            activePlace: {},
            showInfo: false
        })
    }
    const onMarkerClick = (props, marker) => {
        setActive({
            activeMarker: marker,
            activePlace: props,
            showInfo: true,
        })
    }

    const onMapClick = () => {
        setActive({
            activeMarker: {},
            activePlace: {},
            showInfo: false,
        })
    }
    return (
        <div>
            <Map
                google={google}
                style={{height: "100%", width: "100%"}}
                zoom={8}
                onClick={onMapClick}
                initialCenter={
                    {
                        lat: 58.73229938766023,
                        lng: 26.084846206155113
                    }
                }
            >
                {places.map((el, index) => (
                    <Marker
                        style={{ width: "20px", height: "20px", backgroundColor: 'black'}}
                        className={"Marker"}
                        key={el.org_name}
                        position={el.position}
                        onClick={
                        (props, marker) => {
                            onMarkerClick(el, marker)
                        }}>

                    </Marker>
                ))}
                <InfoWindow
                    marker={active.activeMarker}
                    onClose={onInfoWindowClose}
                    visible={active.showInfo}
                >
                    <div >
                        <h1>{active.activePlace ? active.activePlace.org_name : ""}</h1>
                        <p>{active.activePlace ? active.activePlace.description : ""}</p>
                    </div>
                </InfoWindow>
            </Map>
        </div>
    )
}

export async function getStaticProps() {
    const URL = process.env.MONGODB_URI;
    const client = new MongoClient(URL);
    await client.connect();
    const database = await client.db("Practice");
    const collection = await database.collection("places");
    const cursor = await collection.find({}).toArray();
    const data = JSON.stringify(cursor);
    async function GeoAddress(address) {
        const NodeGeocoder = require('node-geocoder');
        const options = {
            provider: "google",
            apiKey: "AIzaSyCmWzoMrGJRzjwL0-01kvdOlu7d6ljI-vk",
            formatter: null
        }
        const geocoder = NodeGeocoder(options);
        const fullResult = await geocoder.geocode(address);
        const result = {
            lat: fullResult[0]?.latitude,
            lng: fullResult[0]?.longitude
        }

        return result
    }
    const places = JSON.parse(data);

    for (let i of places) {
        i.position = await GeoAddress(i.address)
        if (i.position === null) {
            console.log(i.address);
        }
    }
    const exPlaces = JSON.stringify(places)
    return {
        props: {
            exPlaces
        }
    }

}

export default GoogleApiWrapper({
    apiKey: process.env.GOOGLEMAP_APIKEY
})(Home)