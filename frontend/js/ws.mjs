import config from '../../config.json' with { type: 'json' }

class SocketClient {
    _id;
    _name;
    _token;
    _status;
    _connection;
    _metClients;


    constructor() {
        this._connection = SocketClient.open();
        this._connection.onopen = this.socketOnOpen;
        this._connection.onclose = this.socketOnClose;
        this._connection.onerror = this.socketOnError;
        this._connection.onmessage = this.socketOnMessage;
    }

    static open() {
        return new WebSocket(`ws://${window.location.host}:8082`);
        
    }

    
    socketOnOpen(event) {
    }

    socketOnClose(event) {
        window._OS.socketClient._appendToHistory('websocket connection closed. reconnecting', { isLog: true, sender: { module: 'SOCKET' } });
        window._audioFiles.socket.disconnected.play();

        window._OS.socketClient.containers.status.innerText = 'offline';
    }

    socketOnError(event) {
        window._OS.socketClient._appendToHistory('websocket connection error!', { isLog: true, sender: { module: 'SOCKET' } });
        console.error(event);
        
        window._OS.socketClient.socketOnClose(event);
    }
    
    socketOnMessage(event) {
        let input = JSON.parse(event.data);

        switch (input.type) {
            case 'WS_AUTH': window._OS.socketClient.auth(input.data); break;
            case 'WS_AUTH_SUCCESS': window._OS.socketClient.id = input.data.id; break;
            case 'WS_AUTH_UPDATE': 
                for (const [key, value] of Object.entries(input.data)) window._OS.socketClient.updateWSAuth(key, value); 
                break;
            case 'USERS': window._OS.socketClient.actualizeAddresses(input.data); break;
            case 'MESSAGE_LOG':
            case 'MESSAGE_CHAT': 
                let messageBlock = createMessageBlock({ style: { color: input.data.color ?? 'inherit' }, text: `${input.data.from}@${input.data.to}` }, { text: `: ${input.data.text}` }); 
                window._OS.socketClient._appendToHistory(messageBlock, input.type == 'MESSAGE_LOG');
                if (input.type == 'MESSAGE_CHAT') window._audioFiles.message.got.play();
                break;
            case 'PROCESS_LOCK':
            case 'PROCESS_UNLOCK': 
                // let messageBlock = createMessageBlock({ style: { color: input.data.color ?? 'inherit' }, text: `${input.data.from}@${input.data.to}` }, { text: `: ${input.data.text}` }); 
                // window._OS.socketClient._appendToHistory(messageBlock, input.type == 'MESSAGE_LOG');
                // if (input.type == 'MESSAGE_CHAT') window._audioFiles.message.got.play();
                break;
            default: break;
        }
    }
    
}
// window.