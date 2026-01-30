import { Bot } from "../classes/Bot.js"

export default class StoreTextChannelInfo {
    static type = "Store Text Channel Info"

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
                values="Id,Name,Topic,Is NSFW,Created At,Slowmode,Category,Is Thread,Server,Position,Is Deletable,Is Manageable,Is Viewable,Permissions,Recipients,Messages,Threads">
            </dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
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
            } else if (["Permissions", "Recipients", "Messages", "Threads"].includes(value)) {
                varlist.setVariableType("List");
            } else if (["Server"].includes(value)) {
                varlist.setVariableType("Server");
            } else if(["Category"].includes(value)) {
                varlist.setVariableType("Channel");
            } else {
                varlist.setVariableType("Text");
            }
        };
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const channel = getVariable(data.get("channel"));
        const info = data.get("info");
        let value;

        switch (info) {
            case "Id":
                value = channel.id;
                break;
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
            case "Messages":
                const fetched = await channel.messages.fetch({ limit: 100 });
                value = [...fetched.values()];
                break;
            case "Threads":
                const fetchedActive = await channel.threads.fetchActive();
                const fetchedArchived = await channel.threads.fetchArchived();
                value = [...fetchedActive.threads.values(), ...fetchedArchived.threads.values()];
                break;
            default:
                value = null;
                break;
        }

        setVariable(data.get("value"), value);
        actionManager.runNext(id, "action");
    }
}
