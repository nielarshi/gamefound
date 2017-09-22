class Panel {
	constructor(options) {
		console.log('This is a Panel', this);
		this.setOptions(options);
		this.element = document.createElement('canvas');
		this.element.style.width = this.dimension.width;
		this.element.style.height = this.dimension.height;
		this.element.id = options.id;
		this.children = [];
	}

	setOptions(options) {
		this.setPosition(options.position);
		this.setDimension(options.dimension);
	}

	setId(id) {
		this.id = id;
		if (this.element) {
			this.element.id = id;
		};
	}

	getId() {
		return this.id;
	}

	setDimension(dimension) {
		this.dimension = dimension;
	}

	setPosition(position) {
		this.position = position;
	}

	setLayout(layout) {
		this.layout = layout;
		this.layout.parent = this;
	}

	init(shape, options) {
		//create child elements as per row and column
		this.layout.init(shape, options);
	}

	getChild(index) {
		return this.children[index];
	}

	addChild(child, parent) {
		if (!parent) {
			console.log("Adding", child, "to Panel");
			this.children.push(child);
		} else {
			console.log("Adding", child, "to", parent);
			parent.addChild(child);
		}
	}


	removeChild(child, parent) {
		if (parent) {
			parent.removeChild(child);
		} else {
			if (this.element) {
				this.element.removeChild(child);
				var index = this.children.indexOf(child);
				this.children.splice(index, 1);
			};
		}
	}

	addEvent(child, force) {
		if (this.initialDragAbility || force) {
			//new Draggable(child, this.dragHelper.dragStart, this.dragHelper.drag, this.dragHelper.dragEnd.bind(this.element));
		}
	}

	addEvents(callbackHelper, initialDragAbility) {
		this.initialDragAbility = initialDragAbility;
		this.dragHelper = callbackHelper;
	}

	handleOverlapping() {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].handleOverlapping();
		}
	}

	removeOverlappingChildren() {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].removeOverlappingChildren();
		}
	}

	removeDraggingChild() {
		console.log("Checking for removing dragging", this.children);
		var items = [];
		for(var i=0; i<this.children.length; i++) {
			if(this.children[i].dragging) {
				items.push(this.children[i]);
			}
		}
		items.forEach(function(item, index) {
			this.children.splice(index, 1);
		});
		for(var i=0; i<this.children.length; i++) {
			this.children[i].removeDraggingChild();
		}
	}

	initiateDragAt(mouseX, mouseY) {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].initiateDragAt(mouseX, mouseY);
		}
	}

	dragAt(mouseX, mouseY, offset) {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].dragAt(mouseX, mouseY, offset);
		}
	}

	stopDrag() {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].stopDrag();
		}
	}

	draw(context) {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].draw(context);
		}
	}
}