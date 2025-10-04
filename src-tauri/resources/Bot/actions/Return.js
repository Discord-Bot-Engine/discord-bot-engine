import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class Return {
    static type = "Return"
    static title(data) {
        return `Return "${data.get("value")}"`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Value"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const value = actionManager.getVariable(data.get("value"))
        actionManager.onReturn?.(value)
    }
}