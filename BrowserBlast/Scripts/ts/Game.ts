class Game {
	private pointers: { [connectionId: string]: Pointer } = {};
	private hub: GameHub;
	constructor() {
		this.hub = new GameHub(this);
		window.onmousemove = (e) => {
			this.updateMyPointer(e.x, e.y);
		};
		this.hub.connect();
	}

	public updateMyPointer(x: number, y: number) {
		this.hub.updateMyPointer(x,y);
	}

	public addPointer(connectionId: string): boolean {
		this.pointers[connectionId] = new Pointer();
		return true;
	}

	public removePointer(connectionId: string): boolean {
		this.pointers[connectionId].destroy();
		this.pointers[connectionId] = null;
		return true;
	}

	public getPointerById(connectionId: string): Pointer {
		return this.pointers[connectionId];
	}
}
window.onload = () => {
	new Game(); // Start 'er up.
};