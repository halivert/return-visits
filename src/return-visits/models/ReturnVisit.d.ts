export interface ReturnVisit {
	/** Opaque id, the only reference to this visit sent to the push server */
	uuid: string
	personId: number
	date: Date
	topic: string
	returnDate: Date
	notes?: string
}
