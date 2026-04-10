import BaseModule from '../BaseModule.mjs';
import { WebSocketServer } from 'ws';
import { SocketConnection } from './SocketConnection.mjs';

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
        this.heartbeat = this.config.heartbeat;

        this._server = new WebSocketServer({ port: this.config.port });
        this._server.on('connection', socket => {  new SocketConnection(this._core, socket); });

        this.write(`Server is now listening on :${this.config.port}`);
    }

    pulse() {
        console.log(this._core.SocketClientTable.items);
        return this._core.SocketClientTable.items.length;
    }
}