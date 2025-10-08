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
	actionManagers = $state([])
	showInDebugger = $state(false)

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

	toDebuggerJSON() {
		const obj = this.toJSON()
		const debugVariables = {}
		this.debugVariables.keys().forEach(key => {
			debugVariables[key] = this.debugVariables.get(key)
		})
		return {...obj, showInDebug: this.showInDebug, actionManagers: this.actionManagers, debugVariables: debugVariables};
	}

	static fromJSON(json, isDebugger) {
		const trigger = new Trigger(json.id, json.type, json.name);
		Object.keys(json.data).forEach((key) => {
			trigger.data.set(key, json.data[key]);
		})
		Object.keys(json.variables ?? {}).forEach((key) => {
			trigger.variables.set(key, json.variables[key]);
		})
		if(isDebugger) {
			Object.keys(json.debugVariables).forEach((key) => {
				trigger.debugVariables.set(key, json.debugVariables[key]);
			})
			trigger.showInDebug = json.showInDebug;
			trigger.actionManagers = json.actionManagers;
		}
		trigger.actions = json.actions.map(act => Action.fromJSON(act))
		return trigger;
	}
}

export default Trigger