import { Bot } from "../classes/Bot.js"

export default class StoreThreadChannelInfo {
    static type = "Store Thread Channel Info"

    static variableTypes = ["Channel", "Server", "Text", "Boolean", "Number", "Date", "List"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select name="info" class="col-span-3" change="(v) => handlers.onChange(v)" 
                values="Id,Name,Topic,Is NSFW,Created At,Archived,Auto Archive Duration,Is Locked,Is Manageable,Is Viewable,Server,Parent,Members,Member Count,Messages">
            </dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list name="value" id="var" class="col-span-3" variableType="Server,Text,Boolean,Number,Date,List"></dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");

        handlers.onChange = (value) => {
            if (["Created At"].includes(value)) varlist.setVariableType("Date");
            else if (["Is NSFW","Archived","Is Locked","Is Manageable","Is Viewable"].includes(value)) varlist.setVariableType("Boolean");
            else if (["Auto Archive Duration","Member Count"].includes(value)) varlist.setVariableType("Number");
            else if (["Members","Messages"].includes(value)) varlist.setVariableType("List");
            else if (["Server","Parent"].includes(value)) varlist.setVariableType("Server");
            else varlist.setVariableType("Text");
        };
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const channel = getVariable(data.get("channel"));
        const info = data.get("info");
        let value;

        switch (info) {
            case "Id": value = channel.id; break;
            case "Name": value = channel.name; break;
            case "Topic": value = channel.topic; break;
            case "Is NSFW": value = channel.nsfw; break;
            case "Created At": value = channel.createdAt; break;
            case "Archived": value = channel.archived; break;
            case "Auto Archive Duration": value = channel.autoArchiveDuration; break;
            case "Is Locked": value = channel.locked; break;
            case "Is Manageable": value = channel.manageable; break;
            case "Is Viewable": value = channel.viewable; break;
            case "Server": value = channel.guild; break;
            case "Parent": value = channel.parent; break;
            case "Members": value = [...channel.members.cache.values()]; break;
            case "Member Count": value = channel.memberCount; break;
            case "Messages":
                const fetched = await channel.messages.fetch({ limit: 100 });
                value = [...fetched.values()];
                break;
            default: value = null; break;
        }

        setVariable(data.get("value"), value);
        actionManager.runNext(id, "action");
    }
}
