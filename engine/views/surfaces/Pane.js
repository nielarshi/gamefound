class Pane {
	constructor(options) {
		this.setOptions(options);
		this.children = [];
		console.log('This is Pane class');
	}

	setBackgroundColor(color) {
		this.backgroundColor = color;
	}

	setPosition(position) {
		this.position = position;
	}

	setIndex(index, parentId) {
		this.index = index;
		this.element.id = parentId + "_id" + index;
	}

	setOptions(options) {
		this.setDimension((options && options.dimension) ? options.dimension : this.dimension);
		this.setPosition(options.position);
		this.setBackgroundColor(options.backgroundColor);
	}

	setDimension(dimension) {
		this.dimension = dimension
	}

	getDimension() {
		return this.dimension;
	}

	addChild(child) {
		child.setPosition({
			x : this.position.x + child.position.x,
			y : this.position.y + child.position.y
		});
		this.children.push(child);
	}

	removeChild(child) {
		var index = this.children.indexOf(child);
		this.children.splice(index, 1);
	}

	getChild(index) {
		return this.children[index];
	}

	handleOverlapping() {
		console.log("Length", this.children.length);
		var ele = this;
		var result = {
			items : []
		};
		var child;
		for(var i=0; i<this.children.length; i++) {
			child = this.children[i];
			if (child.isOverlapping) {
				result.items.push(child);
			};
		}
		if (result.items.length > 1) {
			var tags = [];
			result.items.forEach(function(item) {
				tags.push(item.tag);
			}); 
				
			var event = new CustomEvent(Events.COLLISSION, 
				{ 
					"detail" : { 
						position : result.items[0].position,
						dimension : result.items[0].dimension,
						tags : tags
					} 
				} 
			);
			window.dispatchEvent(event);
		};
		
	}

	removeOverlappingChildren() {
		var result = {
			items : []
		};
		var child;
		for(var i=0; i<this.children.length; i++) {
			child = this.children[i];
			if (child.isOverlapping) {
				result.items.push(child);
			};
		}
		var ele = this;
		result.items.forEach(function(item) {
			var index = ele.children.indexOf(item);
			ele.children.splice(index, 1);
		});
	}

	removeDraggingChild() {
		console.log("Checking for removing dragging", this);
		var items = [];
		for(var i=0; i<this.children.length; i++) {
			if(this.children[i].dragging) {
				items.push(this.children[i]);
			}
		}
		var ele = this;
		items.forEach(function(item, index) {
			ele.children.splice(index, 1);
		});
	}

	initiateDragAt(mouseX, mouseY) {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].initiateDragAt(mouseX, mouseY);
		}
		var items = [];
		for(var i=0; i<this.children.length; i++) {
			if (this.children[i].copyCreated) {
				console.log("Removing", this.children[i]);
				items.push(this.children[i]);
			}
		}
		var ele = this;
		items.forEach(function(item) {
			var index = ele.children.indexOf(item);
			ele.children.splice(index, 1);
		});
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
		//console.log("drawing pane");
		context.fillStyle = this.backgroundColor;
		context.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
		for(var i=0; i<this.children.length; i++) {
			this.children[i].draw(context);
		}
	}

}