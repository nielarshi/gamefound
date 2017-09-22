class Food extends Body {
	constructor(options) {
		super(options);
	}

	setFreshness(freshness) {
		this.freshness = freshness;
	}

	startTimer(food) {
		food.times = food.ttl / 100;
		food.timer = setInterval(function() {
			food.times = food.times - 1;
			if (food.times > 10) {
				return;
			};
			if (food.times > 0) {
				food.drawTexts = true;
				food.setText(food.times);
			} else {
				clearInterval(food.timer);
				var event = new CustomEvent("update-food", { "detail" : {
					components : [food],
					noUpdate : true
				}});
				window.dispatchEvent(event);
				return;
			}
		}, 1000);
	}
}