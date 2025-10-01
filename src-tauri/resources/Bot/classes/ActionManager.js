import {Bot} from "./Bot.js";
import {Action} from "./Action.js";
export class ActionManager {
    name = ""
    trigger = {}
    actionList = []
    variables = new Map()
    runningActionIndex = 0
    onFinish = () => {}
    onReturn = () => {}

    constructor(trigger, name, actionList, variables = new Map(), onFinish = () => {}, onReturn = () => {})
    {
        this.trigger = trigger;
        this.name = name;
        this.actionList = actionList;
        this.variables = variables;
        this.onFinish = onFinish;
        this.onReturn = onReturn;
    }

    reset() {
        this.variables = new Map();
        this.runningActionIndex = 0;
    }

    runNext() {
        const action = this.actionList[this.runningActionIndex];
        if(Bot.debugger.breakPoints.includes(action.id)) return;
        if(this.runningActionIndex >= this.actionList.length) return this.onFinish();
        this.runningActionIndex++;
        action.run({
            actionManager: this
        });
    }

    setVariable(name, value) {
        this.variables.set(name, value);
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
            if(typeof result !== "string") return parsed.set(item, result);
            parsed.set(item, this.eval(result));
        });
        return parsed;
    }

    eval(text) {
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
                } catch {
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