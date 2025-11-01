import {ActionManager} from "../classes/ActionManager.js";

export default class CheckIfVariableExists {
    static type = "Check If Variable Exists"
    static variableTypes = []
    static outputs = ["true", "false"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Variable"></dbe-label>
            <dbe-variable-list name="variable" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const variable = getVariable(data.get("variable"))
        if(variable !== undefined && variable !== null) {
            actionManager.runNext(id, "true")
        }
        else {
            actionManager.runNext(id, "false")
        }
    }
}