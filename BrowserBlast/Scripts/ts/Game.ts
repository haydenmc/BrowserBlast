class Game {
	public static instance: Game;
	public iframe: HTMLIFrameElement;
	private document: Document;
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

        var list: Array<string> = ["a", "img", "p", "h1", "h2","h3", "button", "input", "li", "label"];
        for (var j = 0; j < list.length; j++)
        {
            var listOfLinks = window.document.getElementsByTagName(list[j]);
            console.dir(listOfLinks);
            for (var i = 0; i < listOfLinks.length; i++) {
                ((link: Node) => {
                    (<HTMLElement>link).setAttribute("href", "javascript:;");
                    (<HTMLElement>link).setAttribute("target", "");

                    (<HTMLElement>link).addEventListener("click", () => { this.killElement(<HTMLElement>link); }, false);
                })(listOfLinks[i]);
            }
        }
	}

	public killElement(link: HTMLElement)
	{
		console.log("worked");
		link.parentElement.removeChild(link);
	}

	public killElementById(id: string)
	{
		var toBeDeleted = this.document.getElementById(id);
		toBeDeleted.parentElement.removeChild(toBeDeleted);
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