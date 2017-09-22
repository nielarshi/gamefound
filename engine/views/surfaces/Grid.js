class Grid {
	constructor(options) {
		this.count = {};
		this.setOptions(options);
	}

	setOptions(options) {
		this.setCellSize(options.cellSize);
		this.setParent(options.parent);
		this.redraw();
	}

	setCellSize(cellSize) {
		this.cellSize = cellSize;
	}

	setParent(parent) {
		this.parent = parent;
	}

	getCellPosition(row, column) {
		var cell = this.cells[row][column];
		return {
			x : cell.x - this.parent.position.x,
			y : cell.y - this.parent.position.y
		}
	}

	redraw() {
		if (!this.parent) {
			return;
		};
		this.count = {
			row : Math.round(this.parent.dimension.height / this.cellSize),
			column : Math.round(this.parent.dimension.width / this.cellSize)
		};

		this.cells = [];
		for(var i = 0; i < this.count.row; i++) {
			if (!this.cells[i]) {
				this.cells[i] = [];
			}
			for(var j = 0; j < this.count.column; j++) {
				var posX = Math.round(this.parent.position.x + ((this.cellSize) * j));
				var posY = Math.round(this.parent.position.y + ((this.cellSize) * i));
				if (j != 0) {
					posX = posX + 1;
				}
				if (i != 0) {
					posY = posY + 1;
				};
				this.cells[i][j] = {
					x : posX,
					y : posY
				}
			}
		}
	}
}