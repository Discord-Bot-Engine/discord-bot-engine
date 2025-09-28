import {invoke} from "@tauri-apps/api/core";

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
	}

	async removeTrigger(name, path) {
		const trigger = this.triggers.find(x => x.name === name)
		await invoke("remove_trigger", {bot_path: path, trigger: name, sha: trigger.sha})
	}

	async removeExtension(name, path) {
		const extension = this.extensions.find(x => x.name === name)
		await invoke("remove_extension", {bot_path: path, extension: name, sha: extension.sha})
	}

	async downloadAction(name, path) {
		const action = this.actions.find(x => x.name === name)
		const data = await fetch(action.url).then(res => res.text())
		await invoke("download_action", {bot_path: path, action: name, sha: action.sha, data})
	}

	async downloadTrigger(name, path) {
		const trigger = this.triggers.find(x => x.name === name)
		const data = await fetch(trigger.url).then(res => res.text())
		await invoke("download_trigger", {bot_path: path, trigger: name, sha: trigger.sha, data})
	}

	async downloadExtension(name, path) {
		const extension = this.extensions.find(x => x.name === name)
		const data = await fetch(extension.url).then(res => res.text())
		await invoke("download_extension", {bot_path: path, extension: name, sha: extension.sha, data})
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