import {Place} from "../models/Place";
import {LatLng} from "../models/GeocodeResponse";
import {FetchMode, fetchNearbyPlaces} from "./googleMapsApiHelper";
import {createPhotoArray} from "./imageUtils";
import {addressToLatLng, generateNewAddressesFromAddress} from "./geoUtils";
import {getNearbyPlacesByAddress} from "./apiWrapper";

/*-------Places Handling & Fetching-------*/

export const generateNearbyPlacesFromAddress = async (address: string, radius: number, incTypes?: string[], excTypes?: string[], fields?: string[], maxResults = 5): Promise<Place[]> => {
    const coordinates: LatLng = await addressToLatLng(address);
    const placesResult = await fetchNearbyPlaces(coordinates.lat, coordinates.lng, radius, incTypes, excTypes, fields, maxResults);
    const places: Place[] = [];

    for (const place of placesResult.places){
        places.push(await googlePlaceToPlace(place));
    }

    return places;
};

export const generateDecoyPlacesFromAddress = async (address: string): Promise<Place[]> => {
    const decoyAddresses = await generateNewAddressesFromAddress(address, 2, 5000);
    const decoyPlacesArray: Place[][] = [[]];

    for (const decoyAddress of decoyAddresses) {
        decoyPlacesArray.push(await generateNearbyPlacesFromAddress(decoyAddress, 1000));
    }

    return decoyPlacesArray.flat();
}

export const googlePlaceToPlace = async (googlePlace: any): Promise<Place> =>{
    let name = googlePlace.displayName.text ?? "";
    let id = googlePlace.id ?? "";
    let address = googlePlace.formattedAddress ?? "";
    let lat = googlePlace.location.latitude ?? 0;
    let lng = googlePlace.location.longitude ?? 0;
    let city = "";
    let country = "";
    for (const component of googlePlace.addressComponents || []) {
        if (component.types.includes("locality")){
            city = component.longText;
        }
        if (component.types.includes("country")){
            country = component.longText;
        }
    }
    let types: string[] = googlePlace.types ?? [];
    let photos: string[] = await createPhotoArray(googlePlace.photos, address, lat, lng) ?? [];

    return new Place(name, id, address, lat, lng, city, country, types, photos);
}

export const generateNearbyPlacesTest = async (address: string): Promise<Place[]> => {

    return await getNearbyPlacesByAddress(address);
}

export const generateDecoyPlacesFromAddressTest = async (address: string): Promise<Place[]> => {
    const places1 = await generateDecoyPlacesWithRetry(address);
    const places2 = await generateDecoyPlacesWithRetry(address);


    return [...places1, ...places2];
}

export const generateDecoyPlacesWithRetry = async (address: string, maxRetries=5): Promise<Place[]> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const [decoyAddress] = await generateNewAddressesFromAddress(address, 1, 5000);
        const places = await getNearbyPlacesByAddress(decoyAddress, { results: 5 }, FetchMode.STRICT);

        if (places.length === 5) return places;
    }

    return [];
}