import BaseModule from './BaseModule.mjs';

export class Logger extends BaseModule {
    constructor(coreObject) {
        super(coreObject);

        this.wrapMethods(this._core);
        for (const [module, instance] of Object.entries(this._core._modules))  this.wrapMethods(instance);
    }

    static _getClassMethods(toCheck) {
        const props = [];
        const blacklist = ['__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];
        
        let obj = toCheck;
        do { props.push(...Object.getOwnPropertyNames(obj)); } 
        while (obj = Object.getPrototypeOf(obj));
        
        return props.sort().filter((e, i, arr) => { if (e!=arr[i+1] && typeof toCheck[e] == 'function' && !blacklist.find(fn => fn === e)) return true; });
    }

    wrapMethods(moduleInstance){
        const moduleMethods = Logger._getClassMethods(moduleInstance);
        for (const method of moduleMethods){
            moduleInstance[`${method}_loggerUnwrapped`] = moduleInstance[method];

            moduleInstance[method] = (...args) =>{
                let result = moduleInstance[`${method}_loggerUnwrapped`](...args);
                console.log(`Logger: called ${moduleInstance.name}.${method}(${args.join(', ')}) - got ${result ?? 'null'}`);
                return result;
            }
            
            console.log(`Logger: wrapped ${moduleInstance.name}.${method}()`);
        }
    }
}