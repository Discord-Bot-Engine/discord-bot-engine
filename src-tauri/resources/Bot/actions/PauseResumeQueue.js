import {  useQueue } from "discord-player";

export default class PauseResumeQueue {
    static type = "Pause/Resume Queue"
    static variableTypes = ["Server"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Action"></dbe-label>
            <dbe-select name="action" class="col-span-3" value="Pause" values="Pause,Resume"></dbe-select>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const pause = data.get("action") === "Pause"
        queue.node.setPaused(pause)
        actionManager.runNext(id, "action")
    }
}