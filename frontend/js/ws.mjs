import config from '../../config.json' with { type: 'json' }

export class SocketClient {
    _id;
    _name;
    _token;
    _status;
    _connection;


    constructor() {
        this._connection = SocketClient.open();
        this._connection.onopen = e => { console.log(e); } // this.onOpen;
        this._connection.onclose = e => { console.log(e); } // this.onClose;
        this._connection.onerror = e => { console.log(e); } // this.onError;
        this._connection.onmessage = e => { console.log(e); } // this.onMessage;
    }

    static open() {
        return new WebSocket(`ws://${window.location.host}:8082`);
    }
}