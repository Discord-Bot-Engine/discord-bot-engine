import { Bot } from "../classes/Bot.js"

export default class StoreTextChannelInfo {
    static type = "Store Text Channel Info"

    static title(data) {
        return `Store "${data.get("info")}" from text channel "${data.get("channel")}"`;
    }

    static variableTypes = ["Channel", "Server", "Text", "Boolean", "Number", "Date", "List"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3" 
                change="(v) => handlers.onChange(v)"
                values="Name,Topic,Is NSFW,Created At,Slowmode,Category,Parent,Is Thread,Server,Position,Is Deletable,Is Manageable,Is Viewable,Permissions,Recipients">
            </dbe-select>
        </div>

        <div class="grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                id="var" 
                class="col-span-3"
                variableType="Server,Text,Boolean,Number,Date,List">
            </dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");

        handlers.onChange = (value) => {
            if (["Created At"].includes(value)) {
                varlist.setVariableType("Date");
            } else if (["Is NSFW", "Is Thread", "Is Deletable", "Is Manageable", "Is Viewable"].includes(value)) {
                varlist.setVariableType("Boolean");
            } else if (["Slowmode", "Position"].includes(value)) {
                varlist.setVariableType("Number");
            } else if (["Permissions", "Recipients"].includes(value)) {
                varlist.setVariableType("List");
            } else if (["Server", "Category", "Parent"].includes(value)) {
                varlist.setVariableType("Server");
            } else {
                varlist.setVariableType("Text");
            }
        };
    }

    static load(context) {}

    static async run({ data, actionManager, getVariable, setVariable }) {
        const channel = getVariable(data.get("channel"));
        const info = data.get("info");
        let value;

        switch (info) {
            case "Name":
                value = channel.name;
                break;
            case "Topic":
                value = channel.topic;
                break;
            case "Is NSFW":
                value = channel.nsfw;
                break;
            case "Created At":
                value = channel.createdAt;
                break;
            case "Slowmode":
                value = channel.rateLimitPerUser;
                break;
            case "Category":
            case "Parent":
                value = channel.parent;
                break;
            case "Is Thread":
                value = channel.isThread();
                break;
            case "Server":
                value = channel.guild;
                break;
            case "Position":
                value = channel.position;
                break;
            case "Is Deletable":
                value = channel.deletable;
                break;
            case "Is Manageable":
                value = channel.manageable;
                break;
            case "Is Viewable":
                value = channel.viewable;
                break;
            case "Permissions":
                value = [...channel.permissionOverwrites.cache.values()];
                break;
            case "Recipients":
                value = channel.recipients ? [...channel.recipients.values()] : [];
                break;
            default:
                value = null;
                break;
        }

        setVariable(data.get("value"), value);
        actionManager.runNext();
    }
}
