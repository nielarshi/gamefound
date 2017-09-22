class Snake {
	constructor(options) {
		this.children = [];
		this.setOptions(options);
	}

	setOptions(options) {
		this.setPosition(options.position);
		this.setHeadPosition(options.headPosition);
		this.setGrid(options.grid);
		this.addChildAt(this.headPosition.row, this.headPosition.column);
		for(var i = 1; i < options.initialLength; i++) {
			this.addAtTail();
		}
	}

	setPosition(position) {
		this.position = position;
	}

	setHeadPosition(headPosition) {
		this.headPosition = headPosition;
	}

	setGrid(grid) {
		this.grid = grid;
		console.log(this.grid);
	}

	addChildAt(row, column) {
		console.log(row, column);
		var cell = this.grid.cells[row][column];
		var body = new Body({
			position : cell,
			dimension : {
				width : this.grid.cellSize,
				height : this.grid.cellSize
			},
			tag : row + ":" + column,
			drawTag : false,
			isDraggable : false,
			isFixed : true,
			backgroundColor : 'green'
		});

		if (!this.head) {
			this.head = body;
			body.isSrc = true;
		} else {
			this.children.push(body);
			body.isDest = true;
		}
	}

	decreaseSize() {
		this.children.pop();
	}

	increaseSize() {
		this.addAtTail();
		this.addAtTail();
	}

	addAtTail() {
		var body;
		if (this.head && this.children.length == 0) {
			body = this.head;
		} else {
			body = this.children[this.children.length-1];
		}
		var position = body.tag.split(":");
		var row = Number(position[0]);
		var column = Number(position[1]) + 1;
		this.addChildAt(row, column);
	}

	popChild() {
		var body = this.children.pop();
		return body.tag.split(":");
	}

	stop() {
		this.move(false);
	}

	setDir(dir) {
		var wrongMove = false;
		if(this.dir) {
			if (this.dir == 'up' || this.dir == 'down') {
				if (dir == 'down' || dir == 'up') {
					wrongMove = true;
				};
			};

			if (this.dir == 'right' || this.dir == 'left') {
				if (dir == 'left' || dir == 'right') {
					wrongMove = true;
				};
			};
		}

		if (!wrongMove) {
			this.dir = dir;
		};
	}

	getDir() {
		return this.dir;
	}

	move(dir) {
		if (!dir) {
			return;
		};

		if (!this.head) {
			return;
		};

		//move last element to first place and change direction
		//current head
		var head = this.head;
		var position = head.tag.split(":");
		var row = Number(position[0]);
		var column = Number(position[1]);

		if(dir == 'up') {
			row = row - 1;
		} else if(dir == 'down') {
			row = row + 1;
		} else if(dir == 'left') {
			column = column - 1;
		} else if(dir == 'right') {
			column = column + 1;
		} 

		if (column < 0) {
			column = this.grid.count.column - 1;
		} else if(column >= this.grid.count.column) {
			column = 0;
		}

		if (row < 0) {
			row = this.grid.count.row - 1;
		} else if(row >= this.grid.count.row) {
			row = 0;
		};

		var cell = this.grid.cells[row][column];

		if (!cell) {
			return;
		};

		var head = this.head;

		var tail = this.children.pop();
		tail.position = cell;
		tail.tag = row + ":" + column;
		this.head.isSrc = false;
		this.head.isDest = true;
		
		this.children.unshift(this.head);
		this.head = tail;
		this.head.isSrc = true;
		this.head.isDest = false;

		this.dir = dir;

		var event = new CustomEvent("update-snake-head", { "detail" : {
			oldHead : head,
			newHead : this.head
		} });
		window.dispatchEvent(event);
	}

	draw(context) {
		context.fillStyle = "blue";
		this.head.draw(context);
		context.fillStyle = "red";
		for(var i=0; i<this.children.length; i++) {
			this.children[i].draw(context);
		}
	}
}