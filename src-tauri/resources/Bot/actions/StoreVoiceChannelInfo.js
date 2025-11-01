import { Bot } from "../classes/Bot.js"

export default class StoreVoiceChannelInfo {
    static type = "Store Voice Channel Info"

    static variableTypes = ["Channel", "Server", "Text", "Boolean", "Number", "List"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select name="info" class="col-span-3" change="(v) => handlers.onChange(v)" 
                values="Name,Bitrate,User Limit,Position,Category,Parent,Is Deletable,Is Manageable,Is Viewable,Server,RTC Region,Is Full,Members,Messages">
            </dbe-select>
        </div>
        <div class="grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list name="value" id="var" class="col-span-3" variableType="Server,Text,Boolean,Number,List"></dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");

        handlers.onChange = (value) => {
            if (["Members", "Messages"].includes(value)) varlist.setVariableType("List");
            else if (["Is Deletable", "Is Manageable", "Is Viewable", "Is Full"].includes(value)) varlist.setVariableType("Boolean");
            else if (["Bitrate", "User Limit", "Position"].includes(value)) varlist.setVariableType("Number");
            else if (["Server", "Category", "Parent", "RTC Region"].includes(value)) varlist.setVariableType("Server");
            else varlist.setVariableType("Text");
        };
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const channel = getVariable(data.get("channel"));
        const info = data.get("info");
        let value;

        switch (info) {
            case "Name": value = channel.name; break;
            case "Bitrate": value = channel.bitrate; break;
            case "User Limit": value = channel.userLimit; break;
            case "Position": value = channel.position; break;
            case "Category":
            case "Parent": value = channel.parent; break;
            case "Is Deletable": value = channel.deletable; break;
            case "Is Manageable": value = channel.manageable; break;
            case "Is Viewable": value = channel.viewable; break;
            case "Server": value = channel.guild; break;
            case "RTC Region": value = channel.rtcRegion; break;
            case "Is Full": value = channel.full; break;
            case "Members": value = [...channel.members.values()]; break;
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
