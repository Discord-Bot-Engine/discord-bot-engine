import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import Bot from "$lib/classes/Bot.svelte.js";
import Trigger from "$lib/classes/Trigger.svelte.js";
import {Debugger} from "$lib/classes/Debugger.svelte.js";
import {App} from "$lib/classes/App.svelte.js"

class BotManagerClass {
	selectedBot = $state(null);
	bots = $state([]);
	constructor() {
		listen("plugins", ({payload}) => {
			if(payload[1].trim() === "RERUN") return invoke("load_bot_plugins", {bot_path: payload[0]})
			const plugins = JSON.parse(payload[1])
			const bot = this.bots.find(b => b.path === payload[0])
			if(plugins.type === "extensions") {
				bot.extensionClasses = plugins.data
				bot.extensionClasses.forEach(p => {
					if(p.open) p.open = eval(`(${p.open.replace("open", "function ")})`)
					if(p.close) p.close = eval(`(${p.close.replace("close", "function ")})`)
				})
				bot.isLoading = false
			}
			if(plugins.type === "triggers") {
				bot.triggerClasses = plugins.data
				bot.triggerClasses.forEach(p => {
					if(p.open) p.open = eval(`(${p.open.replace("open", "function ")})`)
					if(p.close) p.close = eval(`(${p.close.replace("close", "function ")})`)
				})
			}
			if(plugins.type === "actions") {
				bot.actionClasses = plugins.data
				bot.actionClasses.forEach(p => {
					if(p.open) p.open = eval(`(${p.open.replace("open", "function ")})`)
					if(p.close) p.close = eval(`(${p.close.replace("close", "function ")})`)
				})
			}
		})
		listen('stdout', ({payload}) => {
			const bot = this.bots.find(b => b.path === payload[0])
			if(payload[1].startsWith("$DEBUGGER$$$")) {
				const data = JSON.parse(payload[1].replace("$DEBUGGER$$$", ""))
				const trigger = Trigger.fromJSON(data)
				bot.triggers.find(t => t.id === trigger.id).showInDebugger = true
				return;
			} else if(payload[1].startsWith("$VARIABLE$$$")) {
				const { name, value, triggerId } = JSON.parse(payload[1].replace("$VARIABLE$$$", ""))
				bot.triggers.find(t => t.id === triggerId).debugVariables.set(name, value)
				return;
			}
			bot.stdout += payload[1]
		})
		this.loadBots()
	}

	selectBot(bot) {
		bot.loadFiles()
		this.selectedBot = bot
		App.updateActivity(true)
	}

	loadBots() {
		invoke("load_bots").then(data => {
			const bots = JSON.parse(data);
			const selected = Number(localStorage.getItem("selectedBot") ?? 0)
			bots.forEach(async (bot, i) => {
				const botClass = new Bot(bot.name, bot.path);
				this.bots.push(botClass);
				if(i === selected) this.selectBot(botClass)
			})
		})
	}

	copyBotFiles(path) {
		return new Promise(async (resolve) => {
			const unlisten = await listen('finished_copying', () => {
				setTimeout(() => resolve(true), 5000)
				unlisten()
			})
			invoke('copy_bot_files', {bot_path:path});
		})
	}

	updateBotFiles() {
		return new Promise(async (resolve) => {
			this.selectedBot.isLoading = true
			const unlisten = await listen('finished_copying', async () => {
				await this.selectedBot.loadFiles()
				setTimeout(() => resolve(true), 5000)
				unlisten()
			})
			invoke('update_bot_files', {bot_path:this.selectedBot.path});
		})
	}

	async createBot(name, path) {
		name = name.trim()
		path = path.trim()
		await this.copyBotFiles(path)
		const bot = new Bot(name, path)
		this.bots.push(bot)
		if(this.bots.length === 1) this.selectBot(bot)
		await invoke("save_bots", {json:JSON.stringify(this.bots)})
	}

	async deleteBot(name, path) {
		this.bots = this.bots.filter(bot => bot.name !== name && bot.path !== path)
		await invoke("save_bots", {json:JSON.stringify(this.bots)})
		if(name === this.selectedBot?.name && path === this.selectedBot.path) {
			this.selectedBot = null;
		}
		App.updateActivity()
	}

