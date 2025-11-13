import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class Wait {
    static type = "Wait"
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Seconds"></dbe-label>
            <dbe-input name="sec" class="col-span-3"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager}) {
        const seconds = Number(data.get("sec")) * 1000
        setTimeout(() => {
            actionManager.runNext(id, "action")
        }, seconds)
    }
}