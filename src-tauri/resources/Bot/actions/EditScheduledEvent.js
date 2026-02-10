import { GuildScheduledEventEntityType, GuildScheduledEventStatus } from "discord.js";

export default class EditScheduledEvent {
    static type = "Edit Scheduled Event";
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
    
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Event name"></dbe-label>
        <dbe-input name="name" class="col-span-3"></dbe-input>
    </div>

    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Description"></dbe-label>
        <dbe-input name="description" class="col-span-3"></dbe-input>
    </div>

    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Event type"></dbe-label>
        <dbe-select
            name="eventType"
            class="col-span-3"
            values="Voice,Stage,External"
            change="(value, el) => handlers.onEventTypeChange(value, el)"
        ></dbe-select>
    </div>

    <div id="channelRow" class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Channel"></dbe-label>
        <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
    </div>

    <div id="locationRow" class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Location"></dbe-label>
        <dbe-input name="location" class="col-span-3"></dbe-input>
    </div>

    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Image URL"></dbe-label>
        <dbe-input name="image" class="col-span-3"></dbe-input>
    </div>

    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Start in (hours)"></dbe-label>
        <dbe-input name="startIn" class="col-span-3"></dbe-input>
    </div>

    <div id="durationRow" class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Duration (hours)"></dbe-label>
        <dbe-input name="duration" class="col-span-3"></dbe-input>
    </div>

    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Status"></dbe-label>
        <dbe-select name="status" class="col-span-3" values="Scheduled,Active,Completed,Canceled"></dbe-select>
    </div>
`;

    static open(context, handlers) {
        handlers.onEventTypeChange = (value, el) => {
            const parent = el.parentElement.parentElement;
            const channelRow = parent.querySelector("#channelRow");
            const durationRow = parent.querySelector("#durationRow");
            const locationRow = parent.querySelector("#locationRow");
            if (!channelRow || !durationRow || !locationRow) return;

            if (value === "External") {
                channelRow.style.display = "none";
                durationRow.style.display = "";
                locationRow.style.display = "";
            } else {
                channelRow.style.display = "";
                durationRow.style.display = "none";
                locationRow.style.display = "none";
            }
        };
    }

    static load() {}

    static async run({ id, data, actionManager, getVariable }) {
        const event = getVariable(data.get("event"));
        const channel = getVariable(data.get("channel"));

        const name = data.get("name");
        const description = data.get("description");
        const eventTypeStr = data.get("eventType");
        const imageUrl = data.get("image")?.trim();
        const statusStr = data.get("status");

        const startInHours = Number(data.get("startIn"));
        const durationHours = Number(data.get("duration"));
        const location = data.get("location")?.trim();

        const now = Date.now();
        const startTime = new Date(now + startInHours * 60 * 60 * 1000);
        const endTime = new Date(
            startTime.getTime() + durationHours * 60 * 60 * 1000,
        );

        const typeMap = {
            Voice: GuildScheduledEventEntityType.Voice,
            Stage: GuildScheduledEventEntityType.StageInstance,
            External: GuildScheduledEventEntityType.External,
        };

        const statusMap = {
            Scheduled: GuildScheduledEventStatus.Scheduled,
            Active: GuildScheduledEventStatus.Active,
            Completed: GuildScheduledEventStatus.Completed,
            Canceled: GuildScheduledEventStatus.Canceled,
        };

        const entityType = eventTypeStr ? typeMap[eventTypeStr] : undefined;
        const status = statusStr ? statusMap[statusStr] : undefined;

        const eventOptions = {};
        if (name) eventOptions.name = name;
        if (description) eventOptions.description = description;
        if (entityType !== undefined) eventOptions.entityType = entityType;
        if (imageUrl) eventOptions.image = imageUrl
        else eventOptions.image = null;
        if (status !== undefined) eventOptions.status = status;

        if (event.status === GuildScheduledEventStatus.Scheduled) {
            if (startTime) eventOptions.scheduledStartTime = startTime;
            if (entityType === GuildScheduledEventEntityType.External && endTime) {
                eventOptions.scheduledEndTime = endTime;
                if (location) eventOptions.entityMetadata = { location };
            } else if (entityType !== GuildScheduledEventEntityType.External && channel) {
                eventOptions.channel = channel;
            }
        } else if (entityType !== GuildScheduledEventEntityType.External && channel) {
            eventOptions.channel = channel;
        }

        await event.edit(eventOptions);

        actionManager.runNext(id, "action");
    }
}
