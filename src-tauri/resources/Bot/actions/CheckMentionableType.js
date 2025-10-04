import {ActionManager} from "../classes/ActionManager.js";
import {Bot} from "../classes/Bot.js";
import {GuildMember, Role, User} from "discord.js";

export default class CheckMentionableType {
    static type = "Check Mentionable Type"
    static title(data) {
        return `Check if "${data.get("mentionable")}" is ${data.get("type")}`
    }
    static variableTypes = ["User", "Role", "Member"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Mentionable"></dbe-label>
            <dbe-variable-list name="mentionable" class="col-span-3" variableType="Mentionable"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Type"></dbe-label>
            <dbe-select name="type" class="col-span-3" values="User,Role,Member"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Run mode"></dbe-label>
            <dbe-select name="mode" class="col-span-3" value="Continue" values="Continue,Stop"></dbe-select>
        </div>
        <dbe-action-list name="Run Actions If True" title="Run Actions If True"></dbe-action-list>
        <dbe-action-list name="Run Actions If False" title="Run Actions If False"></dbe-action-list>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const mentionable = Bot.getVariable(data.get("mentionable"))
        const type = data.get("type")
        const mode = data.get("mode")
        const ifTrue = new ActionManager(actionManager.trigger, `${actionManager.name} -> Check Mentionable Type (Run Actions If True)`, data.get("Run Actions If True"), actionManager.variables)
        const ifFalse = new ActionManager(actionManager.trigger, `${actionManager.name} -> Check Mentionable Type (Run Actions If False)`, data.get("Run Actions If False"), actionManager.variables)
        if(type === "User") {
            if(mentionable instanceof User) ifTrue.runNext()
            else ifFalse.runNext()
        } else if(type === "Role") {
            if(mentionable instanceof Role) ifTrue.runNext()
            else ifFalse.runNext()
        } else if(type === "Member") {
            if(mentionable instanceof GuildMember) ifTrue.runNext()
            else ifFalse.runNext()
        }
        if(mode === "Continue")
            actionManager.runNext()
    }
}