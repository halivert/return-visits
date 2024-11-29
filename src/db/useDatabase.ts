export const PEOPLE_STORE = "people"
export const RETURN_VISITS_STORE = "returnVisits"

type STORE = typeof PEOPLE_STORE | typeof RETURN_VISITS_STORE

export function getDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const dbName = "return_visits"
		const currentVersion = 1

		const request = indexedDB.open(dbName, currentVersion)

		request.onupgradeneeded = (event) => {
			// @ts-expect-error result should be in event.target
			const db: IDBDatabase = event.target.result

			const peopleStore = db.createObjectStore(PEOPLE_STORE, {
				keyPath: "id",
				autoIncrement: true,
			})

			peopleStore.createIndex("name", "name")
			peopleStore.createIndex("location", "location")
			peopleStore.createIndex("returnDay", "returnDay")
			peopleStore.createIndex("colony", "colony")

			const returnVisitsStore = db.createObjectStore(RETURN_VISITS_STORE, {
				keyPath: ["personId", "date"],
			})

			returnVisitsStore.createIndex("topic", "topic")
		}

		request.onsuccess = (event) => {
			// @ts-expect-error result should be in event.target
			resolve(event.target.result)
		}

		request.onerror = (event) => {
			// @ts-expect-error event is not correctly typed >:(
			reject(new Error(`Database error: ${event.target.error?.message}`))
		}
	})
}

export async function getStore(
	store: STORE,
	transactionMode: IDBTransactionMode
): Promise<IDBObjectStore> {
	return new Promise(async (resolve, reject) => {
		try {
			const db = await getDatabase()

			return resolve(
				db.transaction([store], transactionMode).objectStore(store)
			)
		} catch (error) {
			reject(error)
		}
	})
}

export async function addToStore<TData, TKey extends IDBValidKey = IDBValidKey>(
	store: STORE,
	value: TData
): Promise<TKey> {
	return new Promise(async (resolve, reject) => {
		try {
			const dbStore = await getStore(store, "readwrite")

			const request = dbStore.add(value)

			request.onerror = (event) => {
				// @ts-expect-error result should be present
				reject(new Error(event.target.result))
			}

			request.onsuccess = (event) => {
				// @ts-expect-error result should be present
				resolve(event.target.result)
			}
		} catch (error) {
			reject(error)
		}
	})
}

export async function getFromStore<TData>(
	store: STORE,
	query: IDBValidKey | IDBKeyRange
): Promise<TData> {
	return new Promise(async (resolve, reject) => {
		try {
			const dbStore = await getStore(store, "readonly")

			const request = dbStore.get(query)

			request.onerror = (event) => {
				// @ts-expect-error result should be present
				reject(new Error(event.target.result))
			}

			request.onsuccess = (event) => {
				// @ts-expect-error result should be present
				const result: Person | undefined = event.target.result
				if (result) return resolve(result)
				return reject(new Error("No encontrado"))
			}
		} catch (error) {
			reject(error)
		}
	})
}

export async function getAllFromStore<TData>(
	store: STORE,
	query?: IDBValidKey | IDBKeyRange | null,
	count?: number
): Promise<TData[]> {
	return new Promise(async (resolve, reject) => {
		try {
			const dbStore = await getStore(store, "readonly")

			const request = dbStore.getAll(query, count)

			request.onerror = (event) => {
				// @ts-expect-error result should be present
				reject(new Error(event.target.result))
			}

			request.onsuccess = (event) => {
				// @ts-expect-error result should be present
				resolve(event.target.result)
			}
		} catch (error) {
			reject(error)
		}
	})
}
