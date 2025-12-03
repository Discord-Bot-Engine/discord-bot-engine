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

export default class DeleteChannel {
    static type = "Delete Channel"
    static variableTypes = ["Channel"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
       `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const ch = getVariable(data.get("channel"))
        await ch.delete()
        actionManager.runNext(id, "action")
    }
}