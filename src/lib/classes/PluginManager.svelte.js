import {invoke} from "@tauri-apps/api/core";
import {BotManager} from "$lib/classes/BotManager.svelte.js";

class PluginManagerClass {
	actions = $state([])
	triggers = $state([])
	extensions = $state([])
	plugins = $derived([...this.actions, ...this.triggers, ...this.extensions])

	constructor() {
		this.fetchPlugins()
	}

	async fetchPlugins() {
		const path = `https://api.github.com/repos/Discord-Bot-Engine/Plugins/contents/`
		const actions = await fetch(`${path}/actions`).then(res => res.json())
		const triggers = await fetch(`${path}/triggers`).then(res => res.json())
		const extensions = await fetch(`${path}/extensions`).then(res => res.json())
		this.actions = actions.filter(file => file.name.endsWith(".js")).map(json => this.convertJSONResponseToPlugin(json, "action"))
		this.triggers = triggers.filter(file => file.name.endsWith(".js")).map(json => this.convertJSONResponseToPlugin(json, "trigger"))
		this.extensions = extensions.filter(file => file.name.endsWith(".js")).map(json => this.convertJSONResponseToPlugin(json, "extension"))
	}

	async removeAction(name, path) {
		const action = this.actions.find(x => x.name === name)
		await invoke("remove_action", {bot_path: path, action: name, sha: action.sha})
		invoke("load_bot_plugins", {bot_path: path});
	}

	async removeTrigger(name, path) {
		const trigger = this.triggers.find(x => x.name === name)
		await invoke("remove_trigger", {bot_path: path, trigger: name, sha: trigger.sha})
		invoke("load_bot_plugins", {bot_path: path});
	}

	async removeExtension(name, path) {
		const extension = this.extensions.find(x => x.name === name)
		await invoke("remove_extension", {bot_path: path, extension: name, sha: extension.sha})
		invoke("load_bot_plugins", {bot_path: path});
	}

	async downloadAction(name, path) {
		const action = this.actions.find(x => x.name === name)
		const data = await fetch(action.url).then(res => res.text())
		await invoke("download_action", {bot_path: path, action: name, sha: action.sha, data})
		invoke("load_bot_plugins", {bot_path: path});
	}

	async downloadTrigger(name, path) {
		const trigger = this.triggers.find(x => x.name === name)
		const data = await fetch(trigger.url).then(res => res.text())
		await invoke("download_trigger", {bot_path: path, trigger: name, sha: trigger.sha, data})
		invoke("load_bot_plugins", {bot_path: path});
	}

	async downloadExtension(name, path) {
		const extension = this.extensions.find(x => x.name === name)
		const data = await fetch(extension.url).then(res => res.text())
		await invoke("download_extension", {bot_path: path, extension: name, sha: extension.sha, data})
		invoke("load_bot_plugins", {bot_path: path});
	}

	isActionUpToDate(name) {
		if(!name) return false;
		const currentSha = name.slice(0, 40)
		const sha = this.actions.find(x => x.name === name.slice(40)).sha
		return currentSha === sha
	}

	isTriggerUpToDate(name) {
		if(!name) return false;
		const currentSha = name.slice(0, 40)
		const sha = this.triggers.find(x => x.name === name.slice(40)).sha
		return currentSha === sha
	}

	isExtensionUpToDate(name) {
		if(!name) return false;
		const currentSha = name?.slice(0, 40)
		const sha = this.extensions.find(x => x.name === name.slice(40)).sha
		return currentSha === sha
	}

	isActionDownloaded(name) {
		return BotManager.selectedBot.actionClasses.find(x => x.file.slice(40) === name) === true
	}

	isTriggerDownloaded(name) {
		return BotManager.selectedBot.triggerClasses.find(x => x.file.slice(40) === name) === true

	}

	isExtensionDownloaded(name) {
		return BotManager.selectedBot.extensionClasses.find(x => x.file.slice(40) === name) === true

	}

	convertJSONResponseToPlugin(json, type) {
		return {
			type: type,
			name: json.name,
			sha: json.sha,
			url: json.download_url
		}
	}
}

export const PluginManager = new PluginManagerClass();