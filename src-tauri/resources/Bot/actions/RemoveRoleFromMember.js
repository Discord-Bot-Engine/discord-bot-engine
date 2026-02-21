import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class RemoveRoleFromMember {
    static type = "Remove Role From Member"
    static variableTypes = ["Member", "Role"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Role"></dbe-label>
            <dbe-variable-list name="role" class="col-span-3" variableType="Role"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const member = getVariable(data.get("member"))
        const role = getVariable(data.get("role"))
        await member.roles.remove(role)
        actionManager.runNext(id, "action")
    }
}