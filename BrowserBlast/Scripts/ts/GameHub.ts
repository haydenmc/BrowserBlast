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
	}

	public connect() {
		console.log("DING!");
		$.connection.hub.logging = true;
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
		console.log("update received");
		this.game.updatePointerPosition(connectionId,x, y);
	}

	/* Server-side methods */
	public updateMyPointer(x: number, y: number) {
		if (this.ready) {
			this.hub.server.updatePointer(x, y);
		}
	}
}