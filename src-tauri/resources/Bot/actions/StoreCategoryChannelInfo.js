import { Bot } from "../classes/Bot.js"

export default class StoreCategoryChannelInfo {
    static type = "Store Category Channel Info"

    static variableTypes = ["Channel", "Server", "Text", "Boolean", "Number", "List"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select name="info" class="col-span-3" change="(v) => handlers.onChange(v)" 
                values="Name,Position,Is Deletable,Is Manageable,Is Viewable,Server,Channels">
            </dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list name="value" id="var" class="col-span-3" variableType="Server,Text,Boolean,Number,List"></dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");

        handlers.onChange = (value) => {
            if (["Channels"].includes(value)) varlist.setVariableType("List");
            else if (["Is Deletable", "Is Manageable", "Is Viewable"].includes(value)) varlist.setVariableType("Boolean");
            else if (["Position"].includes(value)) varlist.setVariableType("Number");
            else if (["Server"].includes(value)) varlist.setVariableType("Server");
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
            case "Position": value = channel.position; break;
            case "Is Deletable": value = channel.deletable; break;
            case "Is Manageable": value = channel.manageable; break;
            case "Is Viewable": value = channel.viewable; break;
            case "Server": value = channel.guild; break;
            case "Channels": value = [...channel.children.values()]; break;
            default: value = null; break;
        }

        setVariable(data.get("value"), value);
        actionManager.runNext(id, "action");
    }
}
