/*-------String Handling-------*/


export function formatFieldsForPlacesAPI(fields: string[]): string  {
    return fields.map(field => `places.${field}`).join(",");
}
