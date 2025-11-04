import {Bot} from "./Bot.js";
import {CustomElement} from "./CustomElement.js";

export class Action{
    id = ''
    type = ''
    data = new Map()

    constructor(id, type) {
        this.id = id
        this.type = type
    }

    load(context) {
        Bot.actionClasses.find(t => t.type === this.type)?.load({
            ...context,
            id:this.id,
            data: context.actionManager.parseFields(this.data),
            rawData: this.data
        })
    }

    async run(context) {
        try {
            await Bot.actionClasses.find(act => act.type === this.type).run({
                ...context,
                id: this.id,
                data: context.actionManager.parseFields(this.data),
                rawData: this.data
            })
        } catch(error) {
            const action = this.type ? `${context.actionManager.actions.filter(act => act.type !== "group").findIndex(act => act.id === this.id)}. ${this.type}` : "root"
            console.log(`Error at trigger: ${context.actionManager.trigger.name} (${context.actionManager.trigger.type})\nAction: ${action}\n${error.stack}`)
        }

    }

    toJSON() {
        const data = {}
        this.data.keys().forEach(key => {
            data[key] = this.data.get(key)
        })
        return {
            id: this.id,
            type: this.type,
            data,
        }
    }

    static fromJSON(json) {
        const action = new Action(json.id, json.actionType)
        Object.keys(json.data).forEach(key => {
            if(Array.isArray(json.data[key]) && json.data[key].every(el => typeof el === 'object' && !Array.isArray(el) && el !== null))
                json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
            action.data.set(key, json.data[key]);
        })
        return action
    }
}