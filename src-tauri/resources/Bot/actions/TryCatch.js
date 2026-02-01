import {Bot} from "../classes/Bot.js";
import discordjs from "discord.js"

export default class TryCatch {
    static type = "Try Catch"
    static variableTypes = ["Text"];
    static outputs = ["action", "on error"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store error in variable"></dbe-label>
            <dbe-variable-list name="error" class="col-span-3" variableType="Text"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, actionManager, data, setVariable}) {
        actionManager.onError = (e) => {
            setVariable(data.get("error"), e);
            actionManager.runNext(id, "on error")
        }
        actionManager.runNext(id, "action")
    }
}