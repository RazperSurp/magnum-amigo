import BaseModule from "./BaseModule.mjs";

export class BaseCollection extends BaseModule {
    items = [];

    constructor(coreObject) {
        super(coreObject);
    }

    filter(key, value) {
        return this.items.filter(item => item[key] === value);
    }

    find(key, value) {
        return this.filter(key, value)[0];
    }

    push(item) {
        this.items.push(item);
        return item;
    }
} 