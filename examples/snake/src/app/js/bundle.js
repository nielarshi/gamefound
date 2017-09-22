var collider;
var gameContext;
var tempBodies = [];
var overlappingBodies = [];
var score;
var gameLoop;
var GamePanel, SnakeArea, SnakeAreaGrid, snake, collisionManager;
var gameCanvas;

window.onload = function() {

	GamePanel = new Panel({
		id : "gameCanvas",
		position : {
			x : 0,
			y : 0
		},
		dimension : {
			width : (window.innerWidth) + 'px',
			height : (window.innerHeight) + 'px'
		}
	});
	
	document.body.appendChild(GamePanel.element);
	var gameCanvas = document.getElementById('gameCanvas');
	gameContext = gameCanvas.getContext("2d");
	gameContext.canvas.width = window.innerWidth;
	gameContext.canvas.height = window.innerHeight;
	restart();
}

function updateSnakeArea(event) {
	console.log(event);

	if (collider) {
		clearInterval(collider);
		collider = null;
	};

	//remove food from collision manager
	var food;
	var wall;
	var snakeHead;
	var components = event.detail.components;

	for(var i = 0; i < components.length; i++) {
		if (components[i] instanceof Food) {
			food = components[i];
		} else if (components[i] instanceof Body &&
			components[i].isDest) {
			wall = components[i];
		} else if (components[i] instanceof Body &&
			components[i].isSrc) {
			snakeHead = components[i];
		}
	}

	console.log(snakeHead, wall, food);

	if(snakeHead && wall) {
		console.log('die');
		stopGameLoop();
	} else if(snakeHead && food) {
		if (!event.detail.noUpdate) {
			if (food.freshness != 1) {
				snake.decreaseSize();
				score.setScore(score.getScore() - 1);
			} else {
				snake.increaseSize();
				score.setScore(score.getScore() + 1);
			}
		}

	}

	if (food) {		
		clearInterval(food.timer);

		collisionManager.removeComponent(food);
		// remove food from grid
		SnakeArea.removeChild(food);
		// add new food
		addFoodToSnakeArea();
	};
}

function updateSnakeHeadForCollision(event) {
	if (!collider) {
		return;
	};
	//console.log(event);
	var updatedSnake = event.detail;
	//remove current head from collision manager 
	var oldHead = updatedSnake.oldHead;
	collisionManager.removeComponent(oldHead);

	//add new head to collision manager
	var newHead = updatedSnake.newHead;
	collisionManager.addComponent(newHead);
}

function addFoodToSnakeArea() {
	var foodGenerator = new FoodGenerator();
	//randomly generate row and column for placing food
	var row = RandomUtil.generate(4, SnakeAreaGrid.count.row - 8);
	var column = RandomUtil.generate(4, SnakeAreaGrid.count.column - 8);

	//add food only when row and column does not fall inside obstacle
	//else call again

	var food = foodGenerator.generate({
		type : FoodTypes[RandomUtil.generate(0, 2)], 
		tag : row+":"+column,
		position : SnakeAreaGrid.getCellPosition(row, column)
	});

	food.startTimer(food);

	SnakeArea.addChild(food);
	collisionManager.addComponent(food);

	if (collider) {
		return;
	};

	collider = setInterval(function() {
		collisionManager.handle();
	}, 60);
}

//default direction for snake
var direction = 'left';
document.onkeydown = function(event) {
 	event = event || window.event;
 	if (event.keyCode == '38') {
        //up
        direction = 'up';
    }
    else if (event.keyCode == '40') {
        //down
        direction = 'down';
    }
    else if (event.keyCode == '37') {
       //left
       direction = 'left';
    }
    else if (event.keyCode == '39') {
       //right
       direction = 'right';
    }
    snake.setDir(direction);
}

function startGameLoop(gameContext) {
	snake.move(snake.getDir());
	GamePanel.draw(gameContext);
	tempBodies.forEach(function(tempBody) {
	  	tempBody.draw(gameContext);
	});
	score.draw(gameContext);
}

function stopGameLoop(gameContext) {
 	if (gameLoop) {
 		clearInterval(gameLoop);
 	};

 	if (collider) {
		clearInterval(collider);
		collider = null;
	};

	window.removeEventListener("update-snake-head", updateSnakeHeadForCollision, false);
	window.removeEventListener("update-food", updateSnakeArea, false);
	window.removeEventListener(Events.COLLISSION, updateSnakeArea, false);

	showRestart();
}

function showRestart() {
	window.document.getElementById("restart").style.display = "block";
}

