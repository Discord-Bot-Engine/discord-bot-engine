import {ActionManager} from "../classes/ActionManager.js";
import {GuildMember, Role, User} from "discord.js";

export default class CheckMentionableType {
    static type = "Check Mentionable Type"
    static variableTypes = ["User", "Role", "Member"]
    static outputs = ["true", "false"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Mentionable"></dbe-label>
            <dbe-variable-list name="mentionable" class="col-span-3" variableType="Mentionable"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Type"></dbe-label>
            <dbe-select name="type" class="col-span-3" values="User,Role,Member"></dbe-select>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const mentionable = getVariable(data.get("mentionable"))
        const type = data.get("type")
        if(type === "User") {
            if(mentionable instanceof User) {
                actionManager.runNext(id, "true")
            }
            else {
                actionManager.runNext(id, "false")
            }
        } else if(type === "Role") {
            if(mentionable instanceof Role) {
                actionManager.runNext(id, "true")
            }
            else {
                actionManager.runNext(id, "false")
            }
        } else if(type === "Member") {
            if(mentionable instanceof GuildMember) {
                actionManager.runNext(id, "true")
            }
            else {
                actionManager.runNext(id, "false")
            }
        }
    }
}