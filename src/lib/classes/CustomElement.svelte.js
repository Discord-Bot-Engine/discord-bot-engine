import {SvelteMap} from "svelte/reactivity";

class CustomElement {
    id = ''
    data = new SvelteMap()
    isCustom = true

    constructor(id) {
        this.id = id;
    }

    toJSON() {
        const data = {}
        this.data.keys().forEach(key => {
            data[key] = this.data.get(key)
        })
        return {isCustom: this.isCustom, data}
    }

    static fromJSON(json) {
        const element = new CustomElement(json.id);
        Object.keys(json.data).forEach((key) => {
            element.data.set(key, json.data[key]);
        })
        return element;
    }
}

export default CustomElement