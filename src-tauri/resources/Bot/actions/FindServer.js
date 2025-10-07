import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class FindServer {
    static type = "Find Server"
    static title(data) {
        return `Find server by ${data.get("by")} "${data.get("value")}"`
    }
    static variableTypes = ["Server"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="By"></dbe-label>
            <dbe-select name="by" values="Id,Name" class="col-span-3"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Value"></dbe-label>
            <dbe-input name="value" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, setVariable}) {
        const by = data.get("by")
        let server
        if(by === "Id") {
            server = await Bot.client.guilds.fetch(data.get("value"))
        } else {
            server = Bot.client.guilds.cache.find(server => server.name === data.get("value"))
        }
        setVariable(data.get("server"), server)
        actionManager.runNext()
    }
}