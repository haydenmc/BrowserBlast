﻿class Game {
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
		this.hub.connect();
		this.iframe = document.getElementsByTagName("iframe")[0];
		this.mouseUpdateIntervalHandle = setInterval(() => {
			this.updateMyPointer();
		}, 100);
	}

	public processIFrame(window: Window) {
		console.dir(window.document);

		var newNode = <HTMLElement>window.document.body.cloneNode(true);
		window.document.body.parentNode.replaceChild(newNode, window.document.body);

		window.document.addEventListener("mousemove", (e: MouseEvent) => {
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
		});

        var list: Array<string> = ["a", "img", "p", "h1", "h2","h3", "button", "input", "li"];
        for (var j = 0; j < 8; j++)
        {
            var listOfLinks = window.document.getElementsByTagName(list[j]);
            console.dir(listOfLinks);
            for (var i = 0; i < listOfLinks.length; i++) {
                ((link: Node) => {
                    //link.attributes["href"] = "";
                    (<HTMLElement>link).setAttribute("href", "javascript:;");
                    (<HTMLElement>link).setAttribute("target", "");
                    //var newLink = <HTMLElement> link.cloneNode(true);
                    //newLink.parentNode.replaceChild(newLink, link);

                    (<HTMLElement>link).addEventListener("click", () => { this.killElement(<HTMLElement>link); }, false);
                })(listOfLinks[i]);
            }
        }
        
		/*var listOfLinks = window.document.getElementsByTagName("a");
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
		}*/
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