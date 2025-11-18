import { start, clearActivity, setActivity } from "tauri-plugin-drpc";
import { Activity, Timestamps, Button } from "tauri-plugin-drpc/activity";
import {BotManager} from "$lib/classes/BotManager.svelte.js";
import {invoke} from "@tauri-apps/api/core";

class AppClass {
	selectedTrigger = $state(null);
	selectedAction = $derived(this.selectedTrigger?.actions.find(act => act.selected))
	isEditingAction = $state(false);
	hideTriggers = $state(false);
	hideVariables = $state(false);
	hideConsole = $state(false);
	themes = $state([])
	selectedTheme = $state(null)
	selectedLanguage = $state("en")
	loadedTranslations = false
	translations = {}

	constructor() {
		start("1435285281652867095")
		this.loadThemes()
		this.loadTranslations()
	}

	async translate(text, lang) {
		if(lang === "en") return text;
		if(!this.translations[lang]) {
			this.translations[lang] = {}
		}
		if(!this.translations[lang][text]) this.translations[lang][text] = await translate(text, lang)
		await invoke("save_translation", {name:lang,translation:JSON.stringify(this.translations[lang])})
		return this.translations[lang][text]
		async function translate(text, lang) {
			const client = "gtx";
			const sl = "en";
			const tl = lang;
			const hl = "en-US";
			const dt1 = "t";
			const dt2 = "bd";
			const dj = "1";
			const source = "input";
			const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=${client}&sl=${sl}&tl=${tl}&hl=${hl}&dt=${dt1}&dt=${dt2}&dj=${dj}&source=${source}&q=${encodeURIComponent(text)}`).then(res => res.json())
			return data.sentences[0].trans
		}
	}

	async loadTranslations() {
		this.translations = JSON.parse(await invoke("load_translations"))
		this.selectedLanguage = localStorage.getItem("language") ?? "en"
	}

	async loadThemes() {
		this.themes = await invoke("load_themes")
		this.selectedTheme = localStorage.getItem("theme") ?? null
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
				new Button("Join Discord", "https://discord.gg/wNCFpR6JJX")
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
			this.initUI(this.ref)
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

	initUI(ref) {
		const marked = ref.querySelectorAll("*[name]")
		marked.forEach(el => {
			el.init?.()
		})
	}
}

export const App = new AppClass();