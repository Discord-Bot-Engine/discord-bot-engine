import {ActionManager} from "../classes/ActionManager.js";

export default class StoreElementFromList {
    static type = "Store Element From List"
    static title(data) {
        return `Store element from list "${data.get("list")}" in "${data.get("value")}"`
    }
    static variableTypes = ["List", "Number"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="List"></dbe-label>
            <dbe-variable-list name="list" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <dbe-action-list name="Run Actions To Find Element" title="Run Actions To Find Element"></dbe-action-list>
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
    static async run({data, actionManager}) {
        const list = actionManager.getVariable(data.get("list"))
        const actions = new ActionManager(actionManager.trigger, `${actionManager.name} -> Store Element From List: Run Actions To Find Element`, data.get("Run Actions To Find Element"), actionManager.variables, () => {getElement()}, (v) => {
            actionManager.setVariable(data.get("value"), v)
            actionManager.setVariable(data.get("pos"), list.indexOf(v) + 1)
            actionManager.runNext()
        })
        let i = 0;
        getElement()
        function getElement() {
            if(i >= list.length) {
                actionManager.setVariable(data.get("value"), list[i])
                actionManager.setVariable(data.get("pos"), i + 1)
                actionManager.runNext()
                return;
            }
            actions.setVariable(data.get("value"), list[i])
            actions.setVariable(data.get("pos"), i + 1)
            actions.runNext()
            i++;
        }
    }
}