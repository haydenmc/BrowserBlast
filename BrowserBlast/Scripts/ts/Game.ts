class Game {
	public static instance: Game;
	private pointers: { [connectionId: string]: Pointer } = {};
	private hub: GameHub;
	private mouseUpdateIntervalHandle: number;
	private mouseX: number;
	private mouseY: number;

	constructor() {
		Game.instance = this;
		this.hub = new GameHub(this);
		window.onmousemove = (e) => {
			this.mouseX = e.pageX;
			this.mouseY = e.pageY;
		};
		this.hub.connect();
		this.mouseUpdateIntervalHandle = setInterval(() => {
			this.updateMyPointer();
		}, 32);
	}

	public processIFrame(node: Node) {
		console.dir(node);
	}

	public updateMyPointer() {
		this.hub.updateMyPointer(this.mouseX, this.mouseY);
	}

	public updatePointerPosition(connectionId: string, x: number, y: number) {
		var ptr = this.pointers[connectionId];
		if (typeof ptr !== 'undefined') {
			ptr.updatePosition(x, y);
		}
	}

	public addPointer(connectionId: string): boolean {
		if (typeof this.pointers[connectionId] !== 'undefined') {
			this.pointers[connectionId].destroy();
		}
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