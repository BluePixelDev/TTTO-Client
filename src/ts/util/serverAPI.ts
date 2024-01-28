export class ServerAPI {
    static async createLobby() : Promise<Response> {
        return await this.callAPI('create');
    }

    static async getLobbyIdFromCode(joinCode: number) : Promise<Response> {
        return await this.callAPI(`game/join/${joinCode}`);
    }

    static async getLobbyJoinCode(lobbyId: string) : Promise<Response> {
        return await this.callAPI(`game/getJoinCode/${lobbyId}`);
    }

    private static async callAPI(path: string) : Promise<Response> {
        const uri = import.meta.env.VITE_SERVER_URI;
        const port = import.meta.env.VITE_SERVER_PORT
        return await fetch(`http://${uri}:${port}/api/${path}`);;
    }
}