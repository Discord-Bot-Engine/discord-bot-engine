import {invoke} from "@tauri-apps/api/core";

class PluginManagerClass {
	actions = $state([])
	triggers = $state([])
	extensions = $state([])

	constructor() {
		this.fetchPlugins()
	}

	async fetchPlugins() {
		const path = `https://api.github.com/repos/Discord-Bot-Engine/Plugins/contents/`
		const actions = await fetch(`${path}/actions`).then(res => res.json())
		const triggers = await fetch(`${path}/triggers`).then(res => res.json())
		const extensions = await fetch(`${path}/extensions`).then(res => res.json())
		this.actions = actions.filter(file => file.name.endsWith(".js")).map(this.convertJSONResponseToPlugin)
		this.triggers = triggers.filter(file => file.name.endsWith(".js")).map(this.convertJSONResponseToPlugin)
		this.extensions = extensions.filter(file => file.name.endsWith(".js")).map(this.convertJSONResponseToPlugin)
	}

	async downloadAction(name, path) {
		const action = this.actions.find(x => x.name === name)
		const data = await fetch(action.url).then(res => res.text())
		const fileName = `actions/${action.sha}${name}`
		await invoke("download_action", {bot_path: path, action: fileName, data})
	}

	async downloadTrigger(name, path) {
		const trigger = this.triggers.find(x => x.name === name)
		const data = await fetch(trigger.url).then(res => res.text())
		const fileName = `triggers/${trigger.sha}${name}`
		await invoke("download_trigger", {bot_path: path, trigger: fileName, data})
	}

	async downloadExtension(name, path) {
		const extension = this.extensions.find(x => x.name === name)
		const data = await fetch(extension.url).then(res => res.text())
		const fileName = `extensions/${extension.sha}${name}`
		await invoke("download_extension", {bot_path: path, extension: fileName, data})
	}

	isActionUpToDate(name) {
		const sha = this.actions.find(x => x.name === name.slice(40)).sha
		const currentSha = name.slice(0, 40)
		return currentSha === sha
	}

	isTriggerUpToDate(name) {
		const sha = this.triggers.find(x => x.name === name.slice(40)).sha
		const currentSha = name.slice(0, 40)
		return currentSha === sha
	}

	isExtensionUpToDate(name) {
		const sha = this.extensions.find(x => x.name === name.slice(40)).sha
		const currentSha = name.slice(0, 40)
		return currentSha === sha
	}

	convertJSONResponseToPlugin(json) {
		return {
			name: json.name,
			sha: json.sha,
			url: json.download_url
		}
	}
}

export const PluginManager = new PluginManagerClass();