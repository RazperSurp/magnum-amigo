export default class BaseModule {
    get name() { return this.__proto__.constructor.name }
    _config = {};
    get config() {
        if (Object.keys(this._config).length === 0) this._config = this?._core?._config?.modules[this.name].config ?? {};
        return this._config;
    }
    
    _core;
    constructor(coreObject = null) { if (coreObject) this._core = coreObject; }
}