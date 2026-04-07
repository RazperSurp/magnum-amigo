import BaseModule from "./BaseModule.mjs";

class BaseCollection extends BaseModule {
    items;

    constructor(coreObject) {
        super(coreObject);
    }

    push(item) {
        this.items.push(item);
    }
} 