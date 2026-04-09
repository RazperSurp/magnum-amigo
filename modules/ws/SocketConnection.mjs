import BaseModule from "../BaseModule.mjs";

export class SocketConnection extends BaseModule {
    static _idGeneratorInstance = SocketConnection.idGeneratorFn();
    static get idNext() { return this._idGeneratorInstance.next().value }

    static* idGeneratorFn() {
        let i = 0;
        while (true) yield i++;
    }

    #id = SocketConnection.idNext;
    get id() { return this.#id; }

    #isAuthorized = false;
    get isAuthorized() { return this.#isAuthorized; }
    set isAuthorized(value) { this.#isAuthorized = !!(value === true); }

    #isActive = true;
    get isActive() { return this.#isActive; }
    set isActive(value) { this.#isActive = !!(value === true); }

    #isAlive = true;
    get isAlive() { return this.#isAlive; }
    set isAlive(value) { 
        this.#isAlive = !!(value === true);
        if (!this.#isAlive) this.socket 
    }

    #socket;
    get socket() { return this.#socket; } 

    #socketClient;
    get socketClient() {
        return this.#socketClient;    
    }

    get meta() {
        return {
            id: this.id,
            token: this.token,
            isAlive: this.isAlive,
            isActive: this.isActive
        }
    }
    
    constructor(coreObject, socket) {
        super(coreObject);

        this.#socket = socket;
        this.#socket.on('pong', this._onPong);
        this.#socket.on('close', this._onClose);
        this.#socket.on('message', this._onMessage);

        this.send()
    }

    #auth(message) {
        let socketClient; 
        if (message.token) socketClient = this._core.SocketClientTable.getOne('token', token);
        if (socketClient === null || !message.token) socketClient = this._core.SocketClientTable.push(new this._core.SocketClient(this._core, this._core.Toolbox.generateRandomString()));


        socketClient.pushSocketConnection(this);
        this.isAuthorized = true;

    }

    
    _onMessage(event) {
        if (this.isAlive) {
            const message = this._core.SocketMessage.newInput(this._core, event.toString());
            if (!this.isAuthorized && message.type == this._core.SocketMessage.types.authRequest) this.#auth(message);
            else if (!this.isAuthorized && message.type != this._core.SocketMessage.types.authRequest) this.sendEmpty(this._core.SocketMessage.types.authUnauthorized);
            else {

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

        this.#socket.send(message.json);
        if (this.config.doLogOutcomingMessages) {
            this.write(`+++[ ${type} -> ${socket.id} ]+++`);
            console.log(data);
            this.write(`---[ ${type} -> ${socket.id} ]---`);
        }
    } 
}