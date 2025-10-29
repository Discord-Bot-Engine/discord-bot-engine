import {ActionManager} from "../classes/ActionManager.js";

export default class CheckIfVariableExists {
    static type = "Check If Variable Exists"
    static title(data) {
        return `Check if "${data.get("variable")}" exists`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Variable"></dbe-label>
            <dbe-variable-list name="variable" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <dbe-action-list name="Run Actions If True" title="Run Actions If True"></dbe-action-list>
        <dbe-action-list name="Run Actions If False" title="Run Actions If False"></dbe-action-list>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable}) {
        const variable = getVariable(data.get("variable"))
        const ifTrue = new ActionManager(actionManager.trigger, data.get("Run Actions If True"), () => { actionManager.runNext() }, actionManager.onReturn)
        const ifFalse = new ActionManager(actionManager.trigger, data.get("Run Actions If False"), () => { actionManager.runNext() }, actionManager.onReturn)
        if(variable !== undefined && variable !== null) {
            ifTrue.runNext()
        }
        else {
            ifFalse.runNext()
        }
    }
}