import { start, clearActivity, setActivity } from "tauri-plugin-drpc";
import { Activity, Timestamps, Button } from "tauri-plugin-drpc/activity";
import {BotManager} from "$lib/classes/BotManager.svelte.js";

class AppClass {
	selectedTrigger = $state(null);
	selectedAction = $derived(this.selectedTrigger?.actions.find(act => act.selected))
	isEditingAction = $state(false);
	hideTriggers = $state(false);
	hideVariables = $state(false);
	hideConsole = $state(false);
	constructor() {
		start("1435285281652867095")
	}
	updateActivity(updateTimestamp) {
		const state = new Activity()
		if(BotManager.selectedBot) {
			state.setDetails(`Discord Bot Engine - ${BotManager.selectedBot.name}`)
			if(App.selectedTrigger) {
				state.setState(`${App.selectedTrigger.name} - ${App.selectedTrigger.actions.length} actions`)
			}
		}
		state.setButton(
			[
				new Button("Buy", "https://discordbotengine.itch.io/discord-bot-engine"),
				new Button("Join Discord", "https://discord.gg/m3NBtzCc")
			]
		)
		if(updateTimestamp) {
			state.setTimestamps(new Timestamps(Date.now()))
		}
		setActivity(state)
	}
	updateUndo() {
		BotManager.selectedBot.markAsModified(this.selectedTrigger.id);
		const newActions = []
		App.selectedTrigger.actions.forEach(action => {
			const data = {}
			action.data.keys().forEach(key => {
				data[key] = action.data.get(key)
			})
			newActions.push({...action, data})
		})
		BotManager.selectedBot.undos.push(JSON.stringify({actions: newActions, edges: App.selectedTrigger.edges}))
		BotManager.selectedBot.undos = BotManager.selectedBot.undos.filter((s,i) => BotManager.selectedBot.undos.indexOf(s) === i);
		BotManager.selectedBot.redos = []
	}
	ref = null
	handlersCopy = {}
	openAction() {
		const actionClass = BotManager.selectedBot.actionClasses.find(act => act.type === this.selectedAction.actionType);
		if(!actionClass) return alert("Action failed to load.");
		this.isEditingAction = true;
		let interval = setInterval(async () => {
			if(!this.ref) return;
			clearInterval(interval);
			const data = this.selectedAction.data
			this.loadUIData(this.ref, data)
			this.handlersCopy = window.handlers
			Object.freeze(this.handlersCopy)
			window.handlers = {}
			try {
				await actionClass?.open?.(this.selectedAction, window.handlers)
			} catch (e) {
				alert(`${this.selectedAction.actionType}\n${e.stack}`)
			}
		}, 10)
	}
	saveUIData(ref, data) {
		data.clear()
		const marked = ref.querySelectorAll("*[name]")
		marked.forEach(el => {
			if(el.hasAttribute("ignoreParsing")) return;
			let name = el.getAttribute("name");
			if(el.tagName.toLowerCase() === "dbe-list") {
				data.set(name, el.getItems())
			} else if(el.tagName.toLowerCase() === "dbe-select" || el.tagName.toLowerCase() === "dbe-variable-list") {
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
			if(el.hasAttribute("ignoreParsing")) return;
			let name = el.getAttribute("name");
			if(el.tagName.toLowerCase() === "dbe-list") {
				let elements = data.get(name)
				el.setItems(elements ?? [])
			} else if (el.tagName.toLowerCase() === 'dbe-select' || el.tagName.toLowerCase() === "dbe-variable-list") {
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
}

export const App = new AppClass();