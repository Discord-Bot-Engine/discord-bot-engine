import {ActionManager} from "../classes/ActionManager.js";

export default class FilterList {
    static type = "Filter List"
    static variableTypes = ["List"]
    static outputs = ["action", "filter"]
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
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable, getVariable}) {
        const list = getVariable(data.get("list"))
        const filtered = []
        const onContinue = actionManager.onContinue
        const onReturn = actionManager.onReturn
        const onBreak = actionManager.onBreak
        actionManager.onContinue = () => {
            iterate()
        }
        actionManager.onReturn = (v) => {
            filtered.push(v)
            iterate()
        }
        actionManager.onBreak = () => {
            actionManager.onReturn = onReturn
            actionManager.onBreak = onBreak
            actionManager.onContinue = onContinue
            actionManager.runNext(id, "action");
        }
        let i = 0;
        iterate()
        function iterate() {
            if(i >= list.length) {
                setVariable(data.get("newlist"), filtered)
                actionManager.onReturn = onReturn
                actionManager.onBreak = onBreak
                actionManager.onContinue = onContinue
                actionManager.runNext(id, "action");
                return
            }
            setVariable(data.get("value"), list[i])
            setVariable(data.get("pos"), i + 1)
            i++;
            actionManager.runNext(id, "filter")
        }
    }
}