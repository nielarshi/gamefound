var ConfigHelper = {
	AppItems : AppItems,

	getActiveItemFor : function(name) {
		var result;
		AppItems.active.forEach(function(item, index) {
			if (item.name === name) {
				result = item;
			}
		});
		return result;
	},

	getInactiveItemFor : function(name) {
		var result;
		AppItems.inactive.forEach(function(item, index) {
			if (item.name === name) {
				result = item;
			}
		});
		return result;
	},

	moveToActive : function(name) {
		var matchedItem;
		AppItems.inactive.forEach(function(item, index) {
			if (item.name === name) {
				matchedItem = item;
			}
		});

		AppItems.active.push(matchedItem);

		var index = AppItems.inactive.indexOf(matchedItem);
		AppItems.inactive.splice(index, 1);
	},

	loadAppItems : function() {
		AppItems.active.forEach(function(item) {
			var img = document.createElement('img');
			img.src = item.src;
			img.style.display = 'none';
			img.id = item.name;
			//document.body.appendChild(img);
		});
		AppItems.inactive.forEach(function(item) {
			var img = document.createElement('img');
			img.src = item.src;
			img.style.display = 'none';
			img.id = item.name;
			//document.body.appendChild(img);
		})
	}
};