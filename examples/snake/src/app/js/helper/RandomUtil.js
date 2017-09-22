class RandomUtil {
	constructor() {

	}

	static generate(start, end) {
		var number = Math.abs(Math.floor(Math.random()*end) + start);
		return number;
	}
}