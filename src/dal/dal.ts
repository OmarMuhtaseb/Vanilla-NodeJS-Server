import * as fs from 'fs';
import path from 'path';
import {LockedResource, NotFoundException} from '../exception';
import {ExceptionMessages} from './constants';
import {BaseModel, BaseRepository} from './types';

// @ts-ignore
export class Dal<T extends BaseModel> implements BaseRepository<T> {
    private locked = false;
    private table: T[] = [];
    private readonly tableName: string;

    private constructor(name: string) {
        this.tableName = name;
    }

    public async insert(object: T): Promise<void> {
        this.table.push(object);
        await this.write();
    }

    public static async createInstance(tableName: string): Promise<BaseRepository<any>> {
        const repo = new Dal(tableName);
        await repo.load();
        return <BaseRepository<any>><unknown>repo;
    }

    public async list(query: { skip: number, limit: number, predicate: (value: T, index: number, array: T[]) => boolean }): Promise<T[]> {
        const filteredRecords = this.table.filter(query.predicate !== undefined ? query.predicate : () => true);
        return filteredRecords.slice(query.skip, query.skip + query.limit);
    }

    public async find(predicate?: (value: T, index: number, array: T[]) => boolean): Promise<T | undefined> {
        return this.table.find(predicate !== undefined ? predicate : () => true);
    }

    public async updateById(id: string, object: T): Promise<void> {
        const index = this.table.findIndex(record => record.id === id);
        if (index < 0) {
            throw new NotFoundException(ExceptionMessages.RECORD_NOT_FOUND);
        }
        this.table[index] = object;
        await this.write();
    }

    private async load() {
        const fileExists = await fs.existsSync(path.resolve(__dirname, `${this.tableName}.json`));
        if (fileExists) {
            const buffer = await fs.readFileSync(path.resolve(__dirname, `${this.tableName}.json`));
            this.table = JSON.parse(buffer.toString());
        }
    }

    private write(): void {
        if (this.locked) {
            throw new LockedResource(`${ExceptionMessages.FILE_LOCKED} -- ${this.tableName}`);
        }

        this.locked = true;
        try {
            fs.writeFileSync(path.resolve(__dirname, `${this.tableName}.json`),
                JSON.stringify(this.table, null, 2), {flag: 'w'});
            this.locked = false;
        } catch (e) {
            this.locked = false;
            console.log(`Could not write to file ${this.tableName} -- ${e}`);
            throw e;
        }
    }
}
