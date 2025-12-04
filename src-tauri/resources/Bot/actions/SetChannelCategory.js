import { Bot } from "../classes/Bot.js"

export default class SetChannelCategory {
    static type = "Set Channel Category"

    static variableTypes = ["Channel"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Category"></dbe-label>
            <dbe-variable-list name="category" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
    `;

    static load(context) {}

    static async run({ id, data, actionManager, getVariable }) {
        const channel = getVariable(data.get("channel"));
        const category = getVariable(data.get("category"));
        await channel.setParent(category);
        actionManager.runNext(id, "action");
    }
}
