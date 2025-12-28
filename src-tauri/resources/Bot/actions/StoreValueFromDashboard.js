import {Dashboard} from "../classes/Dashboard.js";

export default class StoreValueFromDashboard {
    static type = "Store Value From Dashboard"
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
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const server = getVariable(data.get("server"))
        const name = data.get("input")
        let value = Dashboard.getInputValue(server.id, name)
        const input = Dashboard.inputs.find(i => i.name === name)
        let result = [];
        if(!input.multiple) {
            result = await parseValue(value, input)
        } else {
            value.forEach(async (v) => {
                result.push(await parseValue(v, input))
            })
        }
        setVariable(data.get("value"), result)
        actionManager.runNext(id, "action")
        async function parseValue(value, input) {
            if(input?.type === "role") {
                return await server.roles.fetch(value)
            } else if(input?.type === "channel") {
                return await server.channels.fetch(value)
            } else if(input?.type === "member") {
                return await server.members.fetch(value)
            } else if(input?.type === "mentionable") {
                try {
                    return await server.roles.fetch(value)
                } catch {
                    try {
                        return await server.members.fetch(value)
                    } catch {}
                }
            }
        }
    }
}