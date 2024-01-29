export class ServerAPI {

    /**
     * Calls *create* API on the server and returns id of the new lobby. 
     */
    static async createLobby(): Promise<Response> {
        return await this.callAPI('create');
    }

    /**
    * Calls *game/join* api to get id from a join code. 
    * @returns Lobby id associated with target join code.
    */
    static async getLobbyIdFromCode(joinCode: number): Promise<Response> {
        return await this.callAPI(`game/join/${joinCode}`);
    }

    /**
     * Calls *game/getJoinCode* to get lobby join code from lobby id.
     * @returns Join code associated with target lobby.
     */
    static async getLobbyJoinCode(lobbyId: string): Promise<Response> {
        return await this.callAPI(`game/getJoinCode/${lobbyId}`);
    }

    private static async callAPI(path: string): Promise<Response> {
        const uri = import.meta.env.VITE_SERVER_URI;
        const port = import.meta.env.VITE_SERVER_PORT

        const response = await fetch(`http://${uri}:${port}/api/${path}`);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response;
    }
}