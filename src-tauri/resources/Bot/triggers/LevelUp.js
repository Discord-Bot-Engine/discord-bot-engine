import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class LevelUp {
    static type = "Level Up"
    static variableTypes = ["Number", "Message", "User", "Member", "Channel", "Server"]
    static defaultVariables = [
        {
            name: "level",
            type: "Number",
            element: "level"
        },
        {
            name: "message",
            type: "Message",
            element: "message"
        },
        {
            name: "user",
            type: "User",
            element: "user"
        },
        {
            name: "member",
            type: "Member",
            element: "member"
        },
        {
            name: "channel",
            type: "Channel",
            element: "channel"
        },
        {
            name: "server",
            type: "Server",
            element: "server"
        },
    ]
    static event = "levelUp"
    static runIf = () => true
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store level in variable"></dbe-label>
            <dbe-variable-list name="level" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
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
    static run({id, data, actionManager, setVariable}, message, level) {
        setVariable(data.get("level") ?? "level", level);
        setVariable(data.get("message") ?? "message", message);
        setVariable(data.get("user") ?? "user", message.author);
        setVariable(data.get("member") ?? "member", message.member);
        setVariable(data.get("channel") ?? "channel", message.channel);
        setVariable(data.get("server") ?? "server", message.guild);
        actionManager.runNext(id, "action")
    }
}