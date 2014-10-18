class Game {
	public static instance: Game;
	private pointers: { [connectionId: string]: Pointer } = {};
	public iframe: HTMLIFrameElement;
	private hub: GameHub;
	private mouseUpdateIntervalHandle: number;
	private mouseX: number = 0;
	private mouseY: number = 0;

	constructor() {
		Game.instance = this;
		this.iframe = document.getElementsByTagName("iframe")[0];
		this.hub = new GameHub(this);
		this.hub.connect();
		this.mouseUpdateIntervalHandle = setInterval(() => {
			this.updateMyPointer();
		}, 100);
	}

	public processIFrame(node: Node) {
		node.addEventListener("mousemove", (e: MouseEvent) => {
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
		});
		console.dir(node);
	}

	public updateMyPointer() {
		this.hub.updateMyPointer(this.mouseX, this.mouseY);
	}

	public updatePointerPosition(connectionId: string, x: number, y: number) {
		var ptr = this.pointers[connectionId];
		if (ptr != null) {
			ptr.updatePosition(x, y);
		}
	}

	public addPointer(connectionId: string): boolean {
		if (this.pointers[connectionId] != null) {
			this.pointers[connectionId].destroy();
		}
		this.pointers[connectionId] = new Pointer(this);
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