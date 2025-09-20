import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class StoreValueFromData {
    static type = "Store Value From Data"
    static title(data) {
        return `Store "${data.get("field")}" value`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Field"></dbe-label>
            <dbe-input name="field" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        actionManager.setVariable(data.get("value"), Bot.getData(data.get("field")))
        actionManager.runNext()
    }
}