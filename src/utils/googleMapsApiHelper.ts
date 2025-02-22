import {
    googleMapsGeocoding,
    googleMapsMetadata,
    googleMapsPostClient
} from "../config/googleMapsClient";
import {REQUESTS_CONFIG} from "../config/googleApi";
import {GeocodeResponse, GeocodeResult, LatLng} from "../models/GeocodeResponse";
import {formatFieldsForPlacesAPI} from "./stringUtils";
import {addressToLatLng} from "./geoUtils";
import {AxiosResponse} from "axios";
import {google} from "@googlemaps/places/build/protos/protos";
import ISearchNearbyResponse = google.maps.places.v1.ISearchNearbyResponse;
import IPlace = google.maps.places.v1.IPlace;

export enum FetchMode {
    STRICT = 1,
    FLEXIBLE = 0
}

export const fetchNearbyPlaces = async (lat: number, lng: number, radius: number,  incTypes?: string[], excTypes?: string[], fields?: string[], maxResults = 20) => {
    const requestBody = {
        includedTypes: incTypes ? incTypes : REQUESTS_CONFIG.INC_TYPES,
        excludedTypes: excTypes ? excTypes : REQUESTS_CONFIG.EXC_TYPES,
        maxResultCount: maxResults,
        locationRestriction: {
            circle: {
                center: { latitude: lat, longitude: lng },
                radius
            }
        }
    };

    const fieldMask = formatFieldsForPlacesAPI(fields || REQUESTS_CONFIG.FIELD_MASK);

    try {
        const response = await googleMapsPostClient.post(REQUESTS_CONFIG.SEARCH_NEARBY, requestBody, {
            headers: { "X-Goog-FieldMask": fieldMask }
        });

        return response.data || [];
    } catch (error: any) {
        console.error("Google Maps API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch places");
    }
};

export const fetchGeocodeFromAddress = async (address: string): Promise<GeocodeResult> => {
    const params = {
        address: address
    };

    try{
        const response = await googleMapsGeocoding.get("", {params});
        const data: GeocodeResponse = response.data;
        if (data.status !== "OK" || !data.results.length) {
            throw new Error(`Geocoding failed: ${data.status}`);
        }

        return data.results[0];
    } catch (error: any) {
        console.error("Google Maps API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch geocode");
    }
}

export const fetchGeocodeFromLatLng = async (lat: number, lng: number): Promise<GeocodeResult> => {
    const params = {
        latlng: `${lat},${lng}`
    };

    try{
        const response = await googleMapsGeocoding.get("", {params});
        const data: GeocodeResponse = response.data;
        if (data.status !== "OK" || !data.results.length) {
            throw new Error(`Geocoding failed: ${data.status}`);
        }

        return data.results[0];
    } catch (error: any) {
        console.error("Google Maps API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch geocode");
    }
}

export const makeMetadataRequestByAddress = async (address: string) => {
    const params = {
        location: address
    };

    try{
        const response = await googleMapsMetadata.get("", {params});

        return response.data;
    }catch(error: any){
        console.error("Google Maps API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch metadata");
    }
}

export const makeMetadataRequestByLatLng = async (lat: number, lng: number) => {
    const params = {
        location: `${lat},${lng}`
    };

    try{
        const response = await googleMapsMetadata.get("", {params});

        return response.data;
    }catch(error: any){
        console.error("Google Maps API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch metadata");
    }
}

export const fetchNearbyPlacesByAddress = async (
    address: string,
    options: {
        radius?: number;
        results?: number;
        incTypes?: string[];
        excTypes?: string[];
        fields?: string[];
        mode?: FetchMode;
    } = {}
): Promise<any> => {
    try {
        const { lat, lng } = await addressToLatLng(address);

        return await fetchNearbyPlacesByLatLng(lat, lng, options);
    } catch (error: any) {
        console.error("Failed to fetch places by address:", error.message);
        throw new Error("Failed to fetch nearby places by address");
    }
};

export const fetchNearbyPlacesByLatLng = async (
    lat: number,
    lng: number,
    {
        radius = 1000,
        results = 20,
        incTypes = REQUESTS_CONFIG.INC_TYPES,
        excTypes = REQUESTS_CONFIG.EXC_TYPES,
        fields = REQUESTS_CONFIG.FIELD_MASK,
    }: {
        radius?: number;
        results?: number;
        incTypes?: string[];
        excTypes?: string[];
        fields?: string[];
    } = {}
): Promise<ISearchNearbyResponse | null> => {
    const requestBody = {
        includedTypes: incTypes,
        excludedTypes: excTypes,
        maxResultCount: results,
        locationRestriction: {
            circle: {
                center: { latitude: lat, longitude: lng },
                radius
            }
        }
    };

    const fieldMask = formatFieldsForPlacesAPI(fields);

    try {
        const response: AxiosResponse<ISearchNearbyResponse, any> = await googleMapsPostClient.post(REQUESTS_CONFIG.SEARCH_NEARBY, requestBody, {
            headers: { "X-Goog-FieldMask": fieldMask }
        });
        if (!response.data){
            throw new Error("Data is empty");
        }

        return response.data;
    } catch (error: any) {
        console.error("Google Maps API Error:", error.response?.data || error.message);
        return null;
    }
};



