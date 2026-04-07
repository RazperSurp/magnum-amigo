import config from './config.json' with { type: 'json' }
import BaseModule from './modules/BaseModule.mjs';

export class Core extends BaseModule {
    #logger;
    config;
    _modules = {};

    constructor() {
        super();

        this.config = config;
    }

    static async init() {
        let instance = new Core();
        await instance._importModules();

        return instance;
    }

    async _importModules() {
        const modulesList = [...Object.entries(this.config.modules).filter(module => module[1].isEnabled === true).map(module => { return module[0] })];
        let dependencyValidation = true, 
            errCount = 0; 

        console.log(`importing modules...`);
        if (modulesList.length) for (const module of modulesList) {
            try {
                console.log(`importing ./modules${config.modules[module].subPath}${module}.mjs...`)
                if (this._modules.hasOwnProperty(module)) console.log(`...already imported`);
                else {
                    if (config.modules[module].dependencies.length) config.modules[module].dependencies.forEach(dependency => {
                        if (!this._modules.hasOwnProperty(dependency)) {
                            console.error(`...error: ${dependency} not found!`);
                            dependencyValidation = false;
                        }
                    })

                    if (dependencyValidation) {
                        const resolve = await import(`./modules${config.modules[module].subPath}${module}.mjs`);
                        this._modules[module] = new resolve[module](this);
                        console.log(`...success!`);
                    } else errCount++;

                    dependencyValidation = true;
                }
            } catch (e) { console.error(`...error: unable to import!`); console.log(e); errCount++ }
        } else console.log('no modules to import');
        console.log(`== ${modulesList.length - errCount} of ${modulesList.length} module(-s) imported ==`);
    }

    foo(a) {
        // console.log(a)
        return a * 5;
    }
}

let a = await Core.init();
a.foo(123);
a.foo(456);
a.foo(789);
a.foo(666);
a.foo(777);

setTimeout(() => {}, 30*1000)