import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class HTTPRequest {
    static type = "HTTP Request"
    static variableTypes = ["HTTP Request", "HTTP Response"]
    static event = "httpRequest"
    static runIf = ({data, actionManager}, req, res) => req.path === actionManager.trigger.name && req.method === (data.get("type") ?? "GET")
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Type"></dbe-label>
            <dbe-select name="type" class="col-span-3" values="GET,POST" value="GET"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store request in variable"></dbe-label>
            <dbe-variable-list name="req" class="col-span-3" variableType="HTTP Request"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store response in variable"></dbe-label>
            <dbe-variable-list name="res" class="col-span-3" variableType="HTTP Response"></dbe-variable-list>
        </div>
    `
    static load({data, actionManager, setVariable}) {}
    static run({data, actionManager, setVariable}, req, res) {
        setVariable(data.get("req"), req)
        setVariable(data.get("res"), res)
        actionManager.runNext()
    }
}