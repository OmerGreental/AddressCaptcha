import {isImageAvailableByAddress, isImageAvailableByLatLng} from "./validation";
import {GOOGLE_API_CONFIG, REQUESTS_CONFIG} from "../config/googleApi";
import {Captcha} from "../models/Captcha";
import {mergeArrays} from "./arrayUtils";

/*-------Image Handling & Creation-------*/

export function captchaToPhotosArray(captcha: Captcha): string[][]{
    return captcha.captchaItems.map(item => item.photos);
}

export const createPhotoArray = async (photos: any, address: string, lat: number, lng: number): Promise<string[]> => {
    const streetViewArray = await createStreetViewPhotosArray(address, lat, lng);
    const placePhotosArray = createPlacePhotosArray(photos);

    return mergeArrays(streetViewArray, placePhotosArray);
}

export const createStreetViewPhotosArray = async (address: string, lat: number, lng: number): Promise<string[]> => {
    const photos: string[] = [];
    const addressPhoto = await createStreetViewUrlByAddress(address);
    const locationPhoto = await createStreetViewUrlByLatLng(lat, lng);

    if(addressPhoto){
        photos.push(addressPhoto);
    }
    if(locationPhoto){
        photos.push(locationPhoto);
    }

    return photos;
}

export function createPlacePhotosArray(photos: any): string[] {
    const newPhotoArray: string[] = [];

    if (photos && photos.length > 0) {
        for (const photo of photos) {
            newPhotoArray.push(createPhotoUrl(photo.name));
        }
    }

    return newPhotoArray;
}

export const createStreetViewUrlByAddress = async (address: string, width = 350, height = 350): Promise<string> => {
    if (!await isImageAvailableByAddress(address)) {
        return ""
    }
    const urlEncodedAddress = encodeURIComponent(address);

    return `${REQUESTS_CONFIG.OLD_URL}/streetview?size=${width}x${height}&location=${urlEncodedAddress}&key=${GOOGLE_API_CONFIG.API_KEY}`;
}

export const createStreetViewUrlByLatLng = async (lat: number, lng: number, width = 350, height = 350): Promise<string> => {
    if (!await isImageAvailableByLatLng(lat, lng)) {
        return ""
    }

    return `${REQUESTS_CONFIG.OLD_URL}/streetview?size=${width}x${height}&location=${lat},${lng}&key=${GOOGLE_API_CONFIG.API_KEY}`;
}

export function createPhotoUrl(photoName: string, maxHeight = 350, maxWidth = 350) {
    return `${REQUESTS_CONFIG.NEW_URL}/${photoName}/media?key=${GOOGLE_API_CONFIG.API_KEY}&maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}`;
}