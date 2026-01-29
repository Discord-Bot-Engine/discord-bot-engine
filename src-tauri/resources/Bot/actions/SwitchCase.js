
import {ActionManager} from "../classes/ActionManager.js";
import {Bot} from "../classes/Bot.js";
import {
    TextDisplayBuilder,
    SectionBuilder,
    MediaGalleryBuilder,
    FileBuilder,
    SeparatorBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ContainerBuilder,
    AttachmentBuilder,
    SeparatorSpacingSize,
    ButtonStyle,
    ComponentType,
    MessageFlags, Events,
} from "discord.js"

export default class SwitchCase {
    static type = "Switch Case"
    static variableTypes = [];
    static outputs = []
    static html = `
          <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Variable"></dbe-label>
            <dbe-variable-list name="variable" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <dbe-list name="values" title="Values" modalId="valuesModal" itemTitle="async (item, i) => item.data.get('name') ?? await App.translate('Value', App.selectedLanguage)+' #'+i"></dbe-list>
        <template id="valuesModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="value"></dbe-label>
                <dbe-input name="value" class="col-span-3"></dbe-input>
            </div>
        </template>
    `
    static async close(context) {
        const values = []
        context.data.get("values").forEach(({data}) => {
            values.push(data.get("value"))
        })
        context.outputs = values
    }
    static load(context) {
    }
    static async run({id, actionManager, rawData, data, getVariable}) {
        const variable = getVariable(data.get("variable"))
        data.get("values").forEach((v, i) => {
            const value = v.data.get("value")
            if(String(variable) === value) {
                actionManager.runNext(id, rawData.get("values")[i].data.get("value"))
            }
        })
    }
}