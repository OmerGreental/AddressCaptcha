import {
    googleMapsGeocoding,
    googleMapsMetadata,
    googleMapsPostClient
} from "../config/googleMapsClient";
import {REQUESTS_CONFIG} from "../config/googleApi";
import {GeocodeResponse, GeocodeResult} from "../models/GeocodeResponse";
import {formatFieldsForPlacesAPI} from "./stringUtils";

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
        console.log("Sending request to Google API:", requestBody);

        const response = await googleMapsPostClient.post(REQUESTS_CONFIG.SEARCH_NEARBY, requestBody, {
            headers: { "X-Goog-FieldMask": fieldMask }
        });

        console.log("Google API Response:", JSON.stringify(response.data, null, 2));

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

