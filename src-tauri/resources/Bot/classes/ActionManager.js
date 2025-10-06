import {Bot} from "./Bot.js";
import { v4 as uuidv4 } from 'uuid';

export class ActionManager {
    id = uuidv4()
    name = ""
    trigger = {}
    actionList = []
    variables = new Map()
    runningActionIndex = 0
    canReset = false
    onFinish = () => {}
    onReturn = () => {}
    onReset = () => {}

    constructor(trigger, name, actionList, variables = new Map(), onFinish = () => {}, onReturn = () => {}, onReset = null)
    {
        this.trigger = trigger;
        this.name = name;
        this.actionList = actionList;
        this.variables = variables;
        this.onFinish = onFinish;
        this.onReturn = onReturn;
        if(onReset) {
            this.onReset = onReset;
            this.canReset = true;
        }
        trigger.addActionManager(this)
    }

    reset() {
        this.variables = new Map();
        this.runningActionIndex = 0;
    }

    runNext(ignoreCheck) {
        const action = this.actionList[this.runningActionIndex];
        if(this.runningActionIndex >= this.actionList.length) return this.onFinish();
        if(Bot.debugger?.breakPoints.includes(action.id) && !ignoreCheck) return;
        this.runningActionIndex++;
        action.run({
            actionManager: this
        });
    }

    setVariable(name, value) {
        this.variables.set(name, value);
        Bot.sendVariablesData(this.trigger);
    }

    getVariable(name) {
        return this.variables.get(name);
    }

    parseFields(data) {
        const parsed = new Map();
        const variables = {};
        this.variables.keys().forEach(key => {
            variables[key] = this.variables.get(key);
        });
        data.keys().forEach(item => {
            let result = data.get(item);
            if(typeof result !== "string") {
                if(Array.isArray(result) && result.every(e => e.isCustom)) {
                    const elements = []
                    result.forEach(item => {
                        const obj = {...item, data: this.parseFields(item.data)}
                        elements.push(obj)
                    })
                    return parsed.set(item, elements);
                } else
                    return parsed.set(item, result);
            }
            parsed.set(item, this.eval(result, variables));
        });
        return parsed;
    }

    eval(text, variables) {
        let result = "";
        let i = 0;

        while (i < text.length) {
            if (text[i] === "$" && text[i + 1] === "{") {
                let depth = 1;
                let j = i + 2;

                while (j < text.length && depth > 0) {
                    if (text[j] === "{" && text[j - 1] !== "\\") depth++;
                    else if (text[j] === "}" && text[j - 1] !== "\\") depth--;
                    j++;
                }

                const expr = text.slice(i, j);
                try {
                    result += eval("`" + expr + "`");
                } catch(e) {
                    result += expr;
                }
                i = j;
            } else if (text[i] === "`" && text[i - 1] !== "\\") {
                result += "\\`";
                i++;
            } else {
                result += text[i++];
            }
        }
        return result;
    }
}