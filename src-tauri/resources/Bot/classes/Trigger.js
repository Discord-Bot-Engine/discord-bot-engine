import {ActionManager} from "./ActionManager.js";
import {Bot} from "./Bot.js";
import {CustomElement} from "./CustomElement.js";
import {Action} from "./Action.js";

export class Trigger {
    id = ''
    name = ''
    type = ''
    data = new Map()
    variables = new Map()
    actionManager = null
    actionManagers = []

    constructor(id, name, type, actions) {
        this.id = id;
        this.name = name
        this.type = type
        this.actionManager = new ActionManager(this, this.name, actions)
    }

    load() {
        const triggerClass = Bot.triggerClasses.find(t => t.type === this.type)
        if(!triggerClass) return;
        Bot.client.on(triggerClass.event, (...args) => this.run(...args))
        triggerClass.load({
            id: this.id,
            data: this.actionManager.parseFields(this.data),
            rawData: this.data,
            actionManager: this.actionManager,
            setVariable: this.setVariable.bind(this),
            getVariable: this.getVariable.bind(this),
        })
        this.actionManager.actionList.forEach(action => action.load({actionManager: this.actionManager, setVariable: this.setVariable.bind(this), getVariable: this.getVariable.bind(this)}))
    }

    addActionManager(manager) {
        if(this.actionManagers.find(m => m.id === manager.id)) return;
        this.actionManagers.push(manager)
        Bot.sendDebugData({
            type:"ACTION_MANAGERS",
            data: {
                id: this.id,
                actionManagers: this.actionManagers.map(m => ({id: m.id, canReset: m.canReset, actions: m.actionList.map(action => action.id)}))
            }
        })
    }

    async run(...args) {
        this.actionManager.reset()
        this.actionManagers = []
        if(Bot.debugger){
            const data = {}
            this.data.keys().forEach(key => {
                data[key] = this.data.get(key)
            })
            Bot.sendDebugData({
                type:"TRIGGER",
                data: {
                    id: this.id,
                    name: this.name,
                    data,
                    type: this.type,
                    actions: this.actionManager.actionList.map(act => {
                        const data = {}
                        act.data.keys().forEach(key => {
                            data[key] = act.data.get(key)
                        })
                        return {...act, data}
                    })
                }
            })
        }
        try {
            await Bot.triggerClasses.find(t => t.type === this.type).run({
                id: this.id,
                data: this.actionManager.parseFields(this.data),
                rawData: this.data,
                actionManager: this.actionManager,
                setVariable: this.setVariable.bind(this),
                getVariable: this.getVariable.bind(this)
            }, ...args)
            if(Bot.debugger) Bot.sendVariablesData(this)
        } catch(error) {
            console.log(`Error at trigger: ${this.name}\nError: ${error.stack}`)
        }
    }

    setVariable(name, value) {
        this.variables.set(name, value);
        Bot.sendVariablesData(this);
    }

    getVariable(name) {
        return this.variables.get(name);
    }

    toJSON() {
        const data = {}
        this.data.keys().forEach(key => {
            data[key] = this.data.get(key)
        })
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            data
        }
    }

    static fromJSON(json) {
        const trigger = new Trigger(json.id, json.name, json.type, json.actions.map(act => Action.fromJSON(act)))
        Object.keys(json.data).forEach(key => {
            if(Array.isArray(json.data[key]) && json.data[key].every(item => item.isCustom))
                json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
            if(Array.isArray(json.data[key]) && json.data[key].every(item => item.isAction))
                json.data[key] = json.data[key].map(el => Action.fromJSON(el))
            trigger.data.set(key, json.data[key]);
        })
        return trigger;
    }
}