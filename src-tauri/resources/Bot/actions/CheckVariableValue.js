import {ActionManager} from "../classes/ActionManager.js";

export default class CheckVariableValue {
    static type = "Check Variable Value"
    static variableTypes = []
    static outputs = ["true", "false"]
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
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const variable = getVariable(data.get("variable"))
        const condition = data.get("condition")
        const value = data.get("value")
        if(condition === "Equal to") {
            if(String(variable) === value) {
                actionManager.runNext(id, "true")
            }
            else {
                actionManager.runNext(id, "false")
            }
        } else if(condition === "Greater than") {
            if(Number(variable) > Number(value)) {
                actionManager.runNext(id, "true")
            }
            else {
                actionManager.runNext(id, "false")
            }
        } else if(condition === "Less than") {
            if(Number(variable) < Number(value)) {
                actionManager.runNext(id, "true")
            }
            else {
                actionManager.runNext(id, "false")
            }
        }  else if(condition === "Includes") {
            if(variable.includes(value)) {
                actionManager.runNext(id, "true")
            }
            else {
                actionManager.runNext(id, "false")
            }
        }
    }
}