export type BaseModel = {
    id: string;
}

export interface BaseRepository<T extends BaseModel> {
    createInstance(tableName: string): Promise<BaseRepository<T>>;

    list(query: { skip: number, limit: number, predicate?: (value: T, index: number, array: T[]) => boolean }): Promise<T[]>;

    find(predicate?: (value: T, index: number, array: T[]) => boolean): Promise<T | undefined>;

    insert(object: T): Promise<void>;

    updateById(id: string, object: T): Promise<void>;
}
