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
            console.log(`Error at trigger: ${context.actionManager.trigger.name} (${context.actionManager.trigger.type})\nAction path: ${this.getErrorPath(context.actionManager.trigger, this.id)}\nError: ${error.stack}`)
        }

    }

    getActionDisplayName(action) {
        const actionClass = Bot.actionClasses.find(act => act.type === action.type);
        if (!actionClass) return action.type || "Unknown";

        if (action.data.size === 0 || !actionClass.title) return action.type;

        const title = actionClass.title(action.data);
        return title || action.type;
    }

    getErrorPath(trigger, targetId, currentAction = null, prefix = "") {
        const actions = currentAction ? [currentAction] : trigger.actionManager.actionList;

        for (let i = 0; i < actions.length; i++) {
            const act = actions[i];
            const actionPrefix = currentAction ? prefix : `${i + 1}. `;
            const actionLabel = `${actionPrefix}${this.getActionDisplayName(act)}`;

            if (act.id === targetId) {
                return actionLabel;
            }

            for (const key of Array.from(act.data.keys())) {
                const value = act.data.get(key);

                if (!Array.isArray(value)) continue;

                if (value.some(el => el.isAction)) {
                    for (let j = 0; j < value.length; j++) {
                        const nestedAct = value[j];

                        const nestedPrefix = `${actionLabel} -> ${key}: ${j + 1}. `;
                        const nestedLabel = `${nestedPrefix}${this.getActionDisplayName(nestedAct)}`;

                        if (nestedAct.id === targetId) {
                            return nestedLabel;
                        }

                        const result = this.getErrorPath(trigger, targetId, nestedAct, nestedPrefix);
                        if (result) return result;
                    }
                }

                if (value.some(el => el.isCustom)) {
                    for (let j = 0; j < value.length; j++) {
                        const customEl = value[j];

                        const customPrefix = `${actionLabel} -> ${key} ${j + 1}`;
                        const result = this.searchInCustomElement(trigger, targetId, customEl, customPrefix);
                        if (result) return result;
                    }
                }
            }
        }

        return null;
    }

    searchInCustomElement(trigger, targetId, customEl, prefix) {
        for (const customKey of Array.from(customEl.data.keys())) {
            const customValue = customEl.data.get(customKey);

            if (!Array.isArray(customValue)) continue;

            if (customValue.some(el => el.isAction)) {
                for (let i = 0; i < customValue.length; i++) {
                    const nestedAct = customValue[i];

                    const nestedPrefix = `${prefix}: ${customKey}: ${i + 1}. `;
                    const nestedLabel = `${nestedPrefix}${this.getActionDisplayName(nestedAct)}`;

                    if (nestedAct.id === targetId) {
                        return nestedLabel;
                    }

                    const result = this.getErrorPath(trigger, targetId, nestedAct, nestedPrefix);
                    if (result) return result;
                }
            }

            if (customValue.some(el => el.isCustom)) {
                for (let i = 0; i < customValue.length; i++) {
                    const nestedCustomEl = customValue[i];

                    const nestedPrefix = `${prefix}: ${customKey} ${i + 1}`;
                    const result = this.searchInCustomElement(trigger, targetId, nestedCustomEl, nestedPrefix);
                    if (result) return result;
                }
            }
        }

        return null;
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