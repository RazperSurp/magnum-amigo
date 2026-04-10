import BaseModule from "../BaseModule.mjs";

export class SocketClient extends BaseModule {
    _token;
    get token() { return this._token }

    _socketConnections = [];
    get socketConnections() {
        if (!this._socketConnections) this._socketConnections = [];
        return this._socketConnections.filter(socketConnection => socketConnection.isActive);
    }

    constructor(coreObject, token) {
        super(coreObject);

        this._token = token;
    }

    pushSocketConnection(socketConnection) {
        this._socketConnections.push(socketConnection);
    }
}