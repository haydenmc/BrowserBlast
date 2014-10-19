class Game {
	public static instance: Game;
	public iframe: HTMLIFrameElement;
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
		this.iframe = document.getElementsByTagName("iframe")[0];
		this.mouseUpdateIntervalHandle = setInterval(() => {
			this.updateMyPointer();
		}, 32);
	}

	public processIFrame(window: Window) {
		console.dir(window.document);

		var newNode = <HTMLElement>window.document.body.cloneNode(true);
		window.document.body.parentNode.replaceChild(newNode, window.document.body);

		var listOfLinks = window.document.getElementsByTagName("a");
		console.dir(listOfLinks);
		for (var i = 0; i < listOfLinks.length; i++)
		{
			((link: HTMLElement) =>
			{
				//link.attributes["href"] = "";
				link.setAttribute("href", "javascript:;");
				link.setAttribute("target", "");
				//var newLink = <HTMLElement> link.cloneNode(true);
				//newLink.parentNode.replaceChild(newLink, link);
				
				link.addEventListener("click", () => { this.killElement(link); }, false);
			})(listOfLinks[i]);
		}

		var listOfImages = window.document.getElementsByTagName("img");
		for (var i = 0; i < listOfImages.length; i++)
		{
			((image: HTMLElement) =>
			{
				//link.attributes["href"] = "";
				image.setAttribute("href", "#");
				image.setAttribute("target", "");
				//var newLink = <HTMLElement> link.cloneNode(true);
				//newLink.parentNode.replaceChild(newLink, link);

				image.addEventListener("click", () => { this.killElement(image); }, false);
			})(listOfImages[i]);
		}
	}

	public killElement(link: HTMLElement)
	{
		console.log("worked");
		link.parentElement.removeChild(link);
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