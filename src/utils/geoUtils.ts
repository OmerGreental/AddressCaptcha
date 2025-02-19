import {GeocodeResult, LatLng} from "../models/GeocodeResponse";
import {fetchGeocodeFromAddress, fetchGeocodeFromLatLng} from "./googleMapsApiHelper";
import {computeDestinationPoint} from "geolib";
import {getRandomInt} from "./numberUtils";


/*-------Geographical Calculations & Processing-------*/

export const generateNewAddressesFromAddress = async (address: string, amount: number, distance: number): Promise<string[]> =>{
    const bearings: number[] = generateRandomDirections(amount);
    const coordinates: LatLng = await addressToLatLng(address);
    const newLocations: LatLng[] = bearings.map(bearing => calculateNewLatLng(coordinates, distance, bearing));
    const newAddresses: string[] = [];
    const originalCountry = await extractCountryFromAddress(address);

    const geocodeResults = await Promise.allSettled(newLocations.map(location => fetchGeocodeFromLatLng(location.lat, location.lng)));

    geocodeResults.forEach(result => {
        if (result.status === "fulfilled") {
            let geocodeObject = result.value;
            let locationCountry = extractCountryFromGeocodeObject(geocodeObject);
            if (locationCountry === originalCountry) {
                newAddresses.push(extractAddressFromGeocodeObject(geocodeObject));
            }
        } else {
            console.warn("Failed to fetch geocode:", result.reason);
        }
    });

    return newAddresses;
}

export const addressToLatLng = async (address: string): Promise<LatLng> => {
    const response = await fetchGeocodeFromAddress(address);

    return { lat: response.geometry.location.lat, lng: response.geometry.location.lng };
}

export function calculateNewLatLng(coordinate: LatLng, distance: number, bearing: number): LatLng {
    const newPoint = computeDestinationPoint({latitude: coordinate.lat, longitude: coordinate.lng}, distance, bearing);

    return {lat: newPoint.latitude, lng: newPoint.longitude};
}

export function generateRandomDirections(amount: number): number[] {
    const bearings: number[] = []

    for (let i=0; i<amount; i++){
        bearings.push(getRandomInt(0, 360));
    }

    console.log(bearings);
    return bearings;
}

export const extractCountryFromAddress = async (address: string): Promise<string> =>{
    const response = await fetchGeocodeFromAddress(address);

    return extractCountryFromGeocodeObject(response);
}

export function extractCountryFromGeocodeObject(geocodePlace: GeocodeResult): string{
    let country = "";

    for (const component of geocodePlace.address_components) {
        if (component.types.includes("country")){
            country = component.long_name;
        }
    }

    return country;
}

export function extractAddressFromGeocodeObject(geocodePlace: GeocodeResult): string{

    return geocodePlace.formatted_address;
}