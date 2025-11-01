import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class FindMember {
    static type = "Find Member"
    static variableTypes = ["Member"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="By"></dbe-label>
            <dbe-select name="by" values="Id,Name" class="col-span-3"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Value"></dbe-label>
            <dbe-input name="value" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const by = data.get("by")
        const server = getVariable(data.get("server"))
        let member
        if(by === "Id") {
            member = await server.members.fetch(data.get("value"))
        } else {
            member = server.members.cache.find(member => member.displayName === data.get("value"))
        }
        setVariable(data.get("member"), member)
        actionManager.runNext(id, "action")
    }
}