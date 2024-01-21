class ServerConnection {
    ws = new WebSocket(`ws://${import.meta.env.VITE_WEBSOCKET_URI}:${import.meta.env.VITE_WEBSOCKET_PORT}`);

    async fetchServerAPI(path : string) : Promise<Response>{
        return await fetch(`${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}/api/${path}`)
    }

    constructor(){
        console.log(import.meta.env.VITE_WEBSOCKET_URI)
    }
}

export default ServerConnection;