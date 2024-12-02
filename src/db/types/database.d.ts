type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any
	? R
	: never

type IndexParams = ParametersExceptFirst<IDBObjectStore["createIndex"]>

type StoreDefinition<TData, TKey> = {
	type: TData
	key: TKey
	options: IDBObjectStoreParameters
	indexes: Record<string, IndexParams>
}

export type Stores = Record<string, StoreDefinition<unknown, unknown>>

type AutoIncrement<
	TStores extends Stores,
	TStore extends keyof TStores,
> = TStores[TStore]["options"] extends {
	autoIncrement: true
}
	? true
	: false

export type KeyPath<
	TStores extends Stores,
	TStore extends keyof TStores,
> = AutoIncrement<TStores, TStore> extends true
	? TStores[TStore]["options"]["keyPath"] extends string
		? TStores[TStore]["options"]["keyPath"]
		: never
	: never

export type CreateType<
	TStores extends Stores,
	TStore extends keyof TStores,
> = AutoIncrement<TStores, TStore> extends true
	? Omit<TStores[TStore]["type"], KeyPath<TStores, TStore>>
	: TStores[TStore]["type"]
