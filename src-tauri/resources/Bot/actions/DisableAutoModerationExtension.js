import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class DisableAutoModerationExtension {
    static type = "Disable Auto Moderation Extension";
    static variableTypes = ["Server"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Is disabled?"></dbe-label>
            <dbe-select name="value" value="True" values="True,False" class="col-span-3"></dbe-select>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const disabled = data.get("value") === "True"
        await Bot.setData(`$AUTOMOD$$$${server.id}`, disabled)
        actionManager.runNext(id, "action")
    }
}