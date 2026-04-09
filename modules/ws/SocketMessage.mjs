import config from "../../config.json" with { type: 'json' }
import BaseModule from "../BaseModule.mjs";

export class SocketMessage extends BaseModule {
    static types() { return config.websocket_message_types;  }
    static defaultType() { return this.types.unspecified; }

    static newInput(coreObject, json) {
        return new SocketMessage(coreObject, json);
    }

    static newOutput(coreObject, data, type = null) {
        let instance = new SocketMessage(coreObject);
        instance.data = data;
        instance.type = type;

        return instance;
    } 

    #isOutput;
    get isOutput() { return this.#isOutput }

    #type = SocketMessage.defaultType;
    get type() { return this.#type }
    set type(value) {
        if (value === null || value === undefined) {
            this.#type = SocketMessage.defaultType;
        } else if (!Object.values(this.types).find(type => type !== value)) {
            this.write(`Type "${value}" is unknown. Using ${SocketMessage.defaultType} (unspecified) instead`, `warn`);
            this.#type = SocketMessage.defaultType;
        } else this.#type = value;
    }



    data = {};
    
    get body() { return { type: this.type, data: this.data } }
    get json() { return JSON.stringify(this.body) }

    constructor(coreObject, incomingJson = null) {
        super(coreObject);

        this.#isOutput = incomingJson === null; 
        if (!this.#isOutput) this.parseInput(incomingJson);
    }

    parseInput(json) {
        const message = JSON.parse(json);
        this.type = message.type;
        this.data = message.data;

        switch (this.type) {
            case this.types.unspecified:
                break;
            case this.types.authRequest:
                break;
            case this.types.requestUsers:
                break;
            case this.types.userActivityPause:
                break;
            case this.types.userActivityResume:
                break;
            default: 
                this.write(`Got unknown type of message: ${this.type}, ${this.config.doParseUnknownAsUnspecified ? 'parsing as unspecified' : 'skipping'}`, 'warn');
                if (this.config.doParseUnknownAsUnspecified) {/* ... why did i added this setting? */}
        }
    }   
}