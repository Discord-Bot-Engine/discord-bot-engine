import { invoke } from '@tauri-apps/api/core';
import {Webview} from "@tauri-apps/api/webview";
import {Window} from "@tauri-apps/api/window";
import {BotManager} from "$lib/classes/BotManager.svelte.js";
import {SvelteMap} from "svelte/reactivity";
import Action from "$lib/classes/Action.svelte.js"

class DebuggerClass {
	windows = new SvelteMap()
	isAttached = $derived(this.windows.has(`${BotManager.selectedBot.path}-debug`))

	async debugAction(path, trigger, action) {
		const bot = BotManager.bots.find(bot => bot.path === path);
		bot.debugTrigger = bot.debugTriggers.find(t => t.id === trigger)
		const actionManager = bot.debugTrigger.actionManagers.find(m => m.actions.find(act => act === action))?.id ?? ""
		await invoke("debug_action", {bot_path: path, trigger_id:trigger, action_id:action, manager_id:actionManager})
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
				url: `/debugger?path=${BotManager.selectedBot.path}`,
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
		variablesWindow.setTitle(`${BotManager.selectedBot.name[0].toUpperCase()}${BotManager.selectedBot.name.slice(1)}'s variables`)
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
		let actions = []
		BotManager.selectedBot.triggers.forEach(trigger => {
			getActions(trigger.actions, actions)
		})
		actions = actions.flat().filter(act => act.isBreakPoint).map(act => act.id)
		actions.forEach(id => this.markAsBreakPoint(id))
		function getActions(acts, actions) {
			acts = acts.map(act => act instanceof Action ? act : Action.fromJSON(act))
			actions.push(acts)
			acts.forEach((act) => {
				act.data.keys().toArray().forEach(key => {
					if(Array.isArray(act.data.get(key)) && act.data.get(key).every(el => el.isAction)) {
						getActions(act.data.get(key), actions)
					}
				})
			})
		}
	}

	markAsBreakPoint(id) {
		invoke("mark_break_point", {bot_path: BotManager.selectedBot.path, action_id:id})
	}

	removeBreakPoint(id) {
		invoke("remove_break_point", {bot_path: BotManager.selectedBot.path, action_id:id})
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