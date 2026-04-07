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
    }

    constructor(coreObject) {
        super(coreObject);
    }

    start() {
        this._server = new WebSocketServer({ port: this.config.port });
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
        socket.alive = true;
        socket.token = this._core.Toolbox.generateRandomString();
        socket.socketClient = () => { return this._core.SocketClientTable.findByToken(socket.token) }


    }

    prepareOutputMessage(data, type ) {

    }

    pulse() {

    }
}