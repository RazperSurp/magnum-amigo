import { ClientSocketMessage } from "./ClientSocketMessage.mjs";

export class ClientSocketClient {
    _id;
    _token;
    _isAlive;
    _isActive;
    get isActive() { return this._isActive }
    set isActive(value) { 
        this._isActive = !!(value);
        console.log(this._isActive);
        if (this._isAlive) {
            this.send({}, ClientSocketMessage.types[this.isActive ? 'userActivityResume' : 'userActivityPause'] )
        }
    }

    _connection;

    set userData(value) {
        window.localStorage.setItem('ws_auth', JSON.stringify(value));
        this._id = value.id;
        this._token = value.token;
        this._isAlive = value.isAlive;
        this._isActive = value.isActive;
    }
    get userData() {
        let json = window.localStorage.getItem('ws_auth');
        return json ? JSON.parse(json) : {}
    }


    constructor() {
        this._connection = ClientSocketClient.open();

        this._connection.onopen = e => { this.socketOnOpen(e) }
        this._connection.onclose = e => { this.socketOnClose(e) }
        this._connection.onerror = e => { this.socketOnError(e) }
        this._connection.onmessage = e => { this.socketOnMessage(e) }
    }

    static open() { 
        return new WebSocket(`ws://${window.location.host}:8082`);
    }

    
    socketOnOpen(event) {
        this.send(this.userData, ClientSocketMessage.types.authRequest);

    }

    socketOnClose(event) {
        console.log(event);
    }

    socketOnError(event) {
        console.error(event);
    }
    
    socketOnMessage(event) {
        const message = ClientSocketMessage.newInput(event);
        if (message.type == ClientSocketMessage.types.authSuccess) {
            this.userData = message.data;
            document.addEventListener('visibilitychange', () => { this.isActive = !document.hidden; });
        }
    }

    send(data = {}, type = null) { 
        this._connection.send(ClientSocketMessage.newOutput(data, type).json);
    } 
}
// window.