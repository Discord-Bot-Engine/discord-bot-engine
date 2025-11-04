import { SvelteMap } from 'svelte/reactivity';
import CustomElement from "$lib/classes/CustomElement.svelte.js";

class Action {
	id = '';
	type = 'action';
	actionType = '';
	data = new SvelteMap();
	isBreakPoint = $state(false)
	position = { x: 0, y: 0 }
	outputs = null
	constructor(id, type, x = 0, y = 0) {
		this.id = id;
		this.actionType = type;
		this.position.x = x;
		this.position.y = y;
		if(type === "group") this.type = "group"
	}

	static fromJSON(json) {
		const action = new Action(json.id, json.actionType, json.position?.x, json.position?.y);
		action.outputs = json.outputs;
		Object.keys(json.data).forEach((key) => {
			if(Array.isArray(json.data[key]) && json.data[key].every(el => typeof el === 'object' && !Array.isArray(el) && el !== null))
				json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
			action.data.set(key, json.data[key]);
		})
		return action;
	}
}

export default Action;