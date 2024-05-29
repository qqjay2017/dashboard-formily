import { SchemaSettingOptions } from "./types";


/**
 * TODO
 */
export class SchemaSettings<T = {}> {
    options: SchemaSettingOptions<T>;
    name: string;
    constructor(options: SchemaSettingOptions<T>) {
        this.options = options
    }
}