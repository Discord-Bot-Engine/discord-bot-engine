import {ActionManager} from "../classes/ActionManager.js";

export default class FilterList {
    static type = "Filter List"
    static title(data) {
        return `Filter "${data.get("list")}"`
    }
    static variableTypes = ["List"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="List"></dbe-label>
            <dbe-variable-list name="list" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store element in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store element position in variable"></dbe-label>
            <dbe-variable-list name="pos" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store list in variable"></dbe-label>
            <dbe-variable-list name="newlist" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <dbe-action-list name="Run Actions To Filter" title="Run Actions To Filter"></dbe-action-list>
    `
    static load(context) {
    }
    static async run({data, actionManager, setVariable, getVariable}) {
        const list = getVariable(data.get("list"))
        const filtered = []
        const actions = new ActionManager(actionManager.trigger, data.get("Run Actions To Filter"), () => { iterate() }, (v) => {
            filtered.push(v)
            iterate()
        })
        let i = 0;
        iterate()
        function iterate() {
            actions.reset()
            if(i >= list.length) {
                setVariable(data.get("newlist"), filtered)
                actionManager.runNext();
                return
            }
            setVariable(data.get("value"), list[i])
            setVariable(data.get("pos"), i + 1)
            i++;
            actions.runNext()
        }
    }
}