import {Action} from "./Action.js";

export class CustomElement{
    id = ''
    data = new Map()
    isCustom = true;

    constructor(id){
        this.id = id
    }

    toJSON() {
        const data = {}
        this.data.keys().forEach((key) => {
            data[key] = this.data.get(key);
        })
        return {
            id: this.id,
            data: data,
            isCUSTOM: this.isCustom,
        }
    }

    static fromJSON(json) {
        const element = new CustomElement(json.id)
        Object.keys(json.data).forEach(key => {
            if(Array.isArray(json.data[key]) && json.data[key].every(item => item.isCustom))
                json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
            if(Array.isArray(json.data[key]) && json.data[key].every(item => item.isAction))
                json.data[key] = json.data[key].map(el => Action.fromJSON(el))
            element.data.set(key, json.data[key]);
        })
        return element
    }
}