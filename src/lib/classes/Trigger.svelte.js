import { SvelteMap } from 'svelte/reactivity';
import Action from "$lib/classes/Action.svelte.js";

class Trigger {
	id = '';
	type = '';
	name = $state('');
	data = new SvelteMap();
	actions = $state([]);
	variables = new SvelteMap()
	debugVariables = new SvelteMap()

	constructor(id, type, name) {
		this.id = id;
		this.type = type;
		this.name = name;
	}

	toJSON() {
		const data = {}
		this.data.keys().forEach(key => {
			data[key] = this.data.get(key)
		})
		const variables = {}
		this.variables.keys().forEach(key => {
			variables[key] = this.variables.get(key)
		})
		return {
			id: this.id,
			type: this.type,
			name: String(this.name),
			data: data,
			actions: this.actions.map(act => act.toJSON()),
			variables: variables
		};
	}

	static fromJSON(json) {
		const trigger = new Trigger(json.id, json.type, json.name);
		Object.keys(json.data).forEach((key) => {
			trigger.data.set(key, json.data[key]);
		})
		Object.keys(json.variables ?? {}).forEach((key) => {
			trigger.variables.set(key, json.variables[key]);
		})
		trigger.actions = json.actions.map(act => Action.fromJSON(act))
		return trigger;
	}
}

export default Trigger