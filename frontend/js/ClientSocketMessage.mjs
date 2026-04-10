import config from "../../config.json" with { type: 'json' }

export class ClientSocketMessage {
    static get types() { return config.websocket_message_types;  }
    static get defaultType() { return ClientSocketMessage.types.unspecified; }

    static newInput(messageEvent) {
        return new ClientSocketMessage(messageEvent.data.toString());
    }

    static newOutput(data, type = null) {
        let instance = new ClientSocketMessage();
        instance.data = data;
        instance.type = type;

        return instance;
    } 

    _isOutput;
    get isOutput() { return this._isOutput }

    _type = ClientSocketMessage.defaultType;
    get type() { return this._type }
    set type(value) {
        if (value === null || value === undefined) {
            this._type = ClientSocketMessage.defaultType;
        } else if (!Object.values(ClientSocketMessage.types).find(type => type !== value)) {
            this._type = ClientSocketMessage.defaultType;
        } else this._type = value;
    }

    data = {};
    
    get body() { return { type: this.type, data: this.data } }
    get json() { return JSON.stringify(this.body) }

    constructor(incomingJson = null) {
        if (incomingJson !== null) {
            const body = JSON.parse(incomingJson);

            this._isOutput = true;
            this.type = body.type;
            this.data = body.data;
        }
    }
}