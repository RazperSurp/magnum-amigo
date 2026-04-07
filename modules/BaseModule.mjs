export default class BaseModule {
    get name() { return this.__proto__.constructor.name }
    
    _core;
    constructor(coreObject = null) {
        if (coreObject) this._core = coreObject;
    }
}