import {ActionManager} from "../classes/ActionManager.js";

export default class StoreElementFromList {
    static type = "Store Element From List"
    static variableTypes = ["List", "Number"]
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
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const list = getVariable(data.get("list"))
        const onContinue = actionManager.onContinue
        const onBreak = actionManager.onBreak
        const onReturn = actionManager.onReturn
        actionManager.onContinue = () => {
            iterate()
        }
        actionManager.onBreak = () => {
            actionManager.onContinue = onContinue
            actionManager.onBreak = onBreak
            actionManager.onReturn = onReturn
            actionManager.runNext(id, "action")
        }
        actionManager.onReturn = (v) => {
            actionManager.onContinue = onContinue
            actionManager.onBreak = onBreak
            actionManager.onReturn = onReturn
            setVariable(data.get("value"), v)
            actionManager.runNext(id, "action")
        }
        let i = 0;
        iterate()
        function iterate() {
            if(i >= list.length) {
                actionManager.onContinue = onContinue
                actionManager.onBreak = onBreak
                actionManager.onReturn = onReturn
                setVariable(data.get("value"), undefined)
                setVariable(data.get("pos"), -1)
                actionManager.runNext(id, "action")
            }
            setVariable(data.get("value"), list[i])
            setVariable(data.get("pos"), i + 1)
            i++;
            actionManager.runNext(id, "filter")
        }
    }
}