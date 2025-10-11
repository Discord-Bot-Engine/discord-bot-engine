import {ActionManager} from "../classes/ActionManager.js";

export default class LoopThroughList {
    static type = "Loop Through List"
    static title(data) {
        return `Loop through "${data.get("list")}"`
    }
    static variableTypes = ["List"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="List"></dbe-label>
            <dbe-variable-list name="list" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <dbe-action-list name="Run Actions" title="Run Actions"></dbe-action-list>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store element in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store element position in variable"></dbe-label>
            <dbe-variable-list name="pos" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable, setVariable}) {
        const list = getVariable(data.get("list"))
        let i = 0;
        const actions = new ActionManager(actionManager.trigger, `${actionManager.name} -> ${actionManager.runningActionIndex + 1}. ${this.title(data)}: Run Actions`, data.get("Run Actions"), () => {
            actions.reset()
            iterate()
        }, actionManager.onReturn)
        iterate()
        function iterate() {
            if(i >= list.length) return actionManager.runNext();
            setVariable(data.get("value"), list[i])
            setVariable(data.get("pos"), i + 1)
            i++;
            actions.runNext()
        }
    }
}