import {ActionManager} from "../classes/ActionManager.js";

export default class StoreElementFromList {
    static type = "Store Element From List"
    static title(data) {
        return `Store element from list "${data.get("list")}" in "${data.get("value")}"`
    }
    static variableTypes = ["List"]
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
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const list = actionManager.getVariable(data.get("list"))
        let returned = false
        const actions = new ActionManager(actionManager.trigger, `${actionManager.name} -> Store Element From List: Run Actions To Find Element`, data.get("Run Actions To Find Element"), actionManager.variables, () => {getElement()}, (v) => {
            returned = true
            actionManager.setVariable(data.get("value"), v)
            actionManager.runNext()
        })
        let i = 0;
        getElement()
        function getElement() {
            if(i >= list.length || returned) return;
            actionManager.setVariable(data.get("value"), list[i])
            actions.runNext()
            i++;
        }
    }
}