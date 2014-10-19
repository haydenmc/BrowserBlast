interface SignalR {
	gameHub: any;
} 

class GameHub {
	private game: Game;
	private hub = $.connection.gameHub;
	private ready: boolean = false;

	constructor(game: Game) {
		this.game = game;
		// Set up methods
		this.hub.client.addPointer = (connectionId: string) => { this.addPointer(connectionId); };
		this.hub.client.removePointer = (connectionId: string) => { this.removePointer(connectionId); };
		this.hub.client.updatePointer = (connectionId: string, x: number, y: number) => { this.updatePointer(connectionId, x, y); };
		this.hub.client.loadLevel = () => { this.loadLevel(); };
		this.hub.client.killElement = (id: string) => { this.killElement(id); };
	}

	public connect() {
		$.connection.hub.start().done(() => {
			this.ready = true;
		});
	}

	/* Client-side methods */
	public addPointer(connectionId: string) {
		this.game.addPointer(connectionId);
	}

	public removePointer(connectionId: string) {
		this.game.removePointer(connectionId);
	}

	public updatePointer(connectionId: string, x: number, y: number) {
		this.game.updatePointerPosition(connectionId,x, y);
	}

	public loadLevel(): void {
		this.game.iframe.src = "/Relay";
	}

	public killElement(id: string): void {
		console.log("KILL ELEMENT " + id);
		this.game.killElementById(id);
	}

	/* Server-side methods */
	public updateMyPointer(x: number, y: number) {
		if (this.ready) {
			this.hub.server.updatePointer(x, y);
		}
	}

	public sendKillElement(id: string) {
		if (this.ready) {
			this.hub.server.killElement(id);
		}
	}
}