import { ThreadAutoArchiveDuration, ChannelType } from "discord.js";

export default class CreateThread {
    static type = "Create Thread";

    static variableTypes = ["Channel"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Parent channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Thread name"></dbe-label>
            <dbe-input name="threadName" class="col-span-3"></dbe-input>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Thread type"></dbe-label>
            <dbe-select 
                name="threadType"
                class="col-span-3"
                values="Public,Private"
            ></dbe-select>
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
        const typeStr = data.get("threadType");
        const archive = data.get("archive");

        const typeMap = {
            Public: ChannelType.PublicThread,
            Private: ChannelType.PrivateThread,
        };

        const type = typeMap[typeStr];

        const thread = await parent.threads.create({
            name,
            autoArchiveDuration: ThreadAutoArchiveDuration[archive.replaceAll(" ", "")],
            type
        });

        setVariable(data.get("value"), thread);

        actionManager.runNext(id, "action");
    }
}
