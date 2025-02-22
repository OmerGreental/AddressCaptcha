import {isAddressValid} from "../utils/validation";
import {Place} from "../models/Place";
import {Captcha, ItemType} from "../models/Captcha";
import {
    generateDecoyPlacesFromAddress, generateDecoyPlacesFromAddressTest,
    generateNearbyPlacesFromAddress,
    generateNearbyPlacesTest
} from "../utils/placeUtils";
import {generateCaptchaFromPlaces} from "../utils/captchaUtils";
import {captchaToPhotosArray} from "../utils/imageUtils";

let answersCaptcha: Captcha;

export const getLocationsPhotoArray = async (address: string): Promise<string[][]> =>{
    const result: string[][] = [];

    if(!await isAddressValid(address)){
        return result;
    }
    try{
        const placesNearOriginalAddress: Place[] = await generateNearbyPlacesFromAddress(address, 1000);
        console.log(placesNearOriginalAddress);
        const placesNearDecoyAddresses: Place[] = await generateDecoyPlacesFromAddress(address);

        answersCaptcha = generateCaptchaFromPlaces(placesNearOriginalAddress, placesNearDecoyAddresses);
        return captchaToPhotosArray(answersCaptcha);
    } catch (error) {
        console.log("Error in getLocationsPhotoArray:", error);
        return result;
    }
}


export function analyzeResults(answersArray: number[]): boolean{
    let originalCorrect = 0;
    let decoyCorrect = 0;

    if(answersArray.length !== answersCaptcha.captchaItems.length){
        return false;
    }

    for(let i = 0; i < answersCaptcha.captchaItems.length; i++){
        if(answersCaptcha.captchaItems[i].isOriginalAddress===ItemType.Original){
            if(answersArray[i]===ItemType.Original){
                originalCorrect = originalCorrect + 1;
            }
        }
        else{
            if(answersArray[i]===ItemType.Decoy){
                decoyCorrect = decoyCorrect + 1;
            }
        }
    }

    if(decoyCorrect >= 8 && originalCorrect >= 3){
        return true;
    }
    else{
        return false;
    }
}

export const getLocationsPhotoArrayTest = async (address: string): Promise<string[][]> =>{
    const result: string[][] = [];

    if(!await isAddressValid(address)){
        return result;
    }
    try{
        const placesNearOriginalAddress: Place[] = await generateNearbyPlacesTest(address);
        const placesNearDecoyAddresses: Place[] = await generateDecoyPlacesFromAddressTest(address);

        answersCaptcha = generateCaptchaFromPlaces(placesNearOriginalAddress, placesNearDecoyAddresses);
        return captchaToPhotosArray(answersCaptcha);
    } catch (error) {
        console.log("Error in getLocationsPhotoArray:", error);
        return result;
    }
}