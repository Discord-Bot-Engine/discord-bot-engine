import CustomElement from "$lib/classes/CustomElement.svelte.js";

class AppClass {
	selectedTrigger = $state(null);
	windows = new Map()
	saveUIData(ref, data) {
		data.clear()
		const marked = ref.querySelectorAll("*[name]")
		marked.forEach(el => {
			if(el.hasAttribute("ignoreParsing")) return;
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
}

export const App = new AppClass();