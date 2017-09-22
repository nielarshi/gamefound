class Wall {
	constructor(options) {
		this.children = [];
		this.setOptions(options);
	}

	setOptions(options) {
		this.setPosition(options.position);
		this.setGrid(options.grid);
		var row, column;
		for(var i = options.startRow; i < options.startRow + options.numRows; i++) {
			row = i;
			for(var j = options.startColumn; j < options.startColumn + options.numColumns; j++) {
				column = j;
				this.addChildAt(row, column);
			}
		}
	}

	setPosition(position) {
		this.position = position;
	}

	setGrid(grid) {
		this.grid = grid;
		console.log(this.grid);
	}

	addChildAt(row, column) {
		if (row >= this.grid.count.row ||
			column >= this.grid.count.column) {
			return;
		};
		var rows = this.grid.cells[row];
		if (!rows) {
			return;
		};
		var cell = rows[column];
		if (!cell) {
			return;
		};
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
			backgroundColor : 'white'
		});

		body.isDest = true;

		var bodyN = new Body({
			position : {
				x : cell.x + 0.5,
				y : cell.y + 0.5
			},
			dimension : {
				width : this.grid.cellSize - 1,
				height : this.grid.cellSize - 1
			},
			tag : row + ":" + column,
			drawTag : false,
			isDraggable : false,
			isFixed : true,
			backgroundColor : 'brown'
		});
		this.children.push(body);
		this.children.push(bodyN);
	}

	draw(context) {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].draw(context);
		}
	}
}