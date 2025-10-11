import {ActionManager} from "../classes/ActionManager.js";

export default class CheckVariableValue {
    static type = "Check Variable Value"
    static title(data) {
        const condition = data.get("condition")
        if(condition === "Includes") return `Check if "${data.get("variable")}" includes "${data.get("value")}"`
        return `Check if "${data.get("variable")}" is ${condition.toLowerCase()} "${data.get("value")}"`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Variable"></dbe-label>
            <dbe-variable-list name="variable" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Condition"></dbe-label>
            <dbe-select name="condition" class="col-span-3" value="Equal to" values="Equal to,Greater than,Less than,Includes"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Value"></dbe-label>
            <dbe-input name="value" class="col-span-3"></dbe-input>
        </div>
        <dbe-action-list name="Run Actions If True" title="Run Actions If True"></dbe-action-list>
        <dbe-action-list name="Run Actions If False" title="Run Actions If False"></dbe-action-list>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable}) {
        const variable = getVariable(data.get("variable"))
        const condition = data.get("condition")
        const value = data.get("value")
        const ifTrue = new ActionManager(actionManager.trigger, `${actionManager.name} -> ${actionManager.runningActionIndex + 1}. ${this.title(data)}: Run Actions If True`, data.get("Run Actions If True"), () => { actionManager.runNext() }, actionManager.onReturn)
        const ifFalse = new ActionManager(actionManager.trigger, `${actionManager.name} -> ${actionManager.runningActionIndex + 1}. ${this.title(data)}: Run Actions If False`, data.get("Run Actions If False"), () => { actionManager.runNext() }, actionManager.onReturn)
        if(condition === "Equal to") {
            if(String(variable) === value) {
                ifTrue.runNext()
            }
            else {
                ifFalse.runNext()
            }
        } else if(condition === "Greater than") {
            if(Number(variable) > Number(value)) {
                ifTrue.runNext()
            }
            else {
                ifFalse.runNext()
            }
        } else if(condition === "Less than") {
            if(Number(variable) < Number(value)) {
                ifTrue.runNext()
            }
            else {
                ifFalse.runNext()
            }
        }  else if(condition === "Includes") {
            if(variable.includes(value)) {
                ifTrue.runNext()
            }
            else {
                ifFalse.runNext()
            }
        }
    }
}