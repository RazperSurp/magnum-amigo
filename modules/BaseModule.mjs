export default class BaseModule {
    _core;
    _config = {};

    get class() { return this.__proto__.constructor.name }
    get config() {
        if (Object.keys(this._config).length === 0) this._config = this?._core?._config?.modules[this.class].config ?? {};
        return this._config;
    }
    
    constructor(coreObject = null) {
        if (coreObject) this._core = coreObject;
        if (this._core !== undefined && this._core._config.modules.Logger.isEnabled && this.config.doWrapWithLogger) this._core.Logger.wrapMethods(this);
    }
}