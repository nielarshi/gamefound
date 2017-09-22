class FoodGenerator {
	constructor() {

	}

	generate(options) {
		this.food = new Food({
			position : options.position,
			dimension : {
				width : 20,
				height : 20
			},
			imageSrc : options.type.image,
			tag : options.tag,
			drawTag : false,
			text : "30",
			drawTexts : false,
			isDraggable : false,
			isFixed : true
		});

		this.food.setFreshness(options.type.freshness);
		if (options.type.freshness != 1) {
			this.food.backgroundColor = 'red';
		} else {
			this.food.backgroundColor = 'blue';
		}
		this.food.ttl = options.type.ttl;

		this.food.isDest = true;

		return this.food;
	}
}