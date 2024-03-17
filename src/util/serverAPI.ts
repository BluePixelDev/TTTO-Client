export default class ServerAPI {

    /**
     * Calls *create* API on the server and returns id of the new lobby. 
     */
    static async createLobby(size: number, data: Record<string, any>): Promise<Response> {
        return await this.postAPI('create-lobby', { lobbySize: size, data});
    }

    /**
     * Checks if lobby with given join code exists.
     */
    static async checkLobby(joinCode: number): Promise<Response> {
        return await this.callAPI(`check/${joinCode}`);
    }

    /**
    * Calls *game/join* api to get id from a join code. 
    * @returns Lobby id associated with target join code.
    */
    static async getLobbyIdFromCode(joinCode: number): Promise<Response> {
        return await this.callAPI(`lobby/${joinCode}`);
    }

    /**
     * Calls *game/getJoinCode* to get lobby join code from lobby id.
     * @returns Join code associated with target lobby.
     */
    static async getLobbyJoinCode(lobbyId: string): Promise<Response> {
        return await this.callAPI(`lobby/code/${lobbyId}`);
    }

    private static async callAPI(path: string): Promise<Response> {
        const uri = import.meta.env.VITE_SERVER_URI
        const port = import.meta.env.VITE_SERVER_PORT

        const response = await fetch(`http://${uri}:${port}/api/${path}`);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response;
    }

    private static async postAPI(path: string, data: Record<string, any>): Promise<Response> {
        const uri = import.meta.env.VITE_SERVER_URI
        const port = import.meta.env.VITE_SERVER_PORT

        const response = await fetch(`http://${uri}:${port}/api/${path}`, {
            method: 'POST', // or 'GET' depending on your API
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'cors'
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response;
    }
}