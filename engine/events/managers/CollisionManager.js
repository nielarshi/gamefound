class CollisionManager {
	constructor(options) {
		this.condition = options.condition;
		this.components = [];
	}

	addComponent(component) {
		this.components.push(component);
	}

	removeComponent(component) {
		var index = this.components.indexOf(component);
		this.components.splice(index, 1);
	}

	handle() {
		var collided = false;
		for(var i = 0; i < this.components.length; i++) {
			if (this.components[i].isDest) {
				continue;
			}
			for(var j = 0; j < this.components.length; j++) {
				if (this.components[j].isSrc) {
					continue;
				}
				if ((this.components[i])[this.condition] == (this.components[j])[this.condition]) {
					//collided
					var event = new CustomEvent(Events.COLLISSION, 
						{ 
							"detail" : {
								components : [
									this.components[i], this.components[j]
								]
							} 
						} 
					);
					window.dispatchEvent(event);
					collided = true;
					break;
				}
			}
			if (collided) {
				break;
			};
		}
	}
}