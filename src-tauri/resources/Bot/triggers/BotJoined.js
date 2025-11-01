import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class BotJoined {
    static type = "Bot Joined"
    static variableTypes = ["Server"]
    static event = Events.GuildCreate
    static runIf = () => true
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
    `
    static load({data, actionManager, setVariable}) {}
    static run({id, data, actionManager, setVariable}, guild) {
        setVariable(data.get("server"), guild);
        actionManager.runNext(id, "action")
    }
}