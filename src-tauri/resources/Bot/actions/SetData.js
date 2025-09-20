import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class SetData {
    static type = "Set Data"
    static title(data) {
        return `Set field "${data.get("field")}" to value "${data.get("value")}"`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Field"></dbe-label>
            <dbe-input name="field" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Value"></dbe-label>
            <dbe-input name="value" class="col-span-3"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        Bot.setData(data.get("field"), data.get("value"))
        actionManager.runNext()
    }
}