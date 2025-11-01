import {  useQueue } from "discord-player";

export default class LoopQueue {
    static type = "Loop Queue"
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Mode"></dbe-label>
            <dbe-select name="mode" class="col-span-3" values="Disable,Song,Queue,Autoplay"></dbe-select>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const mode = data.get("mode")
        const modes = {
            Disable: 0,
            Song: 1,
            Queue: 2,
            Autoplay: 3
        }
        queue.setRepeatMode(modes[mode])
        actionManager.runNext(id, "action")
    }
}