function restart() {
	window.document.getElementById("restart").style.display = "none";
	initGame(gameCanvas);
	gameLoop = setInterval(function() {
		startGameLoop(gameContext);
	}, 60);

	collider = setInterval(function() {
		collisionManager.handle();
	}, 60);
}


function initGame(gameCanvas) {
	initializeGamePanel();
}

function initializeGamePanel() {

	SnakeArea = new Pane({
		position : {
			x : 0,
			y : 0
		},
		dimension : {
			width : (window.innerWidth),
			height : (window.innerHeight)
		},
		backgroundColor : "#eeeae7"
	});

	//set grid for snake area
	SnakeAreaGrid = new Grid({
		cellSize : 20,
		parent : {
			dimension : SnakeArea.dimension,
			position : SnakeArea.position
		}
	});

	snake = new Snake({
		position : SnakeAreaGrid.parent.position,
		headPosition : {
				row : 10,
				column : 40
		},
		initialLength : 10,
		grid : SnakeAreaGrid
	});



	//define collision manager to check snake and food
	collisionManager = new CollisionManager({
		condition : "tag"
	});


	collisionManager.addComponent(snake.head);

	//add snake
	SnakeArea.addChild(snake);

	//generate foods and add to grid
	for(var i = 0; i < 5; i++) {
		addFoodToSnakeArea();
	}

	
	//add walls
	var walls = generateWalls();
	var wall;
	for(var i = 0; i < walls.length; i++) {
		wall = walls[i];
		SnakeArea.addChild(wall);
		for(var j = 0; j < wall.children.length; j = j+2) {
			collisionManager.addComponent(wall.children[j]);
		}
	}
	
	//add obstacles
	//generate randomly
	var obstacles = generateObstacles();
	var obstacle;
	for(var i = 0; i < obstacles.length; i++) {
		obstacle = obstacles[i];
		SnakeArea.addChild(obstacle);
		for(var j = 0; j < obstacle.children.length; j = j+2) {
			collisionManager.addComponent(obstacle.children[j]);
		}
	}

	GamePanel.addChild(SnakeArea);

	//register event for canvas to add food to collision manager
	window.addEventListener("update-snake-head", updateSnakeHeadForCollision, false);
	window.addEventListener("update-food", updateSnakeArea, false);
	window.addEventListener(Events.COLLISSION, updateSnakeArea, false);


	//initialise score
	score = new Score({
		position : {
			x : 0.12 * window.innerWidth,
			y : 0.85 * window.innerHeight
		},
		font : "50px Arial",
		score : 0,
		total : 30
	});
}

function generateWalls() {
	//create walls
	var walls = [];
	var brickCount = 2;

	var leftWall = new Wall({
		position : SnakeAreaGrid.parent.position,
		startRow : 0,
		numRows : SnakeAreaGrid.count.row,
		startColumn : 0,
		numColumns : brickCount,
		grid : SnakeAreaGrid
	});

	var topWall = new Wall({
		position : SnakeAreaGrid.parent.position,
		startRow : 0,
		numRows : brickCount,
		startColumn : 0,
		numColumns : SnakeAreaGrid.count.column,
		grid : SnakeAreaGrid
	});

	var rightWall = new Wall({
		position : SnakeAreaGrid.parent.position,
		startRow : 0,
		numRows : SnakeAreaGrid.count.row,
		startColumn : SnakeAreaGrid.count.column - brickCount,
		numColumns : brickCount,
		grid : SnakeAreaGrid
	});

	var bottomWall = new Wall({
		position : SnakeAreaGrid.parent.position,
		startRow : SnakeAreaGrid.count.row - brickCount,
		numRows : brickCount,
		startColumn : 0,
		numColumns : SnakeAreaGrid.count.column,
		grid : SnakeAreaGrid
	});

	walls.push(leftWall);
	walls.push(topWall);
	walls.push(rightWall);
	walls.push(bottomWall);

	return walls;
}

function generateObstacles() {
	var obstacles = [];
	//number of obstacles
	var obstaclesCount = 5;

	var obstacle;
	var numRows, numColumns;
	for(var i = 0; i < obstaclesCount; i++) {
		if (i % 2 == 0) {
			numRows = 2;
			numColumns = RandomUtil.generate(5, 10);
		} else {
			numRows = RandomUtil.generate(5, 10);
			numColumns = 2;
		}
		obstacle = new Wall({
			position : SnakeAreaGrid.parent.position,
			startRow : RandomUtil.generate(3, SnakeAreaGrid.count.row - numRows),
			numRows : numRows,
			startColumn : RandomUtil.generate(3, SnakeAreaGrid.count.column - numColumns),
			numColumns : numColumns,
			grid : SnakeAreaGrid
		});
		obstacles.push(obstacle);
	}

	return obstacles;
}
