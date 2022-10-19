const keyHandlers = {
	value(target, key, receiver) {
		return target.value.join(" ");
	},
	toString(target, key, receiver) {
		return () => target.value.join(" ");
	},
	bindings(target, key, receiver) {
		if (target.arrayBindings.length > 0) {
			return target.arrayBindings;
		} else {
			return target.objectBindings;
		}
	},
	default(target, key, receiver) {
		return (queryFragment = "", bindings = []) => {
			target.value.push(key);
			if (typeof queryFragment != "undefined") {
				target.value.push(queryFragment.trim());
			}
			if (bindings instanceof Array) {
				target.arrayBindings.push(...bindings);
			} else if (typeof bindings == "object") {
				for (let key of Object.keys(bindings)) {
					target.objectBindings[key] = bindings[key];
				}
			} else {
				let size = target.arrayBindings.push(bindings);
				target.value.push(`$${size - 1}`);
			}
			return receiver;
		};
	},
};

const queryBuilder = (initialQuery) =>
	new Proxy(
		{ value: [initialQuery], objectBindings: {}, arrayBindings: [] },
		{
			get(target, key, receiver) {
				if (keyHandlers[key]) {
					return keyHandlers[key](target, key, receiver);
				} else {
					return keyHandlers.default(target, key, receiver);
				}
			},
		}
	);

const query = queryBuilder();
const color = "green";
const count = 2;
const colorQuery = query
	.select("*")
	.from("mydatabase")
	.where("thing = :color", { color })
	.and("otherthing = :count", { count });

console.log(colorQuery.value, colorQuery.bindings);
