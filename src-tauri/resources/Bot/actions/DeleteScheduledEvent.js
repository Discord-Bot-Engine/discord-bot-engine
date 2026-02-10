import { GuildScheduledEventEntityType } from "discord.js";

export default class DeleteScheduledEvent {
    static type = "Delete Scheduled Event";

    static variableTypes = ["Scheduled Event"];

    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Scheduled Event"></dbe-label>
        <dbe-variable-list
            name="event"
            class="col-span-3"
            variableType="Scheduled Event"
        ></dbe-variable-list>
    </div>
`;

    static load() {}

    static async run({ id, data, actionManager, getVariable }) {
        const event = getVariable(data.get("event"))
        await event.delete();
        actionManager.runNext(id, "action");
    }
}
