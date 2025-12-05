import { ActionManager } from "./ActionManager.js";
import { Bot } from "./Bot.js";
import { CustomElement } from "./CustomElement.js";
import { Action } from "./Action.js";

export class Trigger {
    id = "";
    name = "";
    type = "";
    data = new Map();
    actions = []
    edges = []
    lastManager = null

    constructor(id, name, type, actions, edges) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.actions = actions;
        this.edges = edges;
    }

    load() {
        const triggerClass = Bot.triggerClasses.find((t) => t.type === this.type);
        if (!triggerClass) return;
        Bot.client.on(triggerClass.event, (...args) => this.run(...args));
        const actionManager = new ActionManager(this)
        triggerClass.load({
            id: this.id,
            data: actionManager.parseFields(this.data),
            rawData: this.data,
            actionManager,
            setVariable: actionManager.setVariable.bind(actionManager),
            getVariable: actionManager.getVariable.bind(actionManager),
        });
        actionManager.actions.forEach((action) =>
            action.load({
                actionManager,
                setVariable: actionManager.setVariable.bind(actionManager),
                getVariable: actionManager.getVariable.bind(actionManager),
            })
        );
    }

    async run(...args) {
        const actionManager = new ActionManager(this)
        const triggerClass = Bot.triggerClasses.find((t) => t.type === this.type);
        if (
            !triggerClass.runIf(
                {
                    id: this.id,
                    data: actionManager.parseFields(this.data),
                    rawData: this.data,
                    actionManager,
                    setVariable: actionManager.setVariable.bind(actionManager),
                    getVariable: actionManager.getVariable.bind(actionManager),
                },
                ...args
            )
        )
            return;
        if (Bot.debugger) {
            const data = {};
            this.data.keys().forEach((key) => {
                data[key] = this.data.get(key);
            });
            Bot.sendDebugData({
                id: this.id,
                name: this.name,
                data,
                type: this.type,
                actions: this.actions.map((act) => {
                    const data = {};
                    act.data.keys().forEach((key) => {
                        data[key] = act.data.get(key);
                    });
                    return { ...act, data };
                }),
            });
        }
        try {
            await triggerClass.run(
                {
                    id: this.id,
                    data: actionManager.parseFields(this.data),
                    rawData: this.data,
                    actionManager: actionManager,
                    setVariable: actionManager.setVariable.bind(actionManager),
                    getVariable: actionManager.getVariable.bind(actionManager),
                },
                ...args
            );
            if (Bot.debugger) Bot.sendVariablesData(this, actionManager.variables);
        } catch (error) {
            console.log(`Error at trigger: ${this.name}\nError: ${error.stack}`);
        }
    }

    toJSON() {
        const data = {};
        this.data.keys().forEach((key) => {
            data[key] = this.data.get(key);
        });
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            data,
        };
    }

    static fromJSON(json) {
        const trigger = new Trigger(
            json.id,
            json.name,
            json.type,
            json.actions.map((act) => Action.fromJSON(act)),
            json.edges
        );
        Object.keys(json.data).forEach((key) => {
            if(Array.isArray(json.data[key]) && json.data[key].every(el => typeof el === 'object' && !Array.isArray(el) && el !== null))
                json.data[key] = json.data[key].map(el => CustomElement.fromJSON(el))
            trigger.data.set(key, json.data[key]);
        });
        return trigger;
    }
}
