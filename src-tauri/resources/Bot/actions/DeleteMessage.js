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
    MessageFlags,
} from "discord.js"

export default class DeleteMessage {
    static type = "Delete Message"
    static variableTypes = ["Message"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Message"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>
       `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const msg = getVariable(data.get("message"))
        await msg.delete()
        actionManager.runNext(id, "action")
    }
}