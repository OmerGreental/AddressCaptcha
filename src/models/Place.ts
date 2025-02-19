export class Place {
    constructor(
        public placeName: string,
        public placeId: string,
        public placeAddress: string,
        public placeLat: number,
        public placeLng: number,
        public placeCity: string,
        public placeCountry: string,
        public placeTypes: string[],
        public placePhotos: string[],
    ) {}

    toString(): string {
        return [
            `Name: ${this.placeName}`,
            `Place ID: ${this.placeId}`,
            `Address: ${this.placeAddress}`,
            `Lat: ${this.placeLat}`,
            `Lng: ${this.placeLng}`,
            `City: ${this.placeCity}`,
            `Country: ${this.placeCountry}`,
            `Types: ${this.placeTypes}`,
            `Photos: ${this.placePhotos}`
        ].join("\n");
    }
}