import { ReturnVisit } from "../return-visits/models/ReturnVisit"
import { Person } from "./models/Person"
import { CreateType, Stores as BaseStores } from "./types/database"

export const PEOPLE_STORE = "people"
export const RETURN_VISITS_STORE = "returnVisits"

function defineStores<T extends BaseStores>(stores: T): T {
	return stores
}

const stores = defineStores({
	people: {
		type: {} as Person,
		key: 0,
		options: {
			keyPath: "id" as const,
			autoIncrement: true,
		},
		indexes: {
			name: ["name"],
			location: ["location"],
			colony: ["colony"],
		},
	},
	returnVisits: {
		type: {} as ReturnVisit,
		key: [0, new Date()] as [number, Date],
		options: {
			keyPath: ["personId", "date"],
		},
		indexes: {
			personId: ["personId"],
			date: ["date"],
			returnDate: ["returnDate"],
			topic: ["topic"],
		},
	},
})

type Stores = typeof stores
type Store = keyof Stores

export function getDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const dbName = "return_visits"
		const currentVersion = 1

		const request = indexedDB.open(dbName, currentVersion)

		request.onupgradeneeded = (event) => {
			// @ts-expect-error result should be in event.target
			const db: IDBDatabase = event.target.result

			Object.entries(stores).forEach(([storeName, options]) => {
				const store = db.createObjectStore(storeName, options.options)

				Object.entries(options.indexes).forEach(([indexName, options]) => {
					store.createIndex(indexName, ...options)
				})
			})
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
	store: Store,
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

export async function getStoreCursor<TStore extends Store>(
	store: TStore,
	transactionMode: IDBTransactionMode,
	key: Stores[TStore]["key"]
): Promise<IDBCursorWithValue> {
	return new Promise(async (resolve, reject) => {
		try {
			const dbStore = await getStore(store, transactionMode)
			const cursorRequest = dbStore.openCursor(key)

			cursorRequest.onsuccess = (event) => {
				// @ts-expect-error result should be cursor
				const cursor: IDBCursorWithValue = event.target.result
				if (!cursor) {
					reject(new Error("Error, elemento no encontrado"))
					return
				}

				resolve(cursor)
			}

			cursorRequest.onerror = (event) => {
				// @ts-expect-error result should be present
				const result = event.target.result
				reject(new Error(result || "Error, elemento no encontrado"))
			}
		} catch (error) {
			reject(error)
		}
	})
}

export async function addToStore<TStore extends Store>(
	store: TStore,
	value: CreateType<Stores, TStore>
): Promise<Stores[TStore]["key"]> {
	return new Promise(async (resolve, reject) => {
		try {
			if (import.meta.env.DEV) {
				console.log(`Adding to ${store}`, { value })
			}
			const dbStore = await getStore(store, "readwrite")

			const request = dbStore.add(value)

			request.onerror = (event) => {
				// @ts-expect-error result should be present
				const result = event.target.result
				reject(new Error(result || "Error, elemento duplicado"))
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

export async function updateInStore<TStore extends Store>(
	store: TStore,
	key: Stores[TStore]["key"],
	value: Partial<Stores[TStore]["type"]>
): Promise<Stores[TStore]["key"]> {
	return new Promise(async (resolve, reject) => {
		try {
			if (import.meta.env.DEV) {
				console.log(`Updating in ${store}, item ${key}`, { value })
			}
			const cursor = await getStoreCursor(store, "readwrite", key)

			const request = cursor.update(value)

			request.onerror = (event) => {
				// @ts-expect-error result should be present
				const result = event.target.result
				reject(new Error(result || "Error en la actualización"))
			}

			request.onsuccess = (event) => {
				// @ts-expect-error result should be present
				const result = event.target.result
				resolve(result)
			}
		} catch (error) {
			reject(error)
		}
	})
}

export async function deleteFromStore<TStore extends Store>(
	store: TStore,
	key: Stores[TStore]["key"]
): Promise<undefined> {
	return new Promise(async (resolve, reject) => {
		try {
			if (import.meta.env.DEV) {
				console.log(`Delete from ${store}, item ${key}`)
			}

			const cursor = await getStoreCursor(store, "readwrite", key)

			const request = cursor.delete()

			request.onerror = (event) => {
				// @ts-expect-error result should be present
				const result = event.target.result
				reject(new Error(result || "Error en la actualización"))
			}

			request.onsuccess = (event) => {
				// @ts-expect-error result should be present
				const result = event.target.result
				resolve(result)
			}
		} catch (error) {
			reject(error)
		}
	})
}

export async function getFromStore<TStore extends Store>(
	store: TStore,
	query: Stores[TStore]["key"]
): Promise<Stores[TStore]["type"]> {
	return new Promise(async (resolve, reject) => {
		try {
			if (import.meta.env.DEV) {
				console.log(`Querying ${query} from ${store}`)
			}
			const dbStore = await getStore(store, "readonly")

			const request = dbStore.get(query)

			request.onerror = (event) => {
				// @ts-expect-error result should be present
				reject(new Error(event.target.result))
			}

			request.onsuccess = (event) => {
				// @ts-expect-error result should be present
				const result: TData | undefined = event.target.result
				if (result) return resolve(result)
				return reject(new Error("No encontrado"))
			}
		} catch (error) {
			reject(error)
		}
	})
}

export async function getAllFromStore<TStore extends Store>(
	store: TStore,
	index?: keyof Stores[TStore]["indexes"],
	query?: IDBValidKey | IDBKeyRange | null,
	count?: number
): Promise<Array<Stores[TStore]["type"]>> {
	return new Promise(async (resolve, reject) => {
		try {
			if (import.meta.env.DEV) {
				console.log(`Querying all from from ${store}`, { index, query, count })
			}

			const dbStore = await getStore(store, "readonly")

			const request = index
				? dbStore.index(index as string).getAll(query, count)
				: dbStore.getAll(query, count)

			request.onerror = (event) => {
				// @ts-expect-error result should be present
				const result = event.target.result
				reject(new Error(result))
			}

			request.onsuccess = (event) => {
				// @ts-expect-error result should be present
				const result = event.target.result
				resolve(result)
			}
		} catch (error) {
			reject(error instanceof Error ? error : new Error("Error desconocido"))
		}
	})
}
