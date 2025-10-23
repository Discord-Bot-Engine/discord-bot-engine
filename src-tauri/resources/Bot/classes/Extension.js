import {Bot} from "./Bot.js";
import {CustomElement} from "./CustomElement.js";
import {Action} from "./Action.js";

export class Extension{
    data = new Map()

    load(type) {
        Bot.extensionClasses.find(t => t.type === type)?.load({data:this.data})
    }

    static fromJSON(json = { data: {} }) {
        const extension = new Extension()
        Object.keys(json.data).forEach(key => {
            if(Array.isArray(json.data[key]) && json.data[key].every(item => item.isCustom))
                json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
            if(Array.isArray(json.data[key]) && json.data[key].every(item => item.isAction))
                json.data[key] = json.data[key].map(el => Action.fromJSON(el))
            extension.data.set(key, json.data[key]);
        })
        return extension
    }
}