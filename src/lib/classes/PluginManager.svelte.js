import {invoke} from "@tauri-apps/api/core";
import {BotManager} from "$lib/classes/BotManager.svelte.js";
import {App} from "$lib/classes/App.svelte.js"
import plugin from "@tailwindcss/typography";

class PluginManagerClass {
	actions = $state([])
	triggers = $state([])
	extensions = $state([])
	themes = $state([])
	translations = $state([])
	plugins = $derived([...this.actions, ...this.triggers, ...this.extensions, ...this.themes, ...this.translations])

	constructor() {
		this.fetchPlugins()
	}

	async fetchPlugins() {
		const path = `https://api.github.com/repos/Discord-Bot-Engine/Plugins/contents`
		const plugins = localStorage.getItem('plugins')
		let actions = []
		let triggers = []
		let extensions = []
		let themes = []
		let translations = []
		if(plugins) {
			const parsed = JSON.parse(plugins)
			const timestamp = parsed.timestamp;
			if(Date.now() >= timestamp) {
				const now = new Date();
				const future = new Date(now.getTime() + 5 * 60 * 1000);
				actions = await fetch(`${path}/actions`).then(res => res.json())
				triggers = await fetch(`${path}/triggers`).then(res => res.json())
				extensions = await fetch(`${path}/extensions`).then(res => res.json())
				themes = await fetch(`${path}/themes`).then(res => res.json())
				translations = await fetch(`${path}/translations`).then(res => res.json())
				localStorage.setItem('plugins', JSON.stringify({
					actions,
					triggers,
					extensions,
					themes,
					translations,
					timestamp: future.getTime()
				}))
			} else {
				actions = parsed.actions
				triggers = parsed.triggers
				extensions = parsed.extensions
				themes = parsed.themes
				translations = parsed.translations
			}
		} else {
			const now = new Date();
			const future = new Date(now.getTime() + 5 * 60 * 1000);
			actions = await fetch(`${path}/actions`).then(res => res.json())
			triggers = await fetch(`${path}/triggers`).then(res => res.json())
			extensions = await fetch(`${path}/extensions`).then(res => res.json())
			themes = await fetch(`${path}/themes`).then(res => res.json())
			translations = await fetch(`${path}/translations`).then(res => res.json())
			localStorage.setItem('plugins', JSON.stringify({
				actions,
				triggers,
				extensions,
				themes,
				translations,
				timestamp: future.getTime()
			}))
		}
		this.actions = actions.filter(file => file.name.endsWith(".js")).map(json => this.convertJSONResponseToPlugin(json, "action"))
		this.triggers = triggers.filter(file => file.name.endsWith(".js")).map(json => this.convertJSONResponseToPlugin(json, "trigger"))
		this.extensions = extensions.filter(file => file.name.endsWith(".js")).map(json => this.convertJSONResponseToPlugin(json, "extension"))
		this.themes = themes.filter(file => file.name.endsWith(".css")).map(json => this.convertJSONResponseToPlugin(json, "theme"))
		this.translations = translations.filter(file => file.name.endsWith(".json")).map(json => this.convertJSONResponseToPlugin(json, "translation"))
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

	async removeTheme(name) {
		const theme = this.themes.find(x => x.name === name)
		await invoke("remove_theme", {theme: name, sha: theme.sha})
		await invoke("remove_dashboard_theme", {theme: name, sha: theme.sha, bot_paths: BotManager.bots.map(b => b.path), dashboard_themes: BotManager.bots.map(b => b.theme)})
		App.loadThemes()
	}


	async removeTranslation(name) {
		const translation = this.translations.find(x => x.name === name)
		await invoke("remove_translation", {translation: name, sha: translation.sha})
		App.loadTranslations()
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

	async downloadTheme(name) {
		const theme = this.themes.find(x => x.name === name)
		const data = await fetch(theme.url).then(res => res.text())
		await invoke("download_theme", {theme: name, sha: theme.sha, data})
		await invoke("download_dashboard_theme", {theme: name, sha: theme.sha, data, bot_paths: BotManager.bots.map(b => b.path), dashboard_themes: BotManager.bots.map(b => b.theme)})
		App.loadThemes()
	}

	async downloadTranslation(name) {
		const translation = this.translations.find(x => x.name === name)
		const data = await fetch(translation.url).then(res => res.text())
		await invoke("download_translation", {translation: name, sha: translation.sha, data})
		App.loadTranslations()
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

	isThemeUpToDate(name) {
		if(!name) return false;
		const currentSha = name?.slice(0, 40)
		const sha = this.themes.find(x => x.name === name.slice(40)).sha
		return currentSha === sha
	}

	isTranslationUpToDate(name) {
		if(!name) return false;
		const currentSha = name?.slice(0, 40)
		const sha = this.translations.find(x => x.name.slice(0, -5) === name.slice(40)).sha
		return currentSha === sha
	}

	isActionDownloaded(name) {
		return BotManager.selectedBot.actionClasses.find(x => x.file.slice(40) === name && x.file.slice(40))
	}

	isTriggerDownloaded(name) {
		return BotManager.selectedBot.triggerClasses.find(x => x.file.slice(40) === name && x.file.slice(40))
	}

	isExtensionDownloaded(name) {
		return BotManager.selectedBot.extensionClasses.find(x => x.file.slice(40) === name && x.file.slice(40))
	}

	isThemeDownloaded(name) {
		return App.themes.find(x => x.split("\\").join("/").split("/").at(-1).slice(40) === name && x.split("\\").join("/").split("/").at(-1).slice(40))
	}

	isTranslationDownloaded(name) {
		return Object.keys(App.translations).find(x => x.slice(40) === name.slice(0,-5) && x.slice(40))
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