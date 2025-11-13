import { Bot } from "../classes/Bot.js"

export default class SetChannelName {
    static type = "Set Channel Name"

    static variableTypes = ["Channel"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="New name"></dbe-label>
            <dbe-input 
                name="name" 
                class="col-span-3"
            </dbe-input>
        </div>
    `;

    static load(context) {}

    static async run({ id, data, actionManager, getVariable }) {
        const channel = getVariable(data.get("channel"));
        await channel.setName(data.get("name"));
        actionManager.runNext(id, "action");
    }
}
