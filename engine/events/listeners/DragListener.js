class DragListener {
	constructor(element, callback) {
		this.element = element;
		this.callback = callback;
		this.dragHandler = this.dragHandler.bind(this);
		element.addEventListener(Events.DRAG_INITIATED, this.dragHandler, false);
		element.addEventListener(Events.DRAG_ENDED, this.dragHandler, false);
		element.addEventListener(Events.COLLISSION, this.dragHandler, false);
	}

	dragHandler(event) {
		if (this.callback) {
			this.callback(event);
		};
	}
}