	saveBotSettings(botName, botPath, botToken, clientSecret, dashboardPort, dashboardTheme, url, username, password, presenceIntent, membersIntent, messageContentIntent) {
		botName = botName.trim()
		botPath = botPath.trim()
		botToken = botToken.trim()
		clientSecret = clientSecret.trim()
		dashboardPort = dashboardPort.trim()
		url = url.trim()
		username = username.trim()
		password = password.trim()
		const reload = this.selectedBot.path !== botPath
		this.selectedBot.name = botName;
		this.selectedBot.path = botPath;
		this.selectedBot.token = botToken;
		this.selectedBot.clientId = atob(botToken.split(".")[0]);
		this.selectedBot.clientSecret = clientSecret
		this.selectedBot.port = dashboardPort
		this.selectedBot.theme = dashboardTheme
		this.selectedBot.url = url;
		this.selectedBot.username = username;
		this.selectedBot.password = password;
		this.selectedBot.presenceIntent = presenceIntent
		this.selectedBot.membersIntent = membersIntent
		this.selectedBot.messageContentIntent = messageContentIntent
		App.updateActivity()
		invoke("save_bot_settings", {
			bot_path: botPath,
			bots_json: JSON.stringify(this.bots),
			settings_json: JSON.stringify({
				token: botToken,
				clientSecret,
				port: dashboardPort,
				theme: dashboardTheme,
				url,
				username,
				password,
				presenceIntent,
				membersIntent,
				messageContentIntent,
			}),
			theme: dashboardTheme
			}
		).then(() => {
			alert("Project saved successfully!");
			if(reload) this.selectedBot.loadFiles()
		})
	}

	async saveBotData() {
		if(!this.selectedBot.modifiedTriggers.length && !this.selectedBot.removedTriggers.length && !this.selectedBot.extensions.keys().some(key => this.selectedBot.extensions.get(key).isModified)) return
		const extensions = {}
		this.selectedBot.extensions.keys().forEach(key => {
			const ext = this.selectedBot.extensions.get(key)
			ext.isModified = false
			extensions[key] = ext
		})
		const triggerContents = this.selectedBot.modifiedTriggers.filter(id => this.selectedBot.triggers.find(t => t.id === id)).map(id => JSON.stringify(this.selectedBot.triggers.find(t => t.id === id)))
		await invoke('save_bot_triggers', {bot_path: this.selectedBot.path, modified_triggers: this.selectedBot.modifiedTriggers, trigger_contents: triggerContents, removed_triggers: this.selectedBot.removedTriggers})
		await invoke('save_bot_extensions', {bot_path: this.selectedBot.path, extensions_json: JSON.stringify(extensions)})
		this.selectedBot.modifiedTriggers = []
		this.selectedBot.removedTriggers = []
		alert("Project saved successfully!");
	}

	async runBot() {
		if(this.selectedBot.isRunning) return;
		await this.saveBotData()
		await invoke('run_bot', {bot_path: this.selectedBot.path})
		this.selectedBot.isRunning = true;
		this.selectedBot.stdout = ""
		this.selectedBot.triggers.forEach(t => t.showInDebug = false)
	}

	async stopBot() {
		if(!this.selectedBot.isRunning) return;
		this.bots.find(bot => bot.path === this.selectedBot.path).isRunning = false;
		Debugger.removeDebugger(this.selectedBot.path)
		await invoke('stop_bot', {bot_path: this.selectedBot.path}).catch(() => {})
	}

	async uploadBotFiles() {
			try {
				this.selectedBot.isLoading = true
				const base = this.selectedBot.url.replace("sftp://", "").split(":")
				const host = base[0]
				const port = base[1]
				await invoke("upload_bot", {
					host,
					port,
					username:this.selectedBot.username,
					password:this.selectedBot.password,
					bot_path: this.selectedBot.path
				});
				setTimeout(() => this.selectedBot.isLoading = false, 5000)
			} catch (err) {
				alert(`SFTP error: ${err}`);
				this.selectedBot.isLoading = false
			}
	}
}

export const BotManager = new BotManagerClass();