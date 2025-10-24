import { MessageFlags } from "discord.js"

export default class DeferInteraction {
    static type = "Defer Interaction"
    static title(data) {
        return `Defer "${data.get("origin")}"`
    }
    static variableTypes = ["Command Interaction", "Button Interaction", "Select Menu Interaction"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Interaction"></dbe-label>
            <dbe-variable-list name="origin" class="col-span-3" variableType="Command Interaction,Button Interaction,Select Menu Interaction"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Is ephemeral? (only for interactions)"></dbe-label>
            <dbe-select name="ephemeral" class="col-span-3" value="False" values="True,False"></dbe-select>
        </div>
    `
    static load(context) {}
    static async run({data, actionManager, getVariable}) {
        const ephemeral = data.get("ephemeral") === "True"
        const flags = []
        if(ephemeral) flags.push(MessageFlags.Ephemeral)
        await getVariable(data.get("origin")).deferReply({flags})
        actionManager.runNext()
    }
}