class Pointer {
	private element: HTMLImageElement;
	private x: number;
	private y: number;
	constructor() {
		// Start at (0,0)
		this.x = 0;
		this.y = 0;

		// Add the element
		this.element = <HTMLImageElement>document.body.appendChild(document.createElement("img"));
		this.element.classList.add("pointer");
		this.element.src = "/Content/img/pointer.png";
	}

	/**
	 * Updates the position of this pointer in styles
	 */
	public updatePosition(newX: number, newY: number) {
		this.x = newX;
		this.y = newY;
		this.element.style.left = this.x + "px";
		this.element.style.top = this.y + "px";
	}

	/**
	 * Destroys this pointer element
	 */
	public destroy(): void {
		this.element.parentElement.removeChild(this.element);
	}
} 