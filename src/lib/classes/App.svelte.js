import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import Bot from "$lib/classes/Bot.svelte.js";
import {Webview} from "@tauri-apps/api/webview";
import {Window} from "@tauri-apps/api/window";
import Trigger from "$lib/classes/Trigger.svelte.js";

class AppClass {
	selectedTrigger = $state(null);
	selectedBot = $state(null);
	bots = $state([]);
	windows = new Map()

	constructor() {
		listen("plugins", ({payload}) => {
			const plugins = JSON.parse(payload[1])
			const bot = App.bots.find(b => b.path === payload[0])
			if(plugins.type === "extensions") {
				bot.extensionClasses = plugins.data
				bot.extensionClasses.forEach(p => {
					if(p.open) p.open = eval(`(${p.open.replace("open", "function ")})`)
				})
			}
			if(plugins.type === "triggers") {
				bot.triggerClasses = plugins.data
				bot.triggerClasses.forEach(p => {
					if(p.open) p.open = eval(`(${p.open.replace("open", "function ")})`)
				})
			}
			if(plugins.type === "actions") {
				bot.actionClasses = plugins.data
				bot.actionClasses.forEach(p => {
					p.title = eval(`(${p.title.replace("title", "function ")})`)
					if(p.open) p.open = eval(`(${p.open.replace("open", "function ")})`)
				})
			}
		})
		listen('stdout', ({payload}) => {
			const bot = App.bots.find(b => b.path === payload[0])
			if(payload[1].startsWith("$DEBUGGER$$$")) {
				const trigger = Trigger.fromJSON(JSON.parse(payload[1].replace("$DEBUGGER$$$", "")))
				if(bot.debugTriggers.find(t => t.name === trigger.name && t.type === trigger.type)) return;
				bot.debugTriggers.push(trigger);
				bot.debugTrigger ??= trigger
				return;
			} else if(payload[1].startsWith("$VARIABLE$$$")) {
				const { name, value, triggerId } = JSON.parse(payload[1].replace("$VARIABLE$$$", ""))
				bot.debugTrigger = bot.debugTriggers.find(t => t.id === triggerId)
				bot.debugTrigger.debugVariables.set(name, value)
				return;
			}
			bot.stdout += payload[1]
		})
		this.loadBots()
	}

