import BaseModule from '../BaseModule.mjs';
import { WebSocketServer } from 'ws';

export class SocketServer extends BaseModule {

    _server;
    _pulseInterval;

    _heartbeat;
    get heartbeat() { return this._heartbeat; }
    set heartbeat(value) {
        if (this._pulseInterval !== null && this._pulseInterval !== undefined) clearInterval(this._pulseInterval);

        this._heartbeat = value;
        this._pulseInterval = setInterval(this.pulse, 1000 * this.heartbeat);
        this.write(`Heartbeat interval set to ${this._heartbeat}`);
    }

    static _idGenerator = null;
    static get idNext() {
        if (SocketServer._idGenerator === null) SocketServer._idGenerator = SocketServer.socketIdConnectionGenerator();
        return SocketServer._idGenerator.next().value;
    }

    constructor(coreObject) {
        super(coreObject);
    }

    start() {
        this._server = new WebSocketServer({ port: this.config.port });
        this.write(`Server listening on :${this.config.port}`);

        this._server.on('connection', this._onConnection);

        this.heartbeat = this.config.heartbeat;
    }

    _onConnection(socket) {
        this.#authUser(socket);

        socket.on('pong', this._onPong);
        socket.on('close', this._onClose);
        socket.on('message', this._onMessage);
    }

    _onClose(event) {}
    
    _onMessage(event) {}
    
    _onPong(event) {}

    #authUser(socket) {
        socket.id = SocketServer.idNext;
        socket.alive = true;
        socket.token = this._core.Toolbox.generateRandomString();
        socket.socketClient = () => { return this._core.SocketClientTable.findByToken(socket.token) }

        this.sendToSocket(socket, { token: socket.token, id: socket.id }, this._core.config.websocket_message_types.auth_request);
    }

    prepareOutputMessage(data, type ) {

    }

    pulse() {

    }

    sendToSocket(socket, data, type = null) {
        const defaultTypeCode = this._core.config.websocket_message_types.unspecified;

        if (type !== null && !Object.values(this._core.config.websocket_message_types).find(code => code === type)) {
            this.write(`Message type code "${type}" is unknown. Using "unspecified": "${defaultTypeCode}"`, 'warn');
            type = defaultTypeCode;
        } else {
            const message = JSON.stringify({ type: type ?? defaultTypeCode, data: data });
            socket.send(message);
            if (this.config.doLogOutcomingMessages) {
                this.write(`+++[ ${type} -> ${socket.id} ]+++`);
                console.log(data);
                this.write(`---[ ${type} -> ${socket.id} ]---`);
            }
        }
    } 

    static* socketIdConnectionGenerator() {
        let i = 0;
        while (true) yield i++;
    }
}