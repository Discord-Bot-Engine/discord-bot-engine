import { SvelteMap } from 'svelte/reactivity';
import Action from "$lib/classes/Action.svelte.js";
import {BotManager} from "$lib/classes/BotManager.svelte.js";
import CustomElement from "$lib/classes/CustomElement.svelte.js";

class Trigger {
	id = '';
	type = '';
	name = $state('');
	data = new SvelteMap();
	actions = $state([]);
	edges = $state.raw([])
	variables = new SvelteMap()
	debugVariables = new SvelteMap()
	showInDebugger = $state(false)

	constructor(id, type, name) {
		this.id = id;
		this.type = type;
		this.name = name;
		this.actions = [
			new Action(id, null, 0, 0)
		]
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
		const actions = []
		this.actions.forEach(action => {
			const data = {}
			action.data.keys().forEach(key => {
				data[key] = action.data.get(key)
			})
			actions.push({...action, data})
		})
		return {
			id: this.id,
			type: this.type,
			name: String(this.name),
			data: data,
			actions,
			edges: this.edges,
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
		trigger.edges = json.edges;
		Object.keys(json.data).forEach((key) => {
			if(Array.isArray(json.data[key]) && json.data[key].every(el => typeof el === 'object' && !Array.isArray(el) && el !== null))
				json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
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