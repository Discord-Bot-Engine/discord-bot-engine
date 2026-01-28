import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class PresenceChanged {
    static type = "Presence Changed"
    static variableTypes = ["Presence"]
    static defaultVariables = [
        {
            name: "oldPresence",
            type: "Presence",
            element: "old"
        },
        {
            name: "newPresence",
            type: "Presence",
            element: "new"
        },
    ]
    static event = Events.PresenceUpdate
    static runIf = () => true
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store old presence in variable"></dbe-label>
            <dbe-variable-list name="old" class="col-span-3" variableType="Voice State"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store new presence in variable"></dbe-label>
            <dbe-variable-list name="new" class="col-span-3" variableType="Voice State"></dbe-variable-list>
        </div>
    `
    static load({data, actionManager, setVariable}) {}
    static async run({id, data, actionManager, setVariable}, oldPresence, newPresence) {
        setVariable(data.get("old") ?? "old", oldPresence);
        setVariable(data.get("new") ?? "new", newPresence);
        actionManager.runNext(id, "action")
    }
}