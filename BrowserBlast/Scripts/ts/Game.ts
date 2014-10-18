class Game {
	private myPointer: Pointer;
	constructor() {
		this.myPointer = new Pointer();
		window.onmousemove = (e) => {
			this.updateMyPointer(e.x, e.y);
		};
	}

	public updateMyPointer(x: number, y: number) {
		this.myPointer.updatePosition(x,y);
	}
}
window.onload = () => {
	new Game(); // Start 'er up.
};