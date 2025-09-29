import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import Bot from "$lib/classes/Bot.svelte.js";
import Trigger from "$lib/classes/Trigger.svelte.js";
import {Debugger} from "$lib/classes/Debugger.svelte.js";

class BotManagerClass {
	selectedBot = $state(null);
	bots = $state([]);
	constructor() {
		listen("plugins", ({payload}) => {
			const plugins = JSON.parse(payload[1])
			const bot = this.bots.find(b => b.path === payload[0])
			bot.isLoading = false
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
			const bot = this.bots.find(b => b.path === payload[0])
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

	selectBot(bot) {
		bot.loadFiles()
		this.selectedBot = bot
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
		if(this.bots.length === 1) this.selectBot(bot)
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
			bots_json: JSON.stringify(this.bots),
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
		const triggerContents = this.selectedBot.modifiedTriggers.map(id => JSON.stringify(this.selectedBot.triggers.find(t => t.id === id)))
		await invoke('save_bot_triggers', {bot_path: this.selectedBot.path, modified_triggers: this.selectedBot.modifiedTriggers, trigger_contents: triggerContents, removed_triggers: this.selectedBot.removedTriggers})
		await invoke('save_bot_extensions', {bot_path: this.selectedBot.path, extensions_json: JSON.stringify(extensions)})
		this.selectedBot.modifiedTriggers = []
		this.selectedBot.removedTriggers = []
		alert("Project saved successfully!");
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
		Debugger.removeDebugger(this.selectedBot.path)
		await invoke('stop_bot', {bot_path: this.selectedBot.path}).catch(() => {})
	}
}

export const BotManager = new BotManagerClass();