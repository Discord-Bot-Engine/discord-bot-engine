import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import Bot from "$lib/classes/Bot.svelte.js";
import {Webview} from "@tauri-apps/api/webview";
import {Window} from "@tauri-apps/api/window";
import Trigger from "$lib/classes/Trigger.svelte.js";
import {BotManager} from "$lib/classes/BotManager.svelte.js";

class DebuggerClass {
	windows = new Map()
	async debugAction(path, trigger, action) {
		const bot = BotManager.bots.find(bot => bot.path === path);
		bot.debugTrigger = bot.debugTriggers.find(t => t.id === trigger)
		await invoke("debug_action", {bot_path: path, trigger_id:trigger, action_id:action})
	}
	attachDebugger() {
		const path = BotManager.selectedBot.path
		invoke("attach_debugger", {bot_path: path})
		const debugWindow = new Window(`debug-${BotManager.selectedBot.name.replace(/\s/g, '_')}`, {
			width: 350,
			height: 450,
		});
		debugWindow.setTitle(`Debugging ${BotManager.selectedBot.name}`)
		debugWindow.once('tauri://created', async () => {
			new Webview(debugWindow, `debug-${BotManager.selectedBot.name.replace(/\s/g, '_')}`, {
				url: `/debugger?path=${BotManager.selectedBot.path}&debugTriggers=${encodeURIComponent(JSON.stringify(BotManager.selectedBot.debugTriggers))}`,
				x: 0,
				y: 0,
				width: 350,
				height: 450,
			});
		});
		debugWindow.onCloseRequested(async () => {
			await this.removeDebugger(path, false)
		})
		const variablesWindow = new Window(`variables-${BotManager.selectedBot.name.replace(/\s/g, '_')}`, {
			width: 350,
			height: 450,
		});
		variablesWindow.setTitle(`${this.selectedBot.name[0].toUpperCase()}${BotManager.selectedBot.name.slice(1)}'s variables`)
		variablesWindow.once('tauri://created', async () => {
			new Webview(variablesWindow, `variables-${BotManager.selectedBot.name.replace(/\s/g, '_')}`, {
				url: `/variables?path=${BotManager.selectedBot.path}`,
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

export const Debugger = new DebuggerClass();