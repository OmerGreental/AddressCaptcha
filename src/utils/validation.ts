import {GOOGLE_API_CONFIG, REQUESTS_CONFIG} from "../config/googleApi";
import {makeMetadataRequestByAddress, makeMetadataRequestByLatLng} from "./googleMapsApiHelper";
import {Place} from "../models/Place";

export const isImageAvailableByAddress = async (address: string): Promise<boolean> => {
    const response = await makeMetadataRequestByAddress(address);

    return response.status === "OK";
}

export const isImageAvailableByLatLng = async (lat: number, lng: number): Promise<boolean> => {
    const response = await makeMetadataRequestByLatLng(lat, lng);

    return response.status === "OK";
}

export const isAddressValid = async (address: string): Promise<boolean> =>{
    return true;
}