import {SvelteMap} from "svelte/reactivity";

class Extension {
    data = new SvelteMap()

    toJSON() {
        const data = {}
        this.data.keys().forEach(key => {
            data[key] = this.data.get(key)
        })
        return {data}
    }

    static fromJSON(json) {
        const extension = new Extension();
        Object.keys(json.data).forEach((key) => {
            extension.data.set(key, json.data[key]);
        })
        return extension;
    }
}

export default Extension