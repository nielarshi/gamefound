var DEFAULT_OPTIONS_BODY = {
	position : {
		x : 10,
		y : 10
	},
	dimension : {
		width : 50,
		height : 50
	},
	image : "",
	imageSrc : false,
	isDraggable : true,
	isFixed : false,
	isOverlapping : false,
	drawTag : true,
	drawTexts : true,
	backgroundColor : 'black'
};

class Body {
	constructor(options) {
		this.setOptions(DEFAULT_OPTIONS_BODY);
		if (options) {
			this.setOptions(options);
		};
	}

	setBackgroundColor(backgroundColor) {
		this.backgroundColor = backgroundColor;
	}

	setPosition(position) {
		this.position = position;
	}

	setOffset(offset) {
		this.offset = offset;
	}

	setTag(tag) {
		this.tag = tag;
	}

	setText(text) {
		this.text = text;
	}

	setIndex(index, parentId) {
		this.index = index;
		this.element.id = parentId + "_id" + index;
	}

	setTemp(isTemp) {
		this.isTemp = isTemp;
	}

	setOptions(options) {
		this.setDimension((options && options.dimension) ? options.dimension : this.dimension);
		this.setPosition(options.position);
		this.setImage(options.image);
		this.setFixed(options.isFixed);
		this.setDraggable(options.isDraggable);
		this.setDragging(options.dragging);
		this.setTag(options.tag);
		this.setOverlapping(options.isOverlapping);
		this.setOffset({ x : 0, y : 0 });
		this.setTemp(options.isTemp);
		this.drawTag = options.drawTag;
		this.text = options.text;
		this.drawTexts = options.drawTexts;
		this.setImageSrc(options.imageSrc);
		this.setBackgroundColor(options.backgroundColor ? options.backgroundColor : DEFAULT_OPTIONS_BODY.backgroundColor);
	}

	setImageSrc(imageSrc) {
		if (!imageSrc) {
			this.imageSrc = false;
			return;
		};
		this.imageSrc = true;
		this.image = new Image();
		this.image.src = imageSrc;
	}

	setDraggable(isDraggable) {
		this.isDraggable = isDraggable;
	}

	setDragging(dragging) {
		this.dragging = dragging;
	}

	setFixed(isFixed) {
		this.isFixed = isFixed;
	}

	setDimension(dimension) {
		this.dimension = dimension;
	}

	setOverlapping(isOverlapping) {
		this.isOverlapping = isOverlapping;
	}

	setImage(image) {
		this.image = image;
	}

	getDimension() {
		return this.dimension;
	}

	/**
		This method triggers event when the body starts dragging on met condition

	**/
	initiateDragAt(mouseX, mouseY) {

		if (!this.isDraggable) {
			return;
		}
		var dx = mouseX - this.position.x;
		var dy = mouseY - this.position.y;
		
		//it's a hit if dx, dy lies inside rectangle
		if ((dx >= 0 && dx <= this.dimension.width) &&
			(dy >= 0 && dy <= this.dimension.height)) {
			this.dragging = true;
			var offset = {
				x : dx,
				y : dy
			};
			if (!this.isFixed) {
				this.copyCreated = true;
			}
			this.dragging = false;
			var event = new CustomEvent(Events.DRAG_INITIATED, 
				{ 
					"detail" : { 
						position : {
							x : mouseX,
							y : mouseY
						},
						offset : offset,
						dimension : this.dimension,
						image : this.image,
						isDraggable : true,
						dragging : true,
						isFixed : false,
						isOverlapping : true,
						tag : this.tag,
						isTemp : true
					} 
				} 
			);
			window.dispatchEvent(event);
		} else {
			this.dragging = false;
			this.copyCreated = false;
		}
	}

	dragAt(mouseX, mouseY, offset) {
		if (this.dragging) {
			this.position = {
				x : mouseX,
				y : mouseY
			}
		}

		if (!offset) {
			offset = this.offset;
		};

		var dx = mouseX - this.position.x;
		var dy = mouseY - this.position.y;

		if (((dx >= (0 - offset.x + 10) && dx <= (this.dimension.width + offset.x + 10)) &&
			(dy >= (0 - offset.y + 10) && dy <= (this.dimension.height + offset.y + 10)))) {
			this.isOverlapping = true;
		} else {
			this.isOverlapping = false;
		}
	}

	/**
		This method triggers event when the body stops dragging on met condition

	**/
	stopDrag() {
		this.dragging = false;
		this.copyCreated = false;
		if (this.isOverlapping) {
			//dispatch event so that new item can be formed
			var event = new CustomEvent(Events.DRAG_ENDED, 
				{ 
					"detail" : { 
						position : this.position,
						dimension : this.dimension,
						tag : this.tag
					} 
				} 
			);
			window.dispatchEvent(event);
		}
		this.position = {
			x : this.position.x - this.offset.x,
			y : this.position.y - this.offset.y
		}
		this.offset = { x : 0, y : 0 };
		this.isOverlapping = false;
	}

	draw(context) {
		this.context = context;
		this.drawDefault(context);
		this.drawImage(context);
		this.drawTagText(context);
		this.drawText(context);
	}

	drawDefault(context) {
		if (!this.image) {
			context.fillStyle = this.backgroundColor;
			context.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
		}
	}

	drawImage(context) {
		if (this.image) {
			context.strokeStyle = '#f00';
			if (this.isOverlapping && !this.fixed) {
				context.globalAlpha = 0.5;
				context.strokeRect(this.position.x - this.offset.x, this.position.y - this.offset.y, this.dimension.width, this.dimension.height);
			} else {
				context.globalAlpha = 1;
			}
			context.drawImage(this.image, this.position.x - this.offset.x, this.position.y - this.offset.y, this.dimension.width, this.dimension.height);
		}
	}

	drawTagText(context) {
		if (this.drawTag) {
			context.font = "14px Arial";
			context.fillStyle = "gray";
			context.fillText(this.tag, this.position.x + this.dimension.width + 20, (this.position.y + this.dimension.height/2 + 10));
		}
	}

	drawText(context) {
		if (this.drawTexts) {
			context.font = "14px Arial";
			context.fillStyle = "gray";
			context.fillText(this.text, this.position.x + this.dimension.width + 20, (this.position.y + this.dimension.height/2 + 10));
		}
	}

}