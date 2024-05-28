import { SchemaSettingOptions } from "./types";


export class SchemaSettings<T = {}> {
    options: SchemaSettingOptions<T>;
    name: string;
    constructor(options: SchemaSettingOptions) {

    }
}