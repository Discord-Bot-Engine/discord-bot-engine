import { invoke } from '@tauri-apps/api/core';
import {Webview} from "@tauri-apps/api/webview";
import {getAllWindows, Window} from "@tauri-apps/api/window";
import {BotManager} from "$lib/classes/BotManager.svelte.js";
import {SvelteMap} from "svelte/reactivity";
import Action from "$lib/classes/Action.svelte.js"

class DebuggerClass {
	windows = $state([])
	isAttached = $derived(this.windows.find(w => w.label === `debug-${BotManager.selectedBot.name.replace(/\s/g, '_')}`))

	async debugAction(path, trigger, action) {
		await invoke("debug_action", {bot_path: path, trigger_id:trigger, action_id:action})
	}

	attachVariablesWindow(trigger) {
		const variablesWindow = new Window(`variables-${BotManager.selectedBot.name.replace(/\s/g, '_')}-${trigger.id}`, {
			width: 350,
			height: 450,
		});
		variablesWindow.once('tauri://created', async () => {
			variablesWindow.setTitle(`${trigger.name[0].toUpperCase()}${trigger.name.slice(1).toLowerCase()}'s variables`)
			const webview = new Webview(variablesWindow, `variables-${BotManager.selectedBot.name.replace(/\s/g, '_')}-${trigger.id}`, {
				url: `/variables?path=${BotManager.selectedBot.path}&trigger=${trigger.id}`,
				x: 0,
				y: 0,
				width: 350,
				height: 450,
			});
			webview.once("load" ,() => {
				const debugVariables = {}
				trigger.debugVariables.keys().forEach(key => {
					debugVariables[key] = trigger.debugVariables.get(key);
				})
				webview.emit("data", JSON.stringify(debugVariables))
			})
		});
		return variablesWindow
	}

	attachDebugger() {
		const path = BotManager.selectedBot.path
		invoke("attach_debugger", {bot_path: path})
		const debugWindow = new Window(`debug-${BotManager.selectedBot.name.replace(/\s/g, '_')}`, {
			width: 350,
			height: 450,
		});
		debugWindow.once('tauri://created', async () => {
			debugWindow.setTitle(`Debugging ${BotManager.selectedBot.name}`)
			this.windows = await getAllWindows()
			const webview = new Webview(debugWindow, `debug-${BotManager.selectedBot.name.replace(/\s/g, '_')}`, {
				url: `/debugger?path=${BotManager.selectedBot.path}`,
				x: 0,
				y: 0,
				width: 350,
				height: 450,
			});
			webview.once("load" ,() => {
				webview.emit("data", JSON.stringify(BotManager.selectedBot.triggers.map(t => t.toDebuggerJSON())))
			})
		});
		debugWindow.onCloseRequested(async (ev) => {
			await this.removeDebugger(path)
		})
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

	async removeDebugger(path) {
		this.windows = await getAllWindows()
		const bot = BotManager.bots.find(b => b.path === path)
		const debugWindow = `debug-${bot.name.replace(/\s/g, '_')}`
		const w = this.windows.find(w => w.label === debugWindow)
		await invoke("remove_debugger", {bot_path: path}).catch(() => {})
		this.windows.forEach(w => {
			if(w.label.startsWith(`variables-${bot.name.replace(/\s/g, '_')}`)) w.close()
		})
		w?.close()
		this.windows = await getAllWindows()
	}
}

export const Debugger = new DebuggerClass();