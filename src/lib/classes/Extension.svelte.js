import {SvelteMap} from "svelte/reactivity";
import CustomElement from "$lib/classes/CustomElement.svelte.js";

class Extension {
    data = new SvelteMap()
    isModified = false

    toJSON() {
        const data = {};
        [...this.data.keys()].forEach(key => {
            data[key] = this.data.get(key)
        })
        return {data}
    }

    static fromJSON(json) {
        const extension = new Extension();
        Object.keys(json.data).forEach((key) => {
            if(Array.isArray(json.data[key]) && json.data[key].every(el => typeof el === 'object' && !Array.isArray(el) && el !== null))
                json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
            extension.data.set(key, json.data[key]);
        })
        return extension;
    }
}

export default Extension