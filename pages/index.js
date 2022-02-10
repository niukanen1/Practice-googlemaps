
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
    const URL = "mongodb+srv://ivan:1qaz@cluster0.2u3vn.mongodb.net/test"
    const client = new MongoClient(URL);
    await client.connect();
    const database = await client.db("Practice");
    const collection = await database.collection("places");
    const cursor = await collection.find({}).toArray();
    const data = JSON.stringify(cursor);

    async function GeoAddress(address) {
        const geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?new_forward_geocoder=true&address="+ address + "&key=AIzaSyCmWzoMrGJRzjwL0-01kvdOlu7d6ljI-vk";
        let result = fetch(geoUrl)
            .then(result => result.json())
            .then(place => {
                if (typeof place.results[0]?.geometry.location === "undefined") {
                    return null
                }
                else {
                    return place.results[0]?.geometry.location
                }
            })

        return result
    }
    const places = JSON.parse(data);

    for (let i of places) {
        i.position = await GeoAddress(i.address)
    }
    const exPlaces = JSON.stringify(places)
    return {
        props: {
            exPlaces
        }
    }

}

export default GoogleApiWrapper({
    apiKey: "AIzaSyCmWzoMrGJRzjwL0-01kvdOlu7d6ljI-vk"
})(Home)