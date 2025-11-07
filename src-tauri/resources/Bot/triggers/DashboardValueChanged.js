import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"
import {Dashboard} from "../classes/Dashboard.js";

export default class DashboardValueChanged {
    static type = "Dashboard Value Changed"
    static variableTypes = ["Server", "Text","Role","Channel","Member","Mentionable"]
    static event = "dashboardValueChange"
    static runIf = ({actionManager}, server, name) => actionManager.trigger.name.toLowerCase() === name.toLowerCase()
    static html = `
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
        setVariable(data.get("server"), server);
        setVariable(data.get("value"), value);
        actionManager.runNext(id, "action")
    }
}