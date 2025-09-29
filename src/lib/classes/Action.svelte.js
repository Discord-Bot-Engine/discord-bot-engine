import { SvelteMap } from 'svelte/reactivity';

class Action {
	id = '';
	type = '';
	data = new SvelteMap();
	isAction = true
	isBreakPoint = $state(false)

	constructor(id, type) {
		this.id = id;
		this.type = type;
	}

	toJSON() {
		const data = {}
		this.data.keys().forEach(key => {
			data[key] = this.data.get(key);
		})
		return {
			id: this.id,
			type: this.type,
			data: data,
			isAction: this.isAction,
		};
	}

	static fromJSON(json) {
		const action = new Action(json.id, json.type);
		Object.keys(json.data).forEach((key) => {
			action.data.set(key, json.data[key]);
		})
		return action;
	}
}

export default Action;