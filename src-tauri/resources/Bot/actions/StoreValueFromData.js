import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class StoreValueFromData {
    static type = "Store Value From Data"
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Field"></dbe-label>
            <dbe-input name="field" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Default value"></dbe-label>
            <dbe-input name="default" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable}) {
        const defaultValue = data.get("default")
        setVariable(data.get("value"), await Bot.getData(data.get("field")) ?? parse(defaultValue))
        actionManager.runNext(id, "action")
        function parse(str) {
            const num = Number(str);
            if (isNaN(num)) return str;
            return Math.abs(num) <= Number.MAX_VALUE ? num : str;
        }
    }
}