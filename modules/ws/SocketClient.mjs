import BaseModule from "../BaseModule.mjs";

export class SocketClient extends BaseModule {
    #token;
    get token() { return this.#token }

    _socketConnections = [];
    get allSocketConnections() { return this._socketConnections.filter(socketConnection => socketConnection.isAlive); }
    get socketConnections() { return this.allSocketConnections.filter(socketConnection => socketConnection.isActive); }

    constructor(coreObject, token) {
        super(coreObject);

        this.#token = token;
    }

    pushSocketConnection(socketConnection) {
        this._socketConnections.push(socketConnection);
    }
}