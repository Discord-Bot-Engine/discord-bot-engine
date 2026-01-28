import { Bot } from "../classes/Bot.js"

export default class StorePresenceInfo {
    static type = "Store Presence Info"

    static variableTypes = ["List", "Member", "Server", "Text", "User"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Presence"></dbe-label>
            <dbe-variable-list name="presence" class="col-span-3" variableType="Presence"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3" 
                change="(v) => handlers.onChange(v)"
                values="Activities,Member,Server,Status,User"
            ></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                id="var" 
                class="col-span-3" 
                variableType="List,Member,Server,Text,User">
            </dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");

        handlers.onChange = (value) => {

            if (value === "Activities") {
                varlist.setVariableType("List");
            } else if(value === "Member") {
                varlist.setVariableType("Member");
            } else if(value === "Server") {
                varlist.setVariableType("Server");
            } else if(value === "Status") {
                varlist.setVariableType("Text");
            } else if(value === "User") {
                varlist.setVariableType("User");
            }
        };
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const presence = getVariable(data.get("presence"));
        const info = data.get("info");

        let value;

        if (info === "Activities") {
            value = presence.activities
        } else if(info === "Member") {
            value = presence.member
        } else if(info === "Server") {
            value = presence.guild
        } else if(info === "Status") {
            value = presence.status
        } else if(info === "User") {
            value = presence.user
        }

        setVariable(data.get("value"), value);
        actionManager.runNext(id, "action");
    }
}
