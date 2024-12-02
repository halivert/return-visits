type Coordinates = {
	latitude: GeolocationCoordinates["latitude"]
	longitude: GeolocationCoordinates["longitude"]
	altitude?: GeolocationCoordinates["altitude"]
}

export interface Person {
	id: number
	name: string
	description: string
	colony: string
	location?: Coordinates
}
