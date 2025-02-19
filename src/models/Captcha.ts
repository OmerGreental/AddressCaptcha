export enum ItemType {
    Original = 1,
    Decoy = 0,
    Flawed = -1
}

export class CaptchaItem {
    constructor(public photos: string[], public isOriginalAddress: ItemType) {}

    toString(): string {
        return `[${this.photos.join(", ")}], ${this.isOriginalAddress}`;
    }
}

export class Captcha {
    constructor(
        public captchaItems: CaptchaItem[]
    ) {}

    toString(): string {
        return `Photos Array:\n${this.captchaItems.map(item => item.toString()).join("\n")}`;
    }
}
