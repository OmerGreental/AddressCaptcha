import {FetchMode, fetchNearbyPlacesByLatLng} from "./googleMapsApiHelper";
import {addressToLatLng} from "./geoUtils";
import {REQUESTS_CONFIG} from "../config/googleApi";
import {google} from "@googlemaps/places/build/protos/protos";
import {googlePlaceToPlace} from "./placeUtils";
import {Place} from "../models/Place";


export const getNearbyPlacesByAddress = async (
    address: string,
    options: Partial<{
        radius: number;
        results: number;
        incTypes: string[];
        excTypes: string[];
        fields: string[];
    }> = {},
    mode?: FetchMode
): Promise<Place[]> =>{
    const { lat, lng } = await addressToLatLng(address);

    return await getNearbyPlacesByLatLng(lat, lng, options, mode);
}

export const getNearbyPlacesByLatLng = async (
    lat: number,
    lng: number,
    options: Partial<{
        radius: number;
        results: number;
        incTypes: string[];
        excTypes: string[];
        fields: string[];
    }> = {},
    mode: FetchMode = FetchMode.FLEXIBLE
): Promise<Place[]> => {
    const {
        radius = 1000,
        results = 5,
        incTypes = REQUESTS_CONFIG.INC_TYPES,
        excTypes = REQUESTS_CONFIG.EXC_TYPES,
        fields = REQUESTS_CONFIG.FIELD_MASK
    } = options;

    const response = await fetchNearbyPlacesByLatLng(lat, lng, { radius, results, incTypes, excTypes, fields });

    if (!response || !response.places) return [];

    if (mode === FetchMode.STRICT && response.places.length < results) return [];

    const conversionResults = await Promise.allSettled(response.places.map(googlePlaceToPlace));

    return conversionResults
        .filter((result): result is PromiseFulfilledResult<Place> => result.status === "fulfilled")
        .map(result => (result as PromiseFulfilledResult<Place>).value);
};