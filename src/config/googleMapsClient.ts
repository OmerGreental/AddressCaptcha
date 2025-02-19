import axios from "axios";
import { GOOGLE_API_CONFIG } from "./googleApi";

export const googleMapsPostClient = axios.create({
    baseURL: "https://places.googleapis.com/v1/",
    headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_CONFIG.API_KEY
    }
});

export const googleMapsMetadata = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api/streetview/metadata",
    params: {
        key: GOOGLE_API_CONFIG.API_KEY // Automatically appends API key to all requests
    }
});

export const googleMapNewGet = axios.create({
    baseURL: "https://places.googleapis.com/v1/",
    params: {
        key: GOOGLE_API_CONFIG.API_KEY // Automatically appends API key to all requests
    }
});

export const googleMapsGeocoding = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api/geocode/json",
    params: {
        key: GOOGLE_API_CONFIG.API_KEY // Automatically appends API key to all requests
    }
});