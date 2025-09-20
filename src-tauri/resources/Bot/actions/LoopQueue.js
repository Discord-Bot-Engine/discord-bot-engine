import {  useQueue } from "discord-player";

export default class LoopQueue {
    static type = "Loop Queue"
    static title(data) {
        const mode = data.get("mode")
        const modes = {
            Disable: `Disable loop in "${data.get("server")}" queue`,
            Song: `Loop current song in "${data.get("server")}" queue`,
            Queue: `Loop all songs in "${data.get("server")}" queue`,
            Autoplay: `Autoplay songs in "${data.get("server")}" queue`
        }
        return modes[mode]
    }
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
    static async run({data, actionManager}) {
        const server = actionManager.getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const mode = data.get("mode")
        const modes = {
            Disable: 0,
            Song: 1,
            Queue: 2,
            Autoplay: 3
        }
        queue.setRepeatMode(modes[mode])
        actionManager.runNext()
    }
}