class Draggable {
	constructor(element, callbackStart, callbackDrag, callback) {
		this.element = element;
		this.callbackStart = callbackStart;
		this.callbackDrag = callbackDrag;
		this.callback = callback;
		this.mouseDownHandler = this.mouseDown.bind(this);
		this.mouseUpHandler = this.mouseup.bind(this);
		this.mouseMoveHandler = this.mouseMove.bind(this);
		element.addEventListener("mousedown", this.mouseDownHandler, false);
	}

	mouseDown(event) {
		window.addEventListener("mousemove", this.mouseMoveHandler, false);
		window.addEventListener("mouseup", this.mouseUpHandler, false);
		if (this.callbackStart) {
			this.callbackStart(event);
		};
	}

	mouseMove(event) {
		event.preventDefault();
		if (this.callbackDrag) {
			this.callbackDrag(event);
		};
	}

	mouseup(event) {
		event.preventDefault();
		window.removeEventListener("mousemove", this.mouseMoveHandler, false);
		this.element.addEventListener("mousedown", this.mouseDownHandler, false);
		window.removeEventListener("mouseup", this.mouseUpHandler, false);
		if (this.callback) {
			this.callback(event);
		};
	}
}