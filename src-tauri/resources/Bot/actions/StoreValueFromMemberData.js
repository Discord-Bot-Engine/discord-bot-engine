import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class StoreValueFromMemberData {
    static type = "Store Value From Member Data"
    static title(data) {
        return `Store "${data.get("field")}" from member "${data.get("member")}"`
    }
    static variableTypes = ["Member"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="member"></dbe-variable-list>
        </div>
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
        const member = data.get("member")
        const field = `${member.id}${member.guild.id}${data.get("field")}`
        actionManager.setVariable(data.get("value"), Bot.getData(field))
        actionManager.runNext()
    }
}