import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"
import {Dashboard} from "../classes/Dashboard.js";

export default class DashboardValueChanged {
    static type = "Dashboard Value Changed"
    static variableTypes = ["Server", "Text","Role","Channel","Member","Mentionable"]
    static defaultVariables = [
        {
            name: "server",
            type: "Server",
            element: "server"
        },
    ]
    static event = "dashboardValueChange"
    static runIf = ({actionManager, data}, server, name) => data.get("input").toLowerCase() === name.toLowerCase()
    static html = `
         <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Input"></dbe-label>
                <dbe-input name="input" class="col-span-3"></dbe-input>
            </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
         <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Text,Role,Channel,Member,Mentionable"></dbe-variable-list>
        </div>
    `
    static load({data, actionManager, setVariable}) {}
    static async run({id, data, actionManager, setVariable}, server, name, value) {
        server = await Bot.client.guilds.fetch(server)
        const input = Dashboard.inputs.find(i => i.name === name)
        let result = [];
        if(!input.multiple) {
            result = await parseValue(value, input)
        } else {
            for (let i = 0; i < value.length; i++)
                result.push(await parseValue(value[i], input));
        }
        setVariable(data.get("server") ?? "server", server);
        setVariable(data.get("value"), result);
        actionManager.runNext(id, "action")
        async function parseValue(value, input) {
            if(input?.type === "role") {
                return await server.roles.fetch(value)
            } else if(input?.type.includes("channel") || input?.type === "category") {
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
            } else return value
        }
    }
}