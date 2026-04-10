import BaseModule from "../BaseModule.mjs";

export class SocketConnection extends BaseModule {
    static _idGeneratorInstance = SocketConnection.idGeneratorFn();
    static get idNext() { return this._idGeneratorInstance.next().value }

    static* idGeneratorFn() {
        let i = 0;
        while (true) yield i++;
    }

    _id = SocketConnection.idNext;
    get id() { return this._id; }

    _isAuthorized = false;
    get isAuthorized() { return this._isAuthorized; }
    set isAuthorized(value) { this._isAuthorized = !!(value === true); }

    _isActive = true;
    get isActive() { return this._isActive; }
    set isActive(value) { this._isActive = !!(value === true); }

    _isAlive = true;
    get isAlive() { return this._isAlive; }
    set isAlive(value) { 
        this._isAlive = !!(value === true);
        if (!this._isAlive) this.socket 
    }

    _socket;
    get socket() { return this._socket; } 

    _socketClient;
    get socketClient() {
        return this._socketClient;    
    }

    get meta() {
        return {
            id: this.id,
            token: this.socketClient?.token,
            isAlive: this.isAlive,
            isActive: this.isActive
        }
    }
    
    constructor(coreObject, socket) {
        super(coreObject);

        this._socket = socket;
        this._socket.on('pong', this._onPong);
        this._socket.on('close', this._onClose);
        this._socket.on('message', this._onMessage);
    }

    _auth(message) {
        if (message.token) this._socketClient = this._core.SocketClientTable.find('token', message.token);
        if (!this._socketClient || !message.token) {
            this._socketClient = this._core.SocketClientTable.push(new this._core.SocketClient(this._core, message.token ?? this._core.Toolbox.generateRandomString()));
        }

        this._socketClient.pushSocketConnection(this);
        this.isAuthorized = true;

        this.send(this.meta, this._core.SocketMessage.types.authSuccess);
    }

    
    _onMessage(event) {
        if (this.isAlive) {
            const message = this._core.SocketMessage.newInput(this._core, event.toString());
            if (!this.isAuthorized && message.type == this._core.SocketMessage.types.authRequest) this._auth(message.data);
            else if (!this.isAuthorized && message.type != this._core.SocketMessage.types.authRequest) this.sendEmpty(this._core.SocketMessage.types.authUnauthorized);
            else {
                switch (message.type) {
                    case this._core.SocketMessage.types.userActivityPause:
                        this._isActive = false;
                        break;
                    case this._core.SocketMessage.types.userActivityResume:
                        this._isActive = true;
                        break;
                    default:
                }
            }
        }
    }
    
    _onPong(event) { this.isAlive = true }
    _onClose(event) { this.destroy() }
    
    sendEmpty(type) {
        return this.send({}, type)
    }

    send(data = {}, type = null) {
        let message = this._core.SocketMessage.newOutput(this._core, data, type);

        this._socket.send(message.json);
        if (this.config.doLogOutcomingMessages) {
            this.write(`+++[ ${message.type} -> ${this.socket.id} ]+++`);
            console.log(message.data);
            this.write(`---[ ${message.type} -> ${this.socket.id} ]---`);
        }
    } 
}