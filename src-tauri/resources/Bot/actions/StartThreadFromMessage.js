import { ThreadAutoArchiveDuration } from "discord.js";

export default class StartThreadFromMessage {
    static type = "Start Thread From Message";

    static variableTypes = ["Channel", "Message"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Parent message"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Thread name"></dbe-label>
            <dbe-input name="threadName" class="col-span-3"></dbe-input>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Auto-archive duration"></dbe-label>
            <dbe-select 
                name="archive"
                class="col-span-3"
                values="One Day,One Hour,One Week,Three Days"
            ></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store thread in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                class="col-span-3"
                variableType="Channel"
            ></dbe-variable-list>
        </div>
    `;

    static load() {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const parent = getVariable(data.get("channel"));
        const name = data.get("threadName");
        const archive = data.get("archive");
        const thread = await parent.threads.create({
            name,
            autoArchiveDuration: ThreadAutoArchiveDuration[archive.replaceAll(" ", "")],
        });
        setVariable(data.get("value"), thread);
        actionManager.runNext(id, "action");
    }
}
