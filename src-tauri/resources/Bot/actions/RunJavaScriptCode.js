import {Bot} from "../classes/Bot.js";
import discordjs from "discord.js"

export default class RunJavaScriptCode {
    static type = "Run JavaScript Code"
    static variableTypes = [];
    static html = `
         <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Code"></dbe-label>
            <dbe-input name="code" class="col-span-3" multiline="true"></dbe-input>
        </div>
        <dbe-list name="outputs" title="Outputs" modalId="outputsModal" itemTitle="async (item, i) => item.data.get('name') ?? await App.translate('Output', App.selectedLanguage)+' #'+i"></dbe-list>
        <template id="outputsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="name"></dbe-label>
                <dbe-input name="name" class="col-span-3"></dbe-input>
            </div>
        </template>
    `
    static async close(context) {
        const outputs = []
        context.data.get("outputs").forEach(({data}) => {
            outputs.push(data.get("name"))
        })
        context.outputs = ["action", ...outputs]
    }
    static load(context) {
    }
    static async run(context) {
        const code = context.rawData.get("code")
        eval(`(async () => {${code}})()`)
        context.actionManager.runNext(context.id, "action")
    }
}