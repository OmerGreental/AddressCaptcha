import {Place} from "../models/Place";
import {Captcha, CaptchaItem, ItemType} from "../models/Captcha";
import {mergeArrays, shuffleArray} from "./arrayUtils";

/*-------Captcha Creation & Processing-------*/


export function generateCaptchaFromPlaces(nearOriginalAddress: Place[], nearDecoyAddresses: Place[]): Captcha {
    const originalAddressItems = placeArrayToCaptchaItemArray(nearOriginalAddress, ItemType.Original);
    const decoyAddressItems =  placeArrayToCaptchaItemArray(nearDecoyAddresses, ItemType.Decoy);

    const shuffledItems = shuffleArray(mergeArrays(originalAddressItems, decoyAddressItems));

    return new Captcha(shuffledItems);
}

export function createCaptchaItem(photosArray: string[], isOriginal: number): CaptchaItem {
    return new CaptchaItem(photosArray, isOriginal);
}

export function placeArrayToCaptchaItemArray(places: Place[], isOriginal: ItemType): CaptchaItem[] {

    return places.map(place => placeToCaptchaItem(place, isOriginal));
}

export function placeToCaptchaItem(place: Place, isOriginal: ItemType): CaptchaItem {
    if(place.placePhotos.length === 0){
        return createCaptchaItem([], ItemType.Flawed);
    }

    const mainPhotos: string[] = place.placePhotos.slice(0, 3);

    return createCaptchaItem(mainPhotos, isOriginal);
}