import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class VoiceStateChanged {
    static type = "Voice State Changed"
    static variableTypes = ["Voice State"]

    static defaultVariables = [
        {
            name: "oldState",
            type: "Voice State",
            element: "old"
        },
        {
            name: "newState",
            type: "Voice State",
            element: "new"
        },
    ]
    static event = Events.VoiceStateUpdate
    static runIf = () => true
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store old state in variable"></dbe-label>
            <dbe-variable-list name="old" class="col-span-3" variableType="Voice State"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store new state in variable"></dbe-label>
            <dbe-variable-list name="new" class="col-span-3" variableType="Voice State"></dbe-variable-list>
        </div>
    `
    static load({data, actionManager, setVariable}) {}
    static async run({id, data, actionManager, setVariable}, oldState, newState) {
        setVariable(data.get("old") ?? "oldState", oldState);
        setVariable(data.get("new") ?? "newState", newState);
        actionManager.runNext(id, "action")
    }
}