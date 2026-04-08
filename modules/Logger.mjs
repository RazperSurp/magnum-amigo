import BaseModule from './BaseModule.mjs';

export class Logger extends BaseModule {
    constructor(coreObject) { super(coreObject); }

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
                if (this.config.doAnnounceCalling) this.write(this.name, `Called ${moduleInstance.name}.${method}(${args.join(', ')}) ...processing`);
                let result = moduleInstance[`${method}_loggerUnwrapped`](...args);
                if (this.config.doAnnounceCalling) this.write(this.name, `Called ${moduleInstance.name}.${method}(${args.join(', ')}) - got ${result ?? 'null'}`);
                return result;
            }
            
            if (this.config.doAnnounceWrapping) this.write(this.name, `Wrapped ${moduleInstance.name}.${method}()`);
        }

        moduleInstance.write = (data, type = 'log') => { this.write(moduleInstance.name, data, type); }
    }

    write(module, data, type = 'log') {
        console[type](`${this.config.doAddTimestamp ? `<${Math.floor(Date.now() / 1000)}> ` : ''}${module}: ${data}`);
    }
}