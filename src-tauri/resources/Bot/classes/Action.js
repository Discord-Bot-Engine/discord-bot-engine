import {Bot} from "./Bot.js";
import {CustomElement} from "./CustomElement.js";

export class Action{
    id = ''
    type = ''
    data = new Map()
    isAction = true

    constructor(id, type) {
        this.id = id
        this.type = type
    }

    load(context) {
        Bot.actionClasses.find(t => t.type === this.type)?.load({...context, id:this.id, data:context.actionManager.parseFields(this.data)})
    }

    async run(context) {
        try {
            await Bot.actionClasses.find(act => act.type === this.type).run({
                ...context,
                id: this.id,
                data: context.actionManager.parseFields(this.data)
            })
        } catch(error) {
            if(Bot.debugger) return console.log(error.stack)
            console.log(`Error at: ${context.actionManager.name}\nAction number: ${context.actionManager.runningActionIndex}\nError: ${error.stack}`)
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
            isAction: this.isAction
        }
    }

    static fromJSON(json) {
        const action = new Action(json.id, json.type)
        Object.keys(json.data).forEach(key => {
            if(Array.isArray(json.data[key]) && json.data[key].every(item => item.isCustom))
                json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
            if(Array.isArray(json.data[key]) && json.data[key].every(item => item.isAction))
                json.data[key] = json.data[key].map(el => Action.fromJSON(el))
            action.data.set(key, json.data[key]);
        })
        return action
    }
}