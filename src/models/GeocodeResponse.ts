export interface GeocodeResponse {
    results: GeocodeResult[];
    status: string; // "OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", etc.
}

export interface GeocodeResult {
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    types: string[];
    address_components: AddressComponent[];
}

export interface Geometry {
    location: LatLng;
    location_type: string; // "ROOFTOP", "GEOMETRIC_CENTER", etc.
    viewport: Viewport;
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface Viewport {
    northeast: LatLng;
    southwest: LatLng;
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}
