import {Bot} from "../classes/Bot.js";

export default class CallFunction {
    static type = "Call Function"
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Function"></dbe-label>
            <dbe-trigger-list name="func" class="col-span-3" triggerType="Function"></dbe-trigger-list>
        </div>
         <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store returned value in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <dbe-list name="params" title="Parameters" modalId="paramsModal" itemTitle="(item, i) => 'Parameter #'+i"></dbe-list>
        <template id="paramsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Value"></dbe-label>
                <dbe-variable-list name="value" class="col-span-3" id="var" variableType="Any"></dbe-variable-list>
            </div>
        </template>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable, getVariable}) {
        const params = []
        data.get("params").forEach(({data}) => {
            params.push(getVariable(data.get("value")))
        })
        Bot.client.emit("function", data.get("func"), (v) => {
            setVariable(data.get("value"), v)
            actionManager.runNext(id, "action")
        }, ...params)
    }
}