import {Bot} from "../classes/Bot.js";
import {ChannelType} from "discord.js"
export default class FindChannel {
    static type = "Find Channel"
    static title(data) {
        return `Find channel by ${data.get("by")} "${data.get("value")}" from "${data.get("server")}"`
    }
    static variableTypes = ["Text Channel", "Voice Channel", "Forum Channel"]
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
            <dbe-label name="Type"></dbe-label>
            <dbe-select name="type" values="Text,Voice,Forum" change="(v) => document.getElementById('var').setVariableType(v + ' Channel')" class="col-span-3"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Value"></dbe-label>
            <dbe-input name="value" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store channel in variable"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Text Channel" id="var"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable, setVariable}) {
        const type = data.get("type")
        const types = {
            Text: ChannelType.GuildText,
            Voice: ChannelType.GuildVoice,
            Forum: ChannelType.GuildForum
        }
        const by = data.get("by")
        const server = getVariable(data.get("server"))
        let channel
        if(by === "Id") {
            channel = await server.channels.fetch(data.get("value"))
        } else {
            channel = server.channels.cache.find(channel => channel.name === data.get("value") && channel.type === types[type])
        }
        setVariable(data.get("channel"), channel)
        actionManager.runNext()
    }
}