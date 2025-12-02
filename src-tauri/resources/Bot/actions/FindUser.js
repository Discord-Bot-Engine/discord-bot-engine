import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class FindUser {
    static type = "Find User"
    static variableTypes = ["User"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="By"></dbe-label>
            <dbe-select name="by" values="Id,Name" class="col-span-3"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Value"></dbe-label>
            <dbe-input name="value" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable}) {
        const by = data.get("by")
        let user
        if(by === "Id") {
            user = await Bot.client.users.fetch(data.get("value")).catch(() => {})
        } else {
            user = Bot.client.users.cache.find(user => user.username === data.get("value"))
        }
        setVariable(data.get("user"), user)
        actionManager.runNext(id, "action")
    }
}