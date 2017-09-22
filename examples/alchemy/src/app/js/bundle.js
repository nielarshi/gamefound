
var GamePanel = new Panel({
	id : "gameCanvas",
	position : {
		x : 0,
		y : 0
	},
	dimension : {
		width : window.innerWidth + 'px',
		height : window.innerHeight + 'px'
	}
});

var LeftPane = new Pane({
	position : {
		x : 0,
		y : 0
	},
	dimension : {
		width : (window.innerWidth - 200),
		height : window.innerHeight
	},
	backgroundColor : "#eeeae7"
});

var RightPane = new Pane({
	position : {
		x : (window.innerWidth - 200),
		y : 0
	},
	dimension : {
		width : 200,
		height : window.innerHeight
	},
	backgroundColor : "#d1cdc2"
});

var gameContext;
var tempBodies = [];
var overlappingBodies = [];
var score;
window.onload = function() {
	ConfigHelper.loadAppItems();
	document.body.appendChild(GamePanel.element);
	var gameCanvas = document.getElementById('gameCanvas');
	gameContext = gameCanvas.getContext("2d");
	gameContext.canvas.width = window.innerWidth;
	gameContext.canvas.height = window.innerHeight;
	initGame(gameCanvas);
	setInterval(function() {
		startGameLoop(gameContext);
	}, 30);
}

function startGameLoop(gameContext) {
 //update();
  GamePanel.draw(gameContext);
  tempBodies.forEach(function(tempBody) {
  	tempBody.draw(gameContext);
  });
  score.draw(gameContext);
}


function initGame(gameCanvas) {
	initializeGamePanel();
	registerEvents(gameCanvas);
}

function initializeGamePanel() {
	GamePanel.addChild(LeftPane);
	GamePanel.addChild(RightPane);

	var image;
	AppItems.active.forEach(function(item, index) {

		console.log(item, index);
		image = new Image();
		image.src = item.src;
		RightPane.addChild(new Body({
			position : {
				x : 10,
				y : index * (60) + 10
			},
			dimension : {
				width : 50,
				height : 50
			},
			image : image,
			tag : item.name,
			drawTag : true,
			isDraggable : true,
			isFixed : true
		}));
	});

	//initialise score
	score = new Score({
		position : {
			x : 20,
			y : window.innerHeight - 40
		},
		font : "80px Arial",
		score : AppItems.active.length,
		total : AppItems.active.length + AppItems.inactive.length
	});
}

function registerEvents(gameCanvas) {
	new Draggable(gameCanvas, 
	function(event) {
		//find which element is dragged
		var canvasRect = gameCanvas.getBoundingClientRect();
		var mouseX = (event.clientX - canvasRect.left)*(gameCanvas.width/canvasRect.width);
		var mouseY = (event.clientY - canvasRect.top)*(gameCanvas.height/canvasRect.height);
		GamePanel.initiateDragAt(mouseX, mouseY);
	},
	function(event) {
		//change x, y of the element
		var canvasRect = gameCanvas.getBoundingClientRect();
		var mouseX = (event.clientX - canvasRect.left)*(gameCanvas.width/canvasRect.width);
		var mouseY = (event.clientY - canvasRect.top)*(gameCanvas.height/canvasRect.height);
		
		var offset;
		if (tempBodies.length > 0) {
			offset = {
				x : tempBodies[0].offset.x,
				y : tempBodies[0].offset.y
			}
		};
		GamePanel.dragAt(mouseX, mouseY, offset);
		tempBodies.forEach(function(tempBody) {
		  	tempBody.dragAt(mouseX, mouseY);
		});
		//detect overlap

	}, function(event) {
		var canvasRect = gameCanvas.getBoundingClientRect();
		var mouseX = (event.clientX - canvasRect.left)*(gameCanvas.width/canvasRect.width);
		var mouseY = (event.clientY - canvasRect.top)*(gameCanvas.height/canvasRect.height);
		//create new element if it is dropped in the left pane
		if (mouseX < (gameCanvas.width - 200)) {
			tempBodies.forEach(function(tempBody) {
			  	GamePanel.addChild(tempBody, GamePanel.getChild(0));
			});
		} 
		tempBodies = [];
		console.log(gameCanvas.width, mouseX, mouseY);
		//or remove element if it is dropped at the right pane
		if (mouseX > (gameCanvas.width - 200)) {
			console.log("Initiate remove dragging element");
			GamePanel.removeDraggingChild();
		}
		//stop dragging
		GamePanel.stopDrag();
	});

	new DragListener(window, function(event) {
		if (event.type == Events.DRAG_INITIATED) {
			tempBodies = [];
			console.log("new item has to be created", event);
			var body = new Body(event.detail);
			body.setOffset(event.detail.offset);
			tempBodies.push(body);
		} else if (event.type == Events.DRAG_ENDED) {
			console.log("handleOverlapping", event);
			//handle overlapping
			GamePanel.handleOverlapping();
		} else if (event.type == Events.COLLISSION) {

			//do next step
			console.log("Next", event);

			//check how many overlaps you want
			if (event.detail.tags.length > 2) {
				return;
			} else if (event.detail.tags.length < 2) {
				return;
			}	
			//search in all active items
			//check rule
			var appItem = ConfigHelper.getActiveItemFor(event.detail.tags[0]);

			if (!appItem || !appItem.rules) {
				//alert("There is no rule defined for this combination");
				return;
			};
			var outcome = appItem.rules[event.detail.tags[1]];

			//create new item
			//add to left pane
			var outcomeItem = ConfigHelper.getInactiveItemFor(outcome);



			if (!outcomeItem) {
				outcomeItem = ConfigHelper.getActiveItemFor(outcome);
			} else {
				var image = new Image();
				image.src = outcomeItem.src;
				//add to right pane
				RightPane.addChild(new Body({
					position : {
						x : 10,
						y : ((RightPane.children.length) * 60) + 10
					},
					dimension : event.detail.dimension,
					image : image,
					tag : outcomeItem.name,
					drawTag : true,
					isDraggable : true,
					isFixed : true,
					isOverlapping : false
				}));
				//set score
				ConfigHelper.moveToActive(outcome);
				score.setScore(AppItems.active.length);
			}

			if (!outcomeItem) {
				//alert("Could not find correct item for this combination");
				return;
			};

			//remove from the panel
			GamePanel.removeOverlappingChildren();
			
			var image = new Image();
			image.src = outcomeItem.src;

			LeftPane.addChild(new Body({
				position : event.detail.position,
				dimension : event.detail.dimension,
				image : image,
				tag : outcomeItem.name,
				isDraggable : true,
				isFixed : false,
				isOverlapping : false
			}));
			
			tempBodies = [];
		}
		
	});
}
