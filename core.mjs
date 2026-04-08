import config from './config.json' with { type: 'json' }
import BaseModule from './modules/BaseModule.mjs';

export class Core extends BaseModule {
    _config;
    _modules = {};

    constructor() {
        super();
        this._config = config;
    }

    static async init() {
        console.log('==[ Initialization started ]==');
        let instance = new Core();
        await instance._importModules();
        instance.Logger.wrapMethods(instance);
        console.log('==[ Initialization complete ]==');

        return instance;
    }
                            
    async _importModules() {
        const modulesList = [...Object.entries(this._config.modules).filter(module => module[1].isEnabled === true).map(module => { return module[0] })];
        let dependencyValidation = true, 
            errCount = 0; 

        console.log(`== importing modules`);
        if (modulesList.length) for (const module of modulesList) {
            try {
                console.log(`= importing ./modules${this._config.modules[module].subPath}${module}.mjs`)
                if (this._modules.hasOwnProperty(module)) console.log(`---- already imported`);
                else {
                    if (this._config.modules[module].dependencies.length) {
                        console.log('---- checking dependencies');
                        this._config.modules[module].dependencies.forEach(dependency => {
                            if (!this._modules.hasOwnProperty(dependency)) {
                                console.error(`-------- ${String(dependency+'.mjs').padEnd(25, ' ')}\tX`);
                                dependencyValidation = false;
                            } else console.log(`-------- ${String(dependency+'.mjs').padEnd(25, ' ')}\t+`);
                        })
                        console[dependencyValidation ? 'log' : 'error'](`---- ${dependencyValidation ? 'complete' : 'failed'}`);
                    }

                    if (dependencyValidation) {
                        const resolve = await import(`./modules${this._config.modules[module].subPath}${module}.mjs`);
                        if (this._config.modules[module].doKeepInstanceAsModule) {
                            this._modules[module] = new resolve[module](this);
                        } else this._modules[module] = resolve[module];
                        
                        this[module] = this._modules[module];
                        console.log(`= successfully imported as ${this._config.modules[module].doKeepInstanceAsModule ? 'instance' : 'class'}!`);
                    } else {
                        errCount++;
                        console.error(`= failed`); 
                    }

                    dependencyValidation = true;
                }
            } catch (e) { 
                console.error(`- error: unable to import!`); 
                console.log(e); 
                errCount++;
            }
        } else console.log('== no modules to import ==');
        console.log(`== ${modulesList.length - errCount} of ${modulesList.length} module(-s) imported ==`);
    }
}

let core = await Core.init();

core.SocketServer.start(); 

setTimeout(() => {}, 3600*1000)