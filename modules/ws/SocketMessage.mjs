import config from "../../config.json" with { type: 'json' }
import BaseModule from "../BaseModule.mjs";

export class SocketMessage extends BaseModule {
    static get types() { return config.websocket_message_types;  }
    static get defaultType() { return SocketMessage.types.unspecified; }

    static newInput(coreObject, json) {
        return new SocketMessage(coreObject, json);
    }

    static newOutput(coreObject, data, type = null) {
        let instance = new SocketMessage(coreObject);
        instance.data = data;
        instance.type = type;

        return instance;
    } 

    _isOutput;
    get isOutput() { return this._isOutput }

    _type = SocketMessage.defaultType;
    get type() { return this._type }
    set type(value) {
        if (value === null || value === undefined) {
            this._type = SocketMessage.defaultType;
        } else if (!Object.values(SocketMessage.types).find(type => type !== value)) {
            this.write(`Type "${value}" is unknown. Using ${SocketMessage.defaultType} (unspecified) instead`, `warn`);
            this._type = SocketMessage.defaultType;
        } else this._type = value;
    }



    data = {};
    
    get body() { return { type: this.type, data: this.data } }
    get json() { return JSON.stringify(this.body) }

    constructor(coreObject, incomingJson = null) {
        super(coreObject);

        if (incomingJson !== null) {
            this._isOutput = false;

            const message = JSON.parse(incomingJson);
            this.type = message.type;
            this.data = message.data;

            console.log(this.body);
        }
    }
}