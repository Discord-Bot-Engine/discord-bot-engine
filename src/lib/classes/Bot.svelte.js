import { invoke } from '@tauri-apps/api/core';
import { convertFileSrc } from '@tauri-apps/api/core';
import Trigger from "$lib/classes/Trigger.svelte.js";
import {SvelteMap} from "svelte/reactivity";
import Extension from "$lib/classes/Extension.svelte.js";
import {App} from "$lib/classes/App.svelte.js";
import {BotManager} from "$lib/classes/BotManager.svelte.js";

class Bot {
	name = '';
	path = '';
	token = '';
	port = '3000';
	theme = 'default'
	clientSecret = '';
	url = '';
	username = '';
	password = '';
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
	triggerFolders = $derived([...new Set([...(BotManager.selectedBot?.triggers?.map(t => t.folder?.toLowerCase().trim() || undefined) ?? [])])])
	triggerFolderStates = $state({})
	triggerVariableTypes = $derived(BotManager.selectedBot?.triggerClasses?.map(t => t.variableTypes).flat() ?? [])
	actionVariableTypes = $derived(BotManager.selectedBot?.actionClasses?.map(t => t.variableTypes).flat() ?? [])
	variableTypes = $derived([...new Set([...this.triggerVariableTypes, ...this.actionVariableTypes])].sort())
	extensions = new SvelteMap();
	isLoading = $state(false)
	modifiedTriggers = []
	removedTriggers = []
	undos = []
	redos = []
	constructor(name, path) {
		this.name = name;
		this.path = path;
	}

	async loadFiles() {
		this.isLoading = "Loading triggers"
		this.triggers = JSON.parse(await invoke("load_bot_triggers", {bot_path: this.path})).map(t => Trigger.fromJSON(t)).sort((a, b) => a.name.localeCompare(b.name));
		this.isLoading = "Loading extensions"
		const extensions = JSON.parse(await invoke("load_bot_extensions", {bot_path: this.path}));
		Object.keys(extensions).forEach(t => this.extensions.set(t, Extension.fromJSON(extensions[t])));
		this.isLoading = "Loading settings"
		const data = JSON.parse(await invoke("load_bot_settings", {bot_path: this.path}))
		this.clientSecret = data.clientSecret;
		this.token = data.token;
		this.port = data.port;
		this.theme = data.theme
		this.clientId = atob(this.token.split(".")[0]);
		this.url = data.url;
		this.username = data.username;
		this.password = data.password;
		this.presenceIntent = data.presenceIntent;
		this.membersIntent = data.membersIntent;
		this.messageContentIntent = data.messageContentIntent;
		this.isRunning = await invoke("is_bot_running", {bot_path: this.path});
		this.isLoading = "Loading plugins"
		await invoke("load_bot_plugins", {bot_path: this.path});
		App.selectedTrigger = this.triggers.find(t => t.id === App.selectedTrigger?.id)
	}

	markAsModified(triggerId) {
		if(this.modifiedTriggers.includes(triggerId)) return;
		this.modifiedTriggers.push(triggerId)
	}

	markAsRemoved(triggerId) {
		if(this.removedTriggers.includes(triggerId)) return;
		this.removedTriggers.push(triggerId)
	}

	toJSON() {
		return {name: this.name, path: this.path}
	}
}
export default Bot;