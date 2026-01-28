import { Bot } from "../classes/Bot.js"

export default class StoreActivityInfo {
    static type = "Store Activity Info"

    static variableTypes = ["Text", "List", "Date", "Number"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Activity"></dbe-label>
            <dbe-variable-list name="activity" class="col-span-3" variableType="Activity"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3"
                change="(v) => handlers.onChange(v)"
                values="Name,Type,State,Details,URL,Application ID,Emoji,Started At,Ended At,Large Asset Text,Small Asset Text,Party Current,Party Max,Buttons"
            ></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                id="var" 
                class="col-span-3" 
                variableType="Text">
            </dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");

        handlers.onChange = (value) => {
            if (value === "Buttons") {
                varlist.setVariableType("List");
            } else if (value === "Started At" || value === "Ended At") {
                varlist.setVariableType("Date");
            } else if (value === "Party Current" || value === "Party Max") {
                varlist.setVariableType("Number");
            } else {
                varlist.setVariableType("Text");
            }
        };
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const activity = getVariable(data.get("activity"));
        const info = data.get("info");

        if (!activity) return actionManager.runNext(id, "action");

        let value = "";

        const types = {
            0: "Playing",
            1: "Streaming",
            2: "Listening",
            3: "Watching",
            4: "Custom",
            5: "Competing"
        };

        if (info === "Name") {
            value = activity.name;

        } else if (info === "Type") {
            value = types[activity.type] ?? "Unknown";

        } else if (info === "State") {
            value = activity.state;

        } else if (info === "Details") {
            value = activity.details;

        } else if (info === "URL") {
            value = activity.url;

        } else if (info === "Application ID") {
            value = activity.applicationId;

        } else if (info === "Emoji") {
            value = activity.emoji
                ? activity.emoji.id
                    ? `<:${activity.emoji.name}:${activity.emoji.id}>`
                    : activity.emoji.name
                : "";

        } else if (info === "Started At") {
            value = activity.timestamps?.start
                ? new Date(activity.timestamps.start)
                : null;

        } else if (info === "Ended At") {
            value = activity.timestamps?.end
                ? new Date(activity.timestamps.end)
                : null;

        } else if (info === "Large Asset Text") {
            value = activity.assets?.largeText;

        } else if (info === "Small Asset Text") {
            value = activity.assets?.smallText;

        } else if (info === "Party Current") {
            value = activity.party?.size?.[0] ?? null;

        } else if (info === "Party Max") {
            value = activity.party?.size?.[1] ?? null;

        } else if (info === "Buttons") {
            value = Array.isArray(activity.buttons)
                ? activity.buttons
                : [];
        }

        setVariable(data.get("value"), value);
        actionManager.runNext(id, "action");
    }
}
