import { invoke } from '@tauri-apps/api/core';
import { convertFileSrc } from '@tauri-apps/api/core';
import Trigger from "$lib/classes/Trigger.svelte.js";
import {SvelteMap} from "svelte/reactivity";
import Extension from "$lib/classes/Extension.svelte.js";
import {App} from "$lib/classes/App.svelte.js";

class Bot {
	name = '';
	path = '';
	token = '';
	clientSecret = '';
	presenceIntent = false
	membersIntent = false
	messageContentIntent = false
	clientId = $state('');
	stdout = $state("")
	isRunning = $state(false)
	triggers = $state([]);
	triggerClasses = $state([]);
	actionClasses = $state([]);
	extensionClasses = $state([]);
	triggerVariableTypes = $derived(App.selectedBot?.triggerClasses?.map(t => t.variableTypes).flat() ?? [])
	actionVariableTypes = $derived(App.selectedBot?.actionClasses?.map(t => t.variableTypes).flat() ?? [])
	variableTypes = $derived([...new Set([...this.triggerVariableTypes, ...this.actionVariableTypes])].sort())
	extensions = new SvelteMap();
	debugTriggers = $state([])
	debugTrigger = $state(null)

	constructor(name, path) {
		this.name = name;
		this.path = path;
	}

	async loadFiles() {
		this.triggers = JSON.parse(await invoke("load_bot_triggers", {bot_path: this.path})).map(t => Trigger.fromJSON(t));
		const extensions = JSON.parse(await invoke("load_bot_extensions", {bot_path: this.path}));
		Object.keys(extensions).forEach(t => this.extensions.set(t, Extension.fromJSON(extensions[t])));
		const data = JSON.parse(await invoke("load_bot_settings", {bot_path: this.path}))
		this.clientSecret = data.clientSecret;
		this.token = data.token;
		this.clientId = atob(this.token.split(".")[0]);
		this.presenceIntent = data.presenceIntent;
		this.membersIntent = data.membersIntent;
		this.messageContentIntent = data.messageContentIntent;
		this.isRunning = await invoke("is_bot_running", {bot_path: this.path});
		invoke("load_bot_plugins", {bot_path: this.path});
	}

	toJSON() {
		return {name: this.name, path: this.path}
	}
}
export default Bot;