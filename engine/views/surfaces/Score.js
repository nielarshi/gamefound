class Score {
	constructor(options) {
		this.setOptions(options);
	}

	setOptions(options) {
		this.setScore(options.score);
		this.setTotal(options.total);
		this.setPosition(options.position);
		this.setFont(options.font);
	}

	setFont(font) {
		this.font = font;
	}

	setScore(score) {
		this.score = score;
	}

	getScore() {
		return this.score;
	}

	setTotal(total) {
		this.total = total;
	}

	setPosition(position) {
		this.position = position;
	}

	getText() {
		return this.score + " / " + this.total;
	}

	draw(context) {
		context.font = this.font;
		context.fillStyle = "lightgray";
		context.fillText(this.getText(), this.position.x, this.position.y);
	}
}