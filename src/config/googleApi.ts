import dotenv from 'dotenv'

dotenv.config()

export const GOOGLE_API_CONFIG = {
    API_KEY: process.env.GOOGLE_API_KEY || "",
    IMAGE_SIZE: "350x350",
    TIMEOUT_MS: 5000,
};

export const REQUESTS_CONFIG = {
    SEARCH_NEARBY: "places:searchNearby",
    FIELD_MASK: ["displayName", "id", "formattedAddress", "location", "addressComponents", "types", "photos"],
    INC_TYPES: ["tourist_attraction", "museum", "stadium",
        "amusement_park", "aquarium", "zoo", "shopping_mall",
        "department_store", "supermarket", "store", "clothing_store",
        "electronics_store", "furniture_store", "home_goods_store",
        "jewelry_store", "shoe_store", "book_store", "restaurant",
        "cafe", "bakery", "bar", "movie_theater", "casino", "night_club",
        "art_gallery", "bowling_alley", "church", "hindu_temple",
        "mosque", "synagogue", "train_station", "subway_station",
        "bus_station", "airport", "lodging", "hotel", "resort_hotel"],
    EXC_TYPES: ["country", "administrative_area_level_1", "administrative_area_level_2", "locality"],
    NEW_URL: "https://places.googleapis.com/v1",
    OLD_URL: "https://maps.googleapis.com/maps/api"
}