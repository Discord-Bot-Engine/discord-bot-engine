import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class MemberLeft {
    static type = "Member Left"
    static variableTypes = ["Member", "User", "Server"]
    static defaultVariables = [
        {
            name: "member",
            type: "Member",
            element: "member"
        },
        {
            name: "user",
            type: "User",
            element: "user"
        },
        {
            name: "server",
            type: "Server",
            element: "server"
        },
    ]
    static event = Events.GuildMemberRemove
    static runIf = () => true
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
    `
    static load({data, actionManager, setVariable}) {}
    static run({id, data, actionManager, setVariable}, member) {
        setVariable(data.get("member") ?? "member", member);
        setVariable(data.get("user") ?? "user", member.user);
        setVariable(data.get("server") ?? "server", member.guild);
        actionManager.runNext(id, "action")
    }
}