	saveUIData(ref, data) {
		data.clear()
		const marked = ref.querySelectorAll("*[name]")
		marked.forEach(el => {
			let name = el.getAttribute("name");
			if(el.tagName.toLowerCase() === "dbe-action-list") {
				data.set(name, el.getItems())
			} else if(el.tagName.toLowerCase() === "dbe-list") {
				data.set(name, el.getItems())
			} else if(el.tagName.toLowerCase() === "dbe-select") {
				data.set(name, el.getValue())
			} else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
				data.set(name, el.selectedOptions.map((o) => o.value));
			} else if (el.tagName.toLowerCase() === 'select') {
				data.set(name, el.selectedOptions[0].value);
			} else if (el.tagName.toLowerCase() === 'checkbox') {
				data.set(name, el.checked);
			} else if (el.value !== undefined && el.tagName.toLowerCase() !== "button") {
				data.set(name, el.value);
			}
		})
	}

	loadUIData(ref, data) {
		const marked = ref.querySelectorAll("*[name]")
		marked.forEach(el => {
			let name = el.getAttribute("name");
			if(el.tagName.toLowerCase() === "dbe-action-list") {
				let actions = data.get(name)
				if(actions?.length && !(actions[0] instanceof Action)) {
					actions = actions.map(act => Action.fromJSON(act))
					data.set(name, actions)
				}
				el.setItems(actions ?? [])
			} else if(el.tagName.toLowerCase() === "dbe-list") {
				let elements = data.get(name)
				if(elements?.length && !(elements[0] instanceof CustomElement)) {
					elements = elements.map(act => CustomElement.fromJSON(act))
					data.set(name, elements)
				}
				el.setItems(elements ?? [])
			} else if (el.tagName.toLowerCase() === 'dbe-select') {
				el.setValue(data.get(name))
			} else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
				el.options.forEach((o) => {
					if (data.get(name).indexOf(o.value) !== -1) o.selected = true;
				});
			} else if (el.tagName.toLowerCase() === 'select') {
				el.options.forEach((o) => {
					if (data.get(name) === o.value) o.selected = true;
				});
			} else if (el.tagName.toLowerCase() === 'checkbox' && data.has(name)) {
				el.checked = data.get(name);
			} else if (el.value !== undefined && data.has(name)) {
				el.value = data.get(name);
			}
		})
	}

	loadBots() {
		invoke("load_bots").then(data => {
			const bots = JSON.parse(data);
			const selected = Number(localStorage.getItem("selectedBot") ?? 0)
			bots.forEach(async (bot, i) => {
				const botClass = new Bot(bot.name, bot.path);
				this.bots.push(botClass);
				if(i === selected) this.selectedBot = botClass;
			})
		})
	}

	copyBotFiles(path) {
		return new Promise(async (resolve, reject) => {
			listen('finished_copying', () => {
				setTimeout(() => resolve(true), 5000)
			})
			invoke('copy_bot_files', {bot_path:path});
		})
	}

	async createBot(name, path) {
		name = name.trim()
		path = path.trim()
		await this.copyBotFiles(path)
		const bot = new Bot(name, path)
		this.bots.push(bot)
		if(this.bots.length === 1) this.selectedBot = bot
		await invoke("save_bots", {json:JSON.stringify(this.bots)})
		alert("Bot created successfully!")
	}

	async deleteBot(name, path) {
		this.bots = this.bots.filter(bot => bot.name !== name && bot.path !== path)
		await invoke("save_bots", {json:JSON.stringify(this.bots)})
	}

	saveBotSettings(botName, botPath, botToken, clientSecret, presenceIntent, membersIntent, messageContentIntent) {
		botName = botName.trim()
		botPath = botPath.trim()
		botToken = botToken.trim()
		clientSecret = clientSecret.trim()
		this.selectedBot.name = botName;
		this.selectedBot.path = botPath;
		this.selectedBot.token = botToken;
		this.selectedBot.clientId = atob(botToken.split(".")[0]);
		this.selectedBot.clientSecret = clientSecret
		this.selectedBot.presenceIntent = presenceIntent
		this.selectedBot.membersIntent = membersIntent
		this.selectedBot.messageContentIntent = messageContentIntent
		invoke("save_bot_settings", {
			bot_path: botPath,
			bots_json: JSON.stringify(App.bots),
			settings_json: JSON.stringify({
				token: botToken,
				clientSecret,
				presenceIntent,
				membersIntent,
				messageContentIntent,
			})}
		).then(() => {
			alert("Bot saved successfully!");
		})
	}

	async saveBotData() {
		const extensions = {}
		this.selectedBot.extensions.keys().forEach(key => {
			extensions[key] = this.selectedBot.extensions.get(key)
		})
		await invoke('save_bot_triggers', {bot_path: this.selectedBot.path, triggers_json: JSON.stringify(this.selectedBot.triggers)})
		await invoke('save_bot_extensions', {bot_path: this.selectedBot.path, extensions_json: JSON.stringify(extensions)})
		alert("Project saved successfully!");
	}

	async debugAction(path, trigger, action) {
		const bot = App.bots.find(bot => bot.path === path);
		bot.debugTrigger = bot.debugTriggers.find(t => t.id === trigger)
		await invoke("debug_action", {bot_path: path, trigger_id:trigger, action_id:action})
	}

	async runBot() {
		if(this.selectedBot.isRunning) return;
		await invoke('run_bot', {bot_path: this.selectedBot.path})
		this.selectedBot.isRunning = true;
		this.selectedBot.stdout = ""
		this.selectedBot.debugTriggers = []
	}

	async stopBot() {
		if(!this.selectedBot.isRunning) return;
		this.bots.find(bot => bot.path === this.selectedBot.path).isRunning = false;
		this.removeDebugger(this.selectedBot.path)
		await invoke('stop_bot', {bot_path: this.selectedBot.path}).catch(() => {})
	}

	attachDebugger() {
		const path = this.selectedBot.path
		invoke("attach_debugger", {bot_path: path})
		const debugWindow = new Window(`debug-${this.selectedBot.name.replace(/\s/g, '_')}`, {
			width: 350,
			height: 450,
		});
		debugWindow.setTitle(`Debugging ${this.selectedBot.name}`)
		debugWindow.once('tauri://created', async () => {
			new Webview(debugWindow, `debug-${this.selectedBot.name.replace(/\s/g, '_')}`, {
				url: `/debugger?path=${this.selectedBot.path}&debugTriggers=${encodeURIComponent(JSON.stringify(this.selectedBot.debugTriggers))}`,
				x: 0,
				y: 0,
				width: 350,
				height: 450,
			});
		});
		debugWindow.onCloseRequested(async () => {
			await this.removeDebugger(path, false)
		})
		const variablesWindow = new Window(`variables-${this.selectedBot.name.replace(/\s/g, '_')}`, {
			width: 350,
			height: 450,
		});
		variablesWindow.setTitle(`${this.selectedBot.name[0].toUpperCase()}${this.selectedBot.name.slice(1)}'s variables`)
		variablesWindow.once('tauri://created', async () => {
			new Webview(variablesWindow, `variables-${this.selectedBot.name.replace(/\s/g, '_')}`, {
				url: `/variables?path=${this.selectedBot.path}`,
				x: 0,
				y: 0,
				width: 350,
				height: 450,
			});
		});
		this.windows.set(`${path}-debug`, debugWindow)
		this.windows.set(`${path}-variables`, variablesWindow)
	}

	async removeDebugger(path, close = true) {
		await invoke("remove_debugger", {bot_path: path}).catch(() => {})
		const debugWindow = `${path}-debug`
		const variablesWindow = `${path}-variables`
		if(close && this.windows.has(debugWindow)) this.windows.get(debugWindow).close()
		if(this.windows.has(variablesWindow)) this.windows.get(variablesWindow).close()
		if(this.windows.has(debugWindow)) this.windows.delete(debugWindow)
		if(this.windows.has(variablesWindow)) this.windows.delete(variablesWindow)
	}
}

export const App = new AppClass();