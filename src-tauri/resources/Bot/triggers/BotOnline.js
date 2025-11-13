import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class BotOnline {
    static type = "Bot Online"
    static variableTypes = []
    static event = Events.ClientReady
    static runIf = () => true
    static html = `
    `
    static load({data, actionManager, setVariable}) {}
    static run({id, actionManager}) {
        actionManager.runNext(id, "action")
    }
}