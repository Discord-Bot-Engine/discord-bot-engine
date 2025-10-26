import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class ReactionAdded {
    static type = "Reaction Added"
    static variableTypes = ["Message", "Boolean", "User", "Member", "Channel", "Reaction", "Server"]
    static event = Events.MessageReactionAdd
    static runIf = () => true
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store burst in variable"></dbe-label>
            <dbe-variable-list name="burst" class="col-span-3" variableType="Boolean"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store reaction in variable"></dbe-label>
            <dbe-variable-list name="reaction" class="col-span-3" variableType="Reaction"></dbe-variable-list>
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
            <dbe-label name="Store message in variable"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="Message"></dbe-variable-list>
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
    static async run({data, actionManager, setVariable}, reaction, user, details) {
        if(reaction.partial) await reaction.fetch();
        const message = reaction.message;
        const guild = message.guild;
        const member = await guild?.members.fetch(user.id);
        setVariable(data.get("burst"), details.burst);
        setVariable(data.get("reaction"), reaction);
        setVariable(data.get("message"), message);
        setVariable(data.get("user"), user);
        setVariable(data.get("member"), member);
        setVariable(data.get("channel"), message.channel);
        setVariable(data.get("server"), message.guild);
        actionManager.runNext()
    }
}