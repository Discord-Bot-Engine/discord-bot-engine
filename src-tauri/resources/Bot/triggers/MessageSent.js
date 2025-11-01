import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class MessageSent {
    static type = "Message Sent"
    static variableTypes = ["Message", "Member", "User", "Channel", "Server"]
    static event = Events.MessageCreate
    static runIf = (msg) => msg.author.id !== Bot.client.user.id
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store message in variable"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store channel in variable"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
    `
    static load({data, actionManager, setVariable}) {}
    static run({id, data, actionManager, setVariable}, message) {
        setVariable(data.get("message"), message);
        setVariable(data.get("user"), message.author);
        setVariable(data.get("member"), message.member);
        setVariable(data.get("channel"), message.channel);
        setVariable(data.get("server"), message.guild);
        actionManager.runNext(id, "action")
    }
}