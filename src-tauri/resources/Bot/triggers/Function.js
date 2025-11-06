import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class SlashCommand {
    static type = "Function"
    static variableTypes = []
    static event = "function"
    static runIf = ({actionManager}, id) => id === actionManager.trigger.id
    static html = `
        <dbe-list name="params" title="Parameters" modalId="paramsModal" itemTitle="(item, i) => 'Parameter #'+i"></dbe-list>
        <template id="paramsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Store value in variable"></dbe-label>
                <dbe-variable-list name="value" class="col-span-3" id="var" variableType="Any"></dbe-variable-list>
            </div>
        </template>
    `
    static load({data, actionManager}) {}
    static run({id, data, actionManager, setVariable}, func, onReturn, ...args) {
        actionManager.onReturn = onReturn
        data.get("params")?.forEach(({data}, i) => {
            const value = data.get("value")
            setVariable(value, args[i])
        })
        actionManager.runNext(id, "action")
    }
}