import {Dashboard} from "../classes/Dashboard.js";

export default class StoreValueFromDashboard {
    static type = "Store Value From Dashboard"
    static title(data) {
        return `Store "${data.get("input")}" from server "${data.get("server")}"`
    }
    static variableTypes = ["Server", "Text", "Role", "Channel", "Member", "Mentionable"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Input"></dbe-label>
            <dbe-input name="input" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Text,Role,Channel,Member,Mentionable"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const server = actionManager.getVariable(data.get("server"))
        const name = data.get("input")
        let value = Dashboard.getInputValue(server.id, name)
        const input = Dashboard.inputs.find(i => i.name === name)
        if(input?.type === "role") {
            value = await server.roles.fetch(value)
        } else if(input?.type === "channel") {
            value = await server.channels.fetch(value)
        } else if(input?.type === "member") {
            value = await server.members.fetch(value)
        } else if(input?.type === "mentionable") {
            try {
                value = await server.roles.fetch(value)
            } catch {
                    try {
                        value = await server.members.fetch(value)
                    } catch {}
            }
        }
        actionManager.setVariable(data.get("value"), value)
        actionManager.runNext()
    